// To deploy run:
// npx hardhat run scripts/deployHouseNFT.js --network mumbai
const hre = require("hardhat");

async function main() {
  const HouseNFT = await hre.ethers.getContractFactory("HouseNFT");
  const houseNFT = await HouseNFT.deploy();

  await houseNFT.deployed();

  console.log("House NFT deployed to:", houseNFT.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
