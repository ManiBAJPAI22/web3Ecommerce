// const { ethers } = require("ethers");
import { ethers } from "ethers";
import { CONSTANTS } from '../constants.js'
import { ABI } from '../contracts/abis/customNFT.js'
import orders from '../models/orderModel.js';
// const { ABI } = require("../contracts/abis/customNFT");

export async function issueNFT(wallet, imageUrl, nftType, value, sellerId, order_id, source) {
    try {
        console.log("entered");

        const provider = new ethers.providers.JsonRpcProvider(CONSTANTS["1337-RPC_URL"]);
        const contractABI = ABI.CUSTOMNFT;

        const contractAddress = CONSTANTS["1337-CUSTOMNFT"];

        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);

        const gasLimit = await contractWithSigner.estimateGas.issueNFT(wallet, imageUrl, nftType, value, sellerId);
        const tx = await contractWithSigner.issueNFT(wallet, imageUrl, nftType, value, sellerId, { gasLimit });
        console.log(tx?.hash);

       source && await orders.findOneAndUpdate({_id:order_id},{tokenTransID:tx?.hash})

    } catch (error) {
        console.log(error)
    }

}

export async function getNFTDataByWallet(wallet) {

    try {
        const provider = new ethers.providers.JsonRpcProvider(CONSTANTS["1337-RPC_URL"]);
        const contractABI = ABI.CUSTOMNFT;

        const contractAddress = CONSTANTS["1337-CUSTOMNFT"];


        const contract = new ethers.Contract(contractAddress, contractABI, provider);


        const nftData = await contract.getNFTsByWallet(wallet);
        // console.log({ nftData });
        return nftData;

    } catch (error) {
        console.log(error)
        return [];
    }

}

export async function getNFTDataByWalletExp(wallet) {
    try {
        // console.log(wallet)
        const provider = new ethers.providers.JsonRpcProvider(CONSTANTS["1337-RPC_URL"]);
        const contractABI = ABI.CUSTOMNFT;

        const contractAddress = CONSTANTS["1337-CUSTOMNFT"];


        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const nftDataExp = await contract.getNFTsByWalletExp(wallet);
        // console.log({ nftDataExp });
        return nftDataExp;

    } catch (error) {
        // console.log(error)
        return []
    }


}
export async function expireNFT(tokenID, wallet) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(CONSTANTS["1337-RPC_URL"]);
        const contractABI = ABI.CUSTOMNFT;

        const contractAddress = CONSTANTS["1337-CUSTOMNFT"];


        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        await contractWithSigner.expireNFT(tokenID, wallet);
        return true;

    } catch (error) {
        console.log(error);
        return false;
    }



}

export async function autoEXPIRENFT(tokenId) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(CONSTANTS["1337-RPC_URL"]);
        const contractABI = ABI.CUSTOMNFT;

        const contractAddress = CONSTANTS["1337-CUSTOMNFT"];


        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        const signer = provider.getSigner();
        const contractWithSigner = contract.connect(signer);
        await contractWithSigner.autoExpireNFT(tokenId);

    } catch (error) {
        console.log(error);
    }



}

export const hexToDecimal = (hexValue) => {

    const decimalValue = parseInt(hexValue, 16);
    return decimalValue
}

export const unSigningAddress = async (addr, sign) => {
    try {
      let message = 'Please sign your public address for authorized API calls'
  
      const signerAddress = ethers.utils.verifyMessage(message, sign);
      if (signerAddress !== addr) {
        return false
      }
      else {
        return true
      }
    } catch (error) {
      console.log("Error", error)
    }
  
  }

//   testing Code

//   export const getAllmintedNFTSSpecific = async () =>
//   {
//     try {
//         const provider = new ethers.providers.JsonRpcProvider(CONSTANTS["1337-RPC_URL"]);
//         const contractABI = ABI.CUSTOMNFT;

//         const contractAddress = CONSTANTS["1337-CUSTOMNFT"];


//         const contract = new ethers.Contract(contractAddress, contractABI, provider);

//         const signer = provider.getSigner();
//         const contractWithSigner = contract.connect(signer);
//         let allToken=await contractWithSigner.getAllMintedNFTs();
//         return allToken;
        
//     } catch (error) {
//         console.log(error);
//         return [];
//     }
//   }
// module.exports = { issueNFT, getNFTDataByWallet, getNFTDataByWalletExp, expireNFT, autoEXPIRENFT }