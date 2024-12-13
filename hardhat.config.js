require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337, // 將 chainId 設為 1337，與本地節點一致
      hardfork: "merge" // 確保 hardfork 設定為 "merge"
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337 // 將 chainId 設為 1337，確保與 hardhat 網絡一致
    }
  }
};
