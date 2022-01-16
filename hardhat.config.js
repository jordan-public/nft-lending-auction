require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");

console.log(process.cwd());
const fs = require('fs');
const mnemonic = fs.readFileSync("private/mnemonic").toString().trim();
const projectId = fs.readFileSync("private/projectId").toString().trim();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/`+projectId,
      accounts: {
        mnemonic: mnemonic,
      }
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: {
        mnemonic: mnemonic,
      },
    },
    harmony_testnet_shard_0: {
      url: `https://api.s0.b.hmny.io`,
      accounts: {
        mnemonic: mnemonic,
      },
    },    
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    artifacts: "./webapp/src/artifacts"
  },
};
