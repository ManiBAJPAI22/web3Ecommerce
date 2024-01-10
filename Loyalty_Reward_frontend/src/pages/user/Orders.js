import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import DropIn from "braintree-web-drop-in-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/cart";
const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();

  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  const checkoutHandler = async (amount) => {
    try {
      const {
        data: { key },
      } = await axios.get("/api/getkey");
      console.log("====================================");
      console.log(key);
      console.log("====================================");
      const {
        data: { order },
      } = await axios.post("/api/v1/payment/checkout", {
        amount,
      });

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "BIKE RENTAL",
        description: "BIKEEE",
        image: "https://avatars.githubusercontent.com/u/25058652?v=4",
        order_id: order.id,
        callback_url:
          "http://localhost:8080/api/v1/payment/paymentverification",
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#121212",
        },
        handler: async (response) => {
          // The response contains the razorpay_order_id, razorpay_payment_id, and razorpay_signature
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          // Now you need to send these details back to your server for verification
          // using another API endpoint on your server

          try {
            const response = await axios.post(
              "/api/v1/payment/paymentverification",
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                cart,
              }
            );

            if (response.data.success) {
              // Payment successful, handle success case here
              // For example, navigate to a success page or show a success message
              console.log("Payment successful");
              navigate(`/paymentsuccess?reference=${razorpay_payment_id}`); // Redirect to a success page
            } else {
              // Payment failed, handle failure case here
              // For example, show an error message to the user
              console.log("Payment failed");
            }
          } catch (error) {
            // Handle error from the server, if any
            console.log("Error during payment verification:", error);
          }
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log("Error during checkout:", error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);
  const handlePayment = async (orderId) => {
    try {
      console.log("====================================");
      console.log("kjjugui");
      console.log("====================================");
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        orderId,
      });
      setLoading(false);
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);
  return (
    <Layout title={"Your Orders"}>
      <div className="container-flui p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>
            {orders?.map((o, i) => {
              return (
                <div className="border shadow">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col"> date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createAt).fromNow()}</td>
                        <td>{o?.payment.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div>
                    {o?.status === "undone" ? (
                      <>
                        <h1>fddf</h1>
                        {clientToken && auth?.user?.address && (
                          <>
                            <h1>fddf</h1>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                const tot = o.distanceRidden * 5 + 1;
                                checkoutHandler(tot);
                              }} // Wrap the checkoutHandler call in an arrow function
                              // disabled={loading || !instance || !auth?.user?.address}
                            >
                              Make Payment
                            </button>
                            {/* <button
                              className="btn btn-primary"
                              onClick={() => checkoutHandler(o[0].price)}
                              // disabled={loading || !instance}
                            >
                              Please Complete ur full Payment
                            </button> */}
                          </>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="container">
                    {o?.products?.map((p, i) => (
                      <div className="row mb-2 p-3 card flex-row" key={p._id}>
                        <div className="col-md-4">
                          <img
                            src={p.imgUrl}
                            className="card-img-top"
                            alt={p.name}
                            width="100px"
                            height={"100px"}
                          />
                        </div>
                        <div className="col-md-8">
                          <p>{p.name}</p>
                          <p>{p.description.substring(0, 30)}</p>
                          <p>Price :	&#8377; {p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
