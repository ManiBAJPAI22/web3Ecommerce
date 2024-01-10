import React, { useState, useEffect } from 'react';
import Layout from './../components/Layout/Layout';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';
import { AiFillWarning } from 'react-icons/ai';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/CartStyles.css';
import Modal from 'react-modal';
import { hexToDecimal } from '../helper';
import { SOURCE_MAPPING } from '../constant';

const CartPage = () => {
  const [
    auth,
    setAuth,
    account,
    setAccount,
    signature,
    setsignature,
    tokenInUse,
    settokenInUse,
    totalValue,
    setTotalValue,
  ] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState('');
  const [instance, setInstance] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isOpen, setisOpen] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  const toggleDescription = id => {
    setExpandedDescriptions({
      ...expandedDescriptions,
      [id]: !expandedDescriptions[id],
    });
  };
  //total price
  const checkoutHandler = async amount => {
    try {
      const {
        data: { key },
      } = await axios.get('/api/getkey');
      console.log('====================================');
      console.log(key);
      console.log('====================================');
      const {
        data: { order },
      } = await axios.post('/api/v1/payment/checkout', {
        amount: 1,
      });
      console.log(cart);
      const options = {
        key,
        amount: order.amount,
        currency: 'INR',
        name: 'Flipkart Test',
        description: 'BIKEEE',
        image: 'https://avatars.githubusercontent.com/u/25058652?v=4',
        order_id: order.id,
        callback_url:
          'http://localhost:8000/api/v1/payment/paymentverification',
        theme: {
          color: '#121212',
        },
        handler: async response => {
          // The response contains the razorpay_order_id, razorpay_payment_id, and razorpay_signature
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          // Now you need to send these details back to your server for verification
          // using another API endpoint on your server
          try {
            const response = await axios.post(
              '/api/v1/payment/paymentverification',
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                cart,
                account,
              },
            );

            if (response.data.success) {
              // Payment successful, handle success case here
              // For example, navigate to a success page or show a success message
              console.log('Payment successful');

              for (let i = 0; i < tokenInUse?.length; i++) {
                console.log(tokenInUse[i]?.index, 'llllllllllllllllllllllll');
                await axios.post('/api/v1/chain/expireToken', {
                  signature,
                  address: account,
                  tokenId: tokenInUse[i]?.index,
                });
              }
              navigate(`/paymentsuccess?reference=${razorpay_payment_id}`); // Redirect to a success page

              //call api to expire token
            } else {
              // Payment failed, handle failure case here
              console.log('Payment failed');
            }
          } catch (error) {
            // Handle error from the server, if any
            console.log('Error during payment verification:', error);
          }
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log('Error during checkout:', error);
    }
  };

  const totalPrice = totalvalue => {
    try {
      let total = 0;
      cart?.map(item => {
        total = total + item.price;
      });
      if (total - totalValue >= 0) {
        total = total - totalValue;
      }
      return total.toLocaleString('en-US', {
        style: 'currency',
        currency: 'INR',
      });
    } catch (error) {
      console.log(error);
    }
  };
  //detele item
  const removeCartItem = pid => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex(item => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem('cart', JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  // const getToken = async () => {
  //   try {
  //     const { data } = await axios.get("/api/v1/product/braintree/token");
  //     setClientToken(data?.clientToken);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   getToken();
  // }, [auth?.token]);

  //handle payments
  // const handlePayment = async () => {
  //   try {
  //     setLoading(true);
  //     const { nonce } = await instance.requestPaymentMethod();
  //     const { data } = await axios.post("/api/v1/product/braintree/payment", {
  //       nonce,
  //       cart,
  //     });
  //     setLoading(false);
  //     localStorage.removeItem("cart");
  //     setCart([]);
  //     navigate("/dashboard/user/orders");
  //     toast.success("Payment Completed Successfully ");
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };
  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? 'Hello Guest'
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? '' : 'please login to checkout !'
                    }`
                  : ' Your Cart Is Empty'}
              </p>
            </h1>
          </div>
        </div>
        <div className="container ">
          <div className="row ">
            <div className="col-md-7  p-0 m-0">
              {cart?.map(p => (
                <div className="row card flex-row" key={p._id}>
                  <div className="col-md-4">
                    <img
                      src={p.imgUrl}
                      className="card-img-top"
                      alt={p.name}
                      width="100%"
                      height={'130px'}
                    />
                  </div>
                  <div className="col-md-6">
                    <p>{p.name}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <span>
                        {expandedDescriptions[p._id]
                          ? p.description
                          : p.description.substring(0, 30) + '...'}
                        <button
                          style={{
                            padding: 0,
                            margin: 0,
                            fontSize: 'inherit',
                            textAlign: 'left',
                            border: 'none',
                            background: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            color: 'blue', // You can set the color to match the link style
                          }}
                          onClick={() => toggleDescription(p._id)}
                        >
                          {expandedDescriptions[p._id]
                            ? 'Show Less'
                            : 'Show More'}
                        </button>
                      </span>
                    </div>

                    <p>Price : 	&#8377;{p.price}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {cart?.length > 0 ? (
              <div className="col-md-5 cart-summary ">
                <h2>Cart Summary</h2>
                <p>Total | Checkout | Payment</p>
                <hr />
                <h4>Total : {totalPrice(totalValue)} </h4>
                {auth?.user?.address ? (
                  <>
                    <div className="mb-3">
                      <h4>Current Address</h4>
                      <h5>{auth?.user?.address}</h5>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => navigate('/dashboard/user/profile')}
                      >
                        Update Address
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mb-3">
                    {auth?.token ? (
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => navigate('/dashboard/user/profile')}
                      >
                        Update Address
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-warning"
                        onClick={() =>
                          navigate('/login', {
                            state: '/cart',
                          })
                        }
                      >
                        Plase Login to checkout
                      </button>
                    )}
                  </div>
                )}
                <div className="mt-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => checkoutHandler(cart[0].price)}
                  >
                    Make Payment
                  </button>
                </div>
                {account != '' && (
                  <div className="mt-2">
                    <button
                      className="btn btn-danger"
                      onClick={() => setisOpen(true)}
                    >
                      Use Reward Points
                    </button>
                    <br />
                    {tokenInUse.length} Reward Points Selected
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
        {isOpen && (
          <TokenModal
            isOpen={isOpen}
            setisOpen={setisOpen}
            tokenInUse={tokenInUse}
            settokenInUse={settokenInUse}
            totalValue={totalValue}
            setTotalValue={setTotalValue}
            originalCost={totalPrice(0)}
            signature={signature}
            address={account}
          />
        )}
      </div>
    </Layout>
  );
};

export function NFTCard({ nftData, onClick, isSelected, id, expiredNFT }) {
  // console.log(expiredNFT[id]?.[1],id, 'jkjkjkj');

  const cardStyle = {
    backgroundColor: expiredNFT[id]?.[1] ? 'lightgrey' : 'white',
    border: isSelected ? '2px solid blue' : '1px solid #ccc',
    borderRadius: '10px', // Rounded corners
    padding: '20px',
    margin: '10px',
    width: '180px',
    height: '300px', // Fixed height
    textAlign: 'center',
    cursor: 'pointer',
    pointerEvents: expiredNFT[id]?.[1] && 'none',
    // backgroundColor: 'white', // Background color
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow effect
    transition: 'transform 0.3s ease-in-out', // Smooth transform transition
    ':hover': {
      transform: 'scale(1.05)', // Scale effect on hover
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: '#333', // Dark grey text color
    fontFamily: '"Arial", sans-serif', // Set the font family
    lineHeight: '1.5', // Line spacing
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };
  const titleStyle = {
    fontSize: '18px', // Font size for title
    fontWeight: 'bold', // Bold text for title
  };
  const type = {
    fontSize: '18px', // Font size for title
    fontWeight: 'bold', // Bold text for title
    backgroundColor:"grey",
    color:"white",
  
  
  };
  const descriptionStyle = {
    fontSize: '14px',
  };
  return (
    <div className="nft-card" style={cardStyle} onClick={onClick}>
      <img src={nftData[0]} alt="NFT" />
      <p style={titleStyle}>BY: {SOURCE_MAPPING[hexToDecimal(nftData[1]?.hex)]}</p>
      <p style={descriptionStyle}>Coupon: 	&#8377; {hexToDecimal(nftData[2]?.hex)}</p>
      <p style={type}> {expiredNFT[id]?.[1] ? 'Expired' : 'Available'}</p>
    </div>
  );
}

export const TokenModal = ({
  isOpen,
  setisOpen,
  settokenInUse,
  tokenInUse,
  totalValue,
  setTotalValue,
  originalCost,
  signature,
  address,
}) => {
  // const [totalValue1, setTotalValue1] = useState(0);
  const [originalNFT, setoriginalNFT] = useState([]);
  const [expiredNFT, setexpiredNFT] = useState([]);

  const getNFTarrayforWallet = async () => {
    const { data } = await axios.post('/api/v1/chain/getnftbywallet', {
      signature,
      address,
    });
    console.log(data?.array);
    setoriginalNFT(data?.array);
  };

  const getNFTarrayEXPforWallet = async () => {
    const { data } = await axios.post('/api/v1/chain/getnftbywalletEXP', {
      signature,
      address,
    });
    console.log(data?.array);

    setexpiredNFT(data?.array);
  };
  const callit = () => {
    console.log(tokenInUse);
    for (let i = 0; i < tokenInUse?.length; i++) {
      console.log(tokenInUse[i]?.index, 'llllllllllllllllllllllll');
      // await axios.post('/api/v1/chain/expireToken',{
      //   signature,address,
      // })
    }
  };

  useEffect(() => {
    getNFTarrayforWallet();
    getNFTarrayEXPforWallet();
    // callit();
  }, []);

  const [selectedNFTs, setSelectedNFTs] = useState([]);
  // console.log(tokenInUse);
  const toggleNFTSelection = (index, nft) => {
    // console.log(index, tokenInUse,"yyyymmmmmmmmyyy")
    const isSelected = tokenInUse.some((nft, id) => nft.index === index);
    // console.log(isSelected);
    if (isSelected) {
      settokenInUse(tokenInUse.filter(nft => nft.index !== index));
    } else {
      const newTotalValue = totalValue + hexToDecimal(nft[2]?.hex);
      setTotalValue(newTotalValue);
      // console.log(newTotalValue,originalCost,"mmmmmmm");
      if (newTotalValue > 2000) {
        toast.error('Value threshold exceeded. Cannot select more NFTs.');
      } else {
        settokenInUse([
          ...tokenInUse,
          { index, value: hexToDecimal(nft[2]?.hex) },
        ]);
      }
    }
    // if (tokenInUse.includes(index)) {
    //   settokenInUse(tokenInUse.filter((item) => item !== index));
    // } else {
    //   settokenInUse([...tokenInUse, index]);
    // }
    // console.log(tokenInUse)
  };

  Modal.setAppElement('#root');

  const nfts = [
    {
      imageUrl:
        'https://flipkarbucket.s3.ap-south-1.amazonaws.com/Tokens/WhatsApp+Image+2023-08-20+at+01.53.38.jpeg',
      nftType: 'Type A',
      value: 100,
    },
    {
      imageUrl:
        'https://flipkarbucket.s3.ap-south-1.amazonaws.com/Tokens/WhatsApp+Image+2023-08-20+at+01.53.27.jpeg',
      nftType: 'Type B',
      value: 200,
    },
    {
      imageUrl:
        'https://flipkarbucket.s3.ap-south-1.amazonaws.com/Tokens/WhatsApp+Image+2023-08-20+at+01.53.38.jpeg',
      nftType: 'Type A',
      value: 100,
    },
    {
      imageUrl:
        'https://flipkarbucket.s3.ap-south-1.amazonaws.com/Tokens/WhatsApp+Image+2023-08-20+at+01.53.27.jpeg',
      nftType: 'Type B',
      value: 200,
    },
    {
      imageUrl:
        'https://flipkarbucket.s3.ap-south-1.amazonaws.com/Tokens/WhatsApp+Image+2023-08-20+at+01.53.38.jpeg',
      nftType: 'Type A',
      value: 100,
    },
    {
      imageUrl:
        'https://flipkarbucket.s3.ap-south-1.amazonaws.com/Tokens/WhatsApp+Image+2023-08-20+at+01.53.27.jpeg',
      nftType: 'Type B',
      value: 200,
    },
    {
      imageUrl:
        'https://flipkarbucket.s3.ap-south-1.amazonaws.com/Tokens/WhatsApp+Image+2023-08-20+at+01.53.38.jpeg',
      nftType: 'Type A',
      value: 100,
    },
    {
      imageUrl:
        'https://flipkarbucket.s3.ap-south-1.amazonaws.com/Tokens/WhatsApp+Image+2023-08-20+at+01.53.27.jpeg',
      nftType: 'Type B',
      value: 200,
    },
    {
      imageUrl:
        'https://flipkarbucket.s3.ap-south-1.amazonaws.com/Tokens/WhatsApp+Image+2023-08-20+at+01.53.38.jpeg',
      nftType: 'Type A',
      value: 100,
    },
    {
      imageUrl:
        'https://flipkarbucket.s3.ap-south-1.amazonaws.com/Tokens/WhatsApp+Image+2023-08-20+at+01.53.27.jpeg',
      nftType: 'Type B',
      value: 200,
    },
    {
      imageUrl:
        'https://flipkarbucket.s3.ap-south-1.amazonaws.com/Tokens/WhatsApp+Image+2023-08-20+at+01.53.38.jpeg',
      nftType: 'Type A',
      value: 100,
    },
    {
      imageUrl:
        'https://flipkarbucket.s3.ap-south-1.amazonaws.com/Tokens/WhatsApp+Image+2023-08-20+at+01.53.27.jpeg',
      nftType: 'Type B',
      value: 200,
    },
    // Add more NFT objects
  ];

  useEffect(() => {
    // console.log(originalNFT[1]?.[2],"mmmmm")
    const newTotalValue = tokenInUse.reduce(
      (sum, nft) => sum + hexToDecimal(originalNFT[nft.index]?.[2]?.hex),
      0,
    );
    // console.log(newTotalValue,"nnnnnkkk")
    setTotalValue(newTotalValue);
  }, [tokenInUse, originalNFT]);
  const [isHovered, setHovered] = useState(false);
  return (
    <Modal
      isOpen={isOpen}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          overflowY: 'auto',
          padding: '30px',
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      // onRequestClose={closeModal}
      // contentLabel="NFT Modal"
    >
      <div style={{ position: 'relative' }}>
        <button
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: isHovered ? 'black' : 'transparent',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '32px',
            cursor: 'pointer',
            color: isHovered ? 'white' : 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => {
            setisOpen(false);
          }}
        >
          ×
        </button>
        <h2>NFTs</h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          { (originalNFT?.length >0) ? originalNFT.map((nft, index) => (
            <NFTCard
              nftData={nft}
              key={index}
              id={index}
              isSelected={tokenInUse.some(nft => nft.index === index)}
              onClick={() => toggleNFTSelection(index, nft)}
              expiredNFT={expiredNFT}
            />
          )): <h3>No Available Reward Points</h3>}
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <button
            className="close-button"
            onClick={() => {
              setisOpen(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CartPage;
