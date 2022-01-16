// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract HouseNFT is ERC721URIStorage {
    uint256 public lastHouseId = 0;

    constructor() ERC721("House", "HOUSE") {
        mint(msg.sender);
    }

    function mint(address to) public returns (uint256) {
        _mint(to, lastHouseId);
        _setTokenURI(lastHouseId, "https://img.icons8.com/color/48/000000/cottage.png");
        return lastHouseId++;
    }
}
