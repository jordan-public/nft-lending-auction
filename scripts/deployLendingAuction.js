// To deploy run:
// npx hardhat run scripts/deployHouseNFT.js --network mumbai
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const LendingAuction = await hre.ethers.getContractFactory("LendingAuction");
  const lendingAuction = await LendingAuction.deploy();

  await lendingAuction.deployed();

  const txHash = lendingAuction.deployTransaction.hash;
  const txReceipt = await hre.ethers.provider.waitForTransaction(txHash);

  let deployments = {}
  if (fs.existsSync('webapp/src/util/deployment.json')) {
    deployments = JSON.parse(fs.readFileSync('webapp/src/util/deployment.json').toString());
    if (!deployments['LendingAuction']) deployments['LendingAuction'] = {}
    deployments['LendingAuction'][lendingAuction.deployTransaction.chainId] = txReceipt.contractAddress;
  } else {
    let a = {}
    a[lendingAuction.deployTransaction.chainId] = txReceipt.contractAddress;
    deployments['LendingAuction'] = a
  }

  fs.writeFileSync('webapp/src/util/deployment.json', JSON.stringify(deployments));

  console.log("LendingAuction deployed to:", txReceipt.contractAddress, "on chain: ", lendingAuction.deployTransaction.chainId);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
