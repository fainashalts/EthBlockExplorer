/**
* @module userInput;
* @requires module:web3
*/

const Web3 = require("web3");
const infura = "https://mainnet.infura.io/";
const web3 = new Web3(new Web3.providers.HttpProvider(infura));

var EthBlockExplorer = {

  /**
  * gets latest mined block
  * @returns {Int} block
  */
  getLatestBlock: function() {
    const block =  web3.eth.blockNumber;
    return block;  
  },

  /**
  * gets Block object with block information as well as transaction information 
  * @param {Int} blockNumber 
  * @returns {Object} 
  */
  getBlock: function(blockNumber) {
    let blockObject = {};
    const block =  web3.eth.getBlock(blockNumber, true);

    blockObject.blockNumber = blockNumber;
    blockObject.totalTransactions = Object.keys(block.transactions).length; 
    blockObject.transactions = block.transactions;
    
    return blockObject;
  },

  /**
  * @param {Object} transaction 
  * @returns {Object} transactionObject
  */
  processTransaction: function(transaction) {
    let self = this;
    let transactionObject = {};

    transactionObject.blockNumber = transaction.blockNumber;
    transactionObject.fromAddress = transaction.from;
    transactionObject.toAddress = transaction.to;

    if(transaction.value > 0) {
        var transaction_value = transaction.value *  Math.pow(10, -18);
        transactionObject.ether = transaction_value.toFixed(5);
    } else {
        transactionObject.ether = 0;
    }
    
    return transactionObject;
  },

  /**
  * sum the values in an array
  * @param {Array} arrayToReduce
  * @returns {Int} sum of array values
  */
  aggregate: function(arrayToReduce){
    const sum = arrayToReduce.reduce((total, amount) => parseFloat(total) + parseFloat(amount)); 
    return sum;
  },

  /**
  * @param {Object} transaction
  * @returns {Int}
  */
  transactionAmount: function(transaction) {
    return transaction.ether;
  }, 

  /**
  * @param {Object} transaction
  * @returns {Int}
  */
  numberOfTransactions: function(block) {
    return block.totalTransactions;
  },

  /**
  * @param {Object} transaction
  * @returns {Address}
  */
  fromAddress: function(transaction) {
    const fromAddress = transaction.fromAddress;
    return fromAddress;
  },

  /**
  * @param {Object} transaction
  * @returns {Address}
  */
  toAddress: function(transaction) {
    const toAddress = transaction.toAddress;
    return toAddress;
  },

   /**
  * check whether address passed is unique
  */
  unique: function(value, index, self) { 
    return self.indexOf(value) === index;
  },

  /**
  * @param {String} address
  * @returns {Object} contractCheck
  */
  checkContract: function(address) {
  
    const isContract = web3.eth.getCode(address);
    var contractCheck = {}; 
    
    if (isContract !== '0x') {
      contractCheck[address] = {"address": address, "contract": "is a contract ", amount: 0}
    } else {
      contractCheck[address] = {"address": address, "contract": "is not a contract ", amount: 0}
    }
    
    return contractCheck;
  },

  /**
  * async
  * @param {Object} transactionData
  * @returns {Object}
  */
  addressesWithContract: async function(data, query, transactionData){

    let self = this;
    let promises = [];
    let addressesArray = data[query];
    let iteratorData;
    let addressesObject = {};

    for(let i = 0; i < addressesArray.length; i+=10) {
      if(i <= addressesArray.length - 10) {
        iteratorData = addressesArray.slice(i, (i + 10));
      } else {
        iteratorData = addressesArray.slice(i, (addressesArray.length));
      }

      let promise  = iteratorData.map(self.checkContract);

      promises.push(promise);
    }

    const allPromises = await Promise.all(promises);

    var newArray = [];
    
    for(let j = 0; j < allPromises.length; j++) {
      newArray = newArray.concat(allPromises[j]);
    }
  
    return newArray;
  },

  /**
  * @async
  * @param {Array} fromAddresses
  * @param {Array} toAddresses
  * @returns {Object}
  */
  getUniqueAddresses: async function(fromAddresses, toAddresses) {
    let self = this;

    const uniqueFrom = fromAddresses.filter(self.unique);
    const uniqueFromAddresses = uniqueFrom.filter(address=> address !== null); 
    const uniqueTo = toAddresses.filter(self.unique); 
    const uniqueToAddresses = uniqueTo.filter(address=> address !== null); 

    await Promise.all(uniqueFrom, uniqueFromAddresses, uniqueTo, uniqueToAddresses)
    return {uniqueFromAddresses, uniqueToAddresses};

  },
  /**
  * @async
  * @param {Object} blockData
  * @param {Object} transactionData
  * @returns {Object}
  */
  addressList: async function(blockData, transactionData) {
    let self = this;
    let aggregateData = {};
    
    
    const amountsTransferred = await transactionData.map(self.transactionAmount);
    const fromAddresses = transactionData.map(self.fromAddress); 
    const toAddresses = transactionData.map(self.toAddress);

    await Promise.all(amountsTransferred, fromAddresses, toAddresses);

    const uniqueAddresses = await self.getUniqueAddresses(fromAddresses, toAddresses);
  

    if(transactionData.length > 0) {
      aggregateData["Total Amount of Ether Transferred"] = self.aggregate(amountsTransferred);
      aggregateData["Unique Addresses Sending Ether"] = uniqueAddresses.uniqueFromAddresses;
      aggregateData["Unique Addresses Receiving Ether"] = uniqueAddresses.uniqueToAddresses;
    } else {
      aggregateData["Total Amount of Ether Transferred"] = "0 Ether";
      aggregateData["Unique Addresses Receiving Ether"] = "None"
      aggregateData["Number of Unique Addresses Receiving Ether"] = "0";
      aggregateData["Unique Addresses Sending Ether"] = "None";
      aggregateData["Number of Unique Addresses Sending Ether"] = "0";
    }
    

    return aggregateData;
  }, 

  /**
  * @async
  * get transaction level data for the query
  * @param {Array} transactions
  * @returns {Object}
  */
  transactionData: async function(transactions) {
    let self = this; 
    const transactionData = await transactions.map(self.processTransaction);

    return transactionData;
  },

  /**
  * @async
  * get block level data for the query
  * @param {Array} blockRange
  * @returns {Object}
  */
  blockData: async function(blockRange) {
    let self = this;
    const blockList = Array(blockRange[1] - blockRange[0] + 1).fill().map((item, index) =>parseInt(blockRange[0]) + index);
    const blockData = await blockList.map(self.getBlock);

    return blockData;
  }, 

  /**
  * @async  
  * @param {Array} toAddresses
  * @param {Array} fromAddresses
  * @param {Object} transactionData
  * @returns {Object}
  */
  addAmount: async function(toAddresses, fromAddresses, transactionData) {
  
    var toAddressesObject = toAddresses.reduce((r,c) => Object.assign(r,c), {});
    var fromAddressesObject = fromAddresses.reduce((r,c) => Object.assign(r,c), {});

    for(tx in transactionData) {
     if(toAddressesObject[transactionData[tx].toAddress] !== null && typeof toAddressesObject[transactionData[tx].toAddress] !== 'undefined'){
      toAddressesObject[transactionData[tx].toAddress].amount += parseFloat(transactionData[tx].ether);
     } 
     fromAddressesObject[transactionData[tx].fromAddress].amount += parseFloat(transactionData[tx].ether);
    }

    return {toAddressesObject, fromAddressesObject};
  },

  /**
  * 
  * @param {Array} addressObjects
  * @param {String} text
  * 
  */
  displayAddresses: function(addressObjects, text){
    let displayAddresses = [];
    
    for(element in addressObjects) {
      let addressToDisplay = "Address " + addressObjects[element].address + " " + addressObjects[element].contract + text + addressObjects[element].amount + " Ether in total";
      displayAddresses.push(addressToDisplay);
    }
    
    return displayAddresses; 
  },
  /**
  * @async
  * main function for block explorer query
  * @param {Array} blockRange
  * 
  */
  blockExplorerData: async function(blockRange) {
    let self = this;
    const blockData = await self.blockData(blockRange);
    let transactions = blockData[0].transactions;

    for (let i = 1; i < blockData.length; i++) {
      transactions = transactions.concat(blockData[i].transactions);
    }

    const transactionData = await self.transactionData(transactions);
    
    const aggregateData = await self.addressList(blockData, transactionData);

    if(transactions.length > 0) {

      const toAddresses =  await self.addressesWithContract(aggregateData, "Unique Addresses Receiving Ether", transactionData);
      const fromAddresses = await self.addressesWithContract(aggregateData, "Unique Addresses Sending Ether", transactionData);
      
      const addressesWithAmount = await self.addAmount(toAddresses, fromAddresses, transactionData);
   
      const toDisplayAddresses =  self.displayAddresses(addressesWithAmount.toAddressesObject, "and received ");
      const fromDisplayAddresses =  self.displayAddresses(addressesWithAmount.fromAddressesObject, "and sent ");
    
      aggregateData["Number of Unique Addresses Sending Ether"] = fromDisplayAddresses.length;
      aggregateData["Unique Addresses Sending Ether"] = fromDisplayAddresses;
      aggregateData["Number of Unique Addresses Receiving Ether"] = toDisplayAddresses.length;
      aggregateData["Unique Addresses Receiving Ether"] = toDisplayAddresses;
      aggregateData["Transaction-Level Data"] = transactionData;
    }

    console.log("ETHEREUM CASH FLOW REPORT FOR BLOCK " + blockRange[0] + " THROUGH BLOCK " + blockRange[1])
    console.log(JSON.stringify(aggregateData, null, 2));

  }

}



module.exports = EthBlockExplorer;
