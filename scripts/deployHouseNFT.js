// To deploy run:
// npx hardhat run scripts/deployHouseNFT.js --network mumbai
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const HouseNFT = await hre.ethers.getContractFactory("HouseNFT");
  const houseNFT = await HouseNFT.deploy();

  await houseNFT.deployed();

  const txHash = houseNFT.deployTransaction.hash;
  const txReceipt = await hre.ethers.provider.waitForTransaction(txHash);

  let deployments = {}
  if (fs.existsSync('webapp/src/util/deployment.json')) {
    deployments = JSON.parse(fs.readFileSync('webapp/src/util/deployment.json').toString());
    if (!deployments['HouseNFT']) deployments['HouseNFT'] = {}
    deployments['HouseNFT'][houseNFT.deployTransaction.chainId] = txReceipt.contractAddress;
  } else {
    let a = {}
    a[houseNFT.deployTransaction.chainId] = txReceipt.contractAddress;
    deployments['HouseNFT'] = a
  }

  fs.writeFileSync('webapp/src/util/deployment.json', JSON.stringify(deployments));

  console.log("HouseNFT deployed to:", txReceipt.contractAddress, "on chain: ", houseNFT.deployTransaction.chainId);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
