// SPDX-License-Identifier: MIT

pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract HouseNFT is ERC721URIStorage {
    uint256 private lastHouseId = 0;

    constructor() ERC721("House", "HOUSE") {}

     function toTokenID(address owner, string memory CID) public pure returns (uint256) { 
        return(uint256(keccak256(abi.encodePacked(owner, CID)))); 
    }

    function mint(address to) external returns (uint256) {
        _mint(to, ++lastHouseId);
        _setTokenURI(lastHouseId, "https://img.icons8.com/color/48/000000/cottage.png");
        return lastHouseId;
    }
}
