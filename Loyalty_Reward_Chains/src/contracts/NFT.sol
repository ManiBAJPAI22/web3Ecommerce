// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CustomNFT is ERC721, Ownable {
    using Counters for Counters.Counter;

    struct NFTData {
        string imageUrl;
        uint256 nftType;
        uint256 value;
        string sellerId;
        // uint256 typo;
        uint256 expiryTimestamp;
    }
   
    Counters.Counter private _tokenCounter;

    mapping(address => uint256[]) private _walletNFTs;
    mapping(uint256 => NFTData) private _nftData;
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}
 event LogMessage(string message);


function issueNFT(
    address wallet,
    string memory imageUrl,
    uint256 nftType,
    uint256 value,
    string memory sellerId
) external {
    require(wallet != address(0), "Invalid wallet address");
    require(msg.sender != wallet, "Wallet cannot be the same as the sender");

    uint256 tokenId = _tokenCounter.current();
    _mint(wallet, tokenId);

    NFTData memory nft = NFTData({
        imageUrl: imageUrl,
        nftType: nftType,
        value: value,
        sellerId: sellerId,
        expiryTimestamp: block.timestamp
    });
    _nftData[tokenId] = nft;
    _walletNFTs[wallet].push(tokenId);

    _tokenCounter.increment();
    
}

  function getNFTsByWallet(address wallet) external view returns (NFTData[] memory) {
    uint256[] memory tokenIds = _walletNFTs[wallet];
    NFTData[] memory nfts = new NFTData[](tokenIds.length);

    for (uint256 i = 0; i < tokenIds.length; i++) {
        uint256 tokenId = tokenIds[i];
        // require(_exists(tokenId), "NFT does not exist"); 
        
        nfts[i] = _nftData[tokenId];
    }

    return nfts;
}
  function getNFTsByWalletExp(address wallet) external view returns (Tuple[] memory) {
    uint256[] memory tokenIds = _walletNFTs[wallet];
    Tuple[] memory result = new Tuple[](tokenIds.length);

    for (uint256 i = 0; i < tokenIds.length; i++) {
        uint256 tokenId = tokenIds[i];
        bool isExpired = !_exists(tokenId);
        result[i] = Tuple(tokenId, isExpired);
    }

    return result;
}

struct Tuple {
    uint256 tokenId;
    bool isExpired;
}

    function getNFTData(uint256 tokenId) external view returns (NFTData memory) {
        return _nftData[tokenId];
    }

    function expireNFT(uint256 tokenId, address wallet) external {
        require(_isApprovedOrOwner(wallet, tokenId), "Not approved or owner");
        require(_exists(tokenId), "NFT already expired");

        _burn(tokenId);
    }

function autoExpireNFT(uint256 tokenId) external {
    require(_exists(tokenId), "NFT doesn't exist");

    uint256 expiryTimestamp = _nftData[tokenId].expiryTimestamp;

    require(expiryTimestamp > 0, "NFT already expired"); // Ensure the expiry timestamp is set

    uint256 thirtyDaysInSeconds = 30 days;
    if (expiryTimestamp + thirtyDaysInSeconds <= block.timestamp) {
        _burn(tokenId);
    }
}

   function getAllMintedNFTs() external view returns (NFTData[] memory) {
        NFTData[] memory allNFTs = new NFTData[](_tokenCounter.current());

        for (uint256 i = 0; i < _tokenCounter.current(); i++) {
            allNFTs[i] = _nftData[i];
        }

        return allNFTs;
    }

   

    function _isExpired(uint256 tokenId) external view returns (bool) {
        return !_exists(tokenId);
    }
}