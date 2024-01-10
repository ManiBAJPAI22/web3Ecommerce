// const Token = artifacts.require("Token");
// module.exports = async function (deployer) {
//     let acc1 = await web3.eth.getAccounts();
//     console.log(acc1,"==========")
//     let feeacc = acc1[0];
//     await deployer.deploy(Token);
// }
const CustomNFT = artifacts.require("CustomNFT");

module.exports = function (deployer) {
  // Deploy the contract
  deployer.deploy(CustomNFT, "Custom NFT", "CNFT");
};