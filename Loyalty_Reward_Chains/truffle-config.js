

require('dotenv').config();

module.exports = {


  networks: {
    development: {
      host: "127.0.0.1",
      port: "7545",
      network_id: "*"
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0", // Use the version you need
      optimizer: {
        enabled: true,
        runs: 200
      }     // Fetch exact version from solc-bin (default: truffle's version)
    }
  },


};
