require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("hardhat-gas-reporter")

/** @type import('hardhat/config').HardhatUserConfig */
const goerli_RPC_URL = process.env.GEORLI_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const CoinMarketCap_API_KEY = process.env.CoinMarketCap_API_KEY 
module.exports = {
  defaultNetwork:"hardhat",
  networks:{
    goerli:{
      url: goerli_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId:5,
      blockConfirmations:6,
    },
    localhost:{
      url:"http://127.0.0.1:8545/",
      chainId:31337
    }
  },
  solidity:{
      compilers:[
        {version:"0.8.17"},
        {version:"0.6.0"},
        {version:"0.6.6"}
      ]
  },
  etherscan:{
    apiKey:ETHERSCAN_API_KEY
  },
  gasReporter:{
    enabled:true,
    outputFile:"gas-report.txt",
    noColors:true,
    currency:"USD",
    coinmarketcap : CoinMarketCap_API_KEY,
    token:"MATIC"
  },
  namedAccounts:{
    deployer:{
      default:0
    },
    user:{
      default:1
    }
   
  },
  mocha: {
    timeout: 100000000
  }
};
