import { ethers, providers } from "ethers";

export const connectWallet = async () => {
    if (window.ethereum) {
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return {
            accountFound: true,
            account: account[0]
        }
    } else {
        return {
            accountFound: false,
            account: ""
        }
    }

}

export const signMessage = async (message = 'Please sign your public address for authorized API calls') => {
    try {
        if (isWalletInstalled()) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const signature = await signer.signMessage(message);
            const address = await signer.getAddress();
            return {
                signature,
                address,
            };
        }
    } catch (err) {
        // console.log(err);
    }
};


const isWalletInstalled = () => {
    if (!window.ethereum) {
        throw new Error("No crypto wallet found. Please install it.");
    } else {
        return true;
    }
};

export const hexToDecimal = (hexValue) => {

    const decimalValue = parseInt(hexValue, 16);
    return decimalValue
}