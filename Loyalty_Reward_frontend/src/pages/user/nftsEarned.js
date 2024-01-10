import Layout from './../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../../styles/CartStyles.css';
import Modal from 'react-modal';
import { hexToDecimal } from '../../helper';
import { SOURCE_MAPPING } from '../../constant';
import {useAuth} from '../../context/auth';

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

const NftsEarned = () => {
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
  return (
    <Layout title={'NFTs Earned'}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
                <h2 className="text-center">NFTs Earned</h2>
                <TokenModal
                    tokenInUse={tokenInUse}
                    settokenInUse={settokenInUse}
                    totalValue={totalValue}
                    setTotalValue={setTotalValue}
                    signature={signature}
                    address={account}
                />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const TokenModal = ({
    isOpen,
    setisOpen,
    settokenInUse,
    tokenInUse,
    totalValue,
    setTotalValue,
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
          >
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

          </div>
        </div>
    );
  };
  
export default NftsEarned;