#!/usr/bin/env node

require('dotenv').config();

const Web3 = require("./node_modules/web3/index.js");
const infura = "https://mainnet.infura.io/v3/64c79016769d462395d3183a11b4d4a7";
const web3 = new Web3(new Web3.providers.HttpProvider(infura));

// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

if(web3.isConnected()) {
  console.log('is connected');
}
console.log(web3.currentProvider);
console.log(web3.eth.getBlock(1757201));