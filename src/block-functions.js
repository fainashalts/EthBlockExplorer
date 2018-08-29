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
    try {
      const block =  web3.eth.blockNumber;
      return block;
    } 
    catch(err) {
      console.log(err);
    }
   
  },

  /**
  * gets Block object with block information as well as transaction information 
  * @param {Int} blockNumber 
  * @returns {Object} 
  */
  getBlock: function(blockNumber) {

    let blockObject = {}
    try {
      const block =  web3.eth.getBlock(blockNumber, true);
      blockObject['block number'] = blockNumber;
      blockObject['totalTransactions'] = Object.keys(block.transactions).length; 
      blockObject['transactions'] = block.transactions;

      return blockObject;
    } catch(error) {
      console.log(error);
    }
  },

  /**
  * @param {Object} transaction 
  * @returns {Object} transactionObject
  */
  processTransaction: function(transaction) {
    let self = this;
    let transactionObject = {};

    transactionObject['Block Number'] = transaction.blockNumber;
    transactionObject['Transaction Hash'] = transaction.hash;
    transactionObject['From Address'] = transaction.from;
    transactionObject['To Address'] = transaction.to;
    if(transaction.value > 0) {
        var transaction_value = transaction.value *  Math.pow(10, -18);
        transactionObject['Amount of Ether'] = transaction_value.toFixed(5);
    } else {
        transactionObject['Amount of Ether'] = 0;
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
    return transaction['Amount of Ether'];
  }, 

  numberOfTransactions: function(block) {
    return block['totalTransactions'];
  },
  /**
  * @param {Object} transaction
  * @returns {Address}
  */
  fromAddress: function(transaction) {
    const fromAddress = transaction["From Address"];
    // const isContract = web3.eth.getCode(fromAddress);
    // if(isContract !== '0x') {
    //   fromAddress = "Contract Address " + fromAddress;
    // }
    return fromAddress;
  },
  /**
  * @param {Object} transaction
  * @returns {Address}
  */
  toAddress: function(transaction) {
    let toAddress = transaction["To Address"]
    // const isContract = web3.eth.getCode(toAddress);
    // if(isContract !== '0x') {
    //   toAddress = "Contract Address " + toAddress;
    // }
    return toAddress;
  },
  /**
  * check whether address passed is unique
  */
  unique: function(value, index, self) { 
    return self.indexOf(value) === index;
  },
  
  /**
  * @param {Object} blockData
  * @param {Object} transactionData
  * @returns {Object}
  */
  aggregateData: async function(blockData, transactionData) {
    let self = this;
    let aggregateData = {};
    let   = {};
    let toAddressObj = {};

    const amountsTransferred = transactionData.map(self.transactionAmount);
    const totalTransactionsPerBlock =  blockData.map(self.numberOfTransactions);

    //move these into a separate  function to get unique addresses? then I can Promise.all the other function calls
    const fromAddresses = transactionData.map(self.fromAddress); 
    const toAddresses = transactionData.map(self.toAddress);

    await Promise.all(amountsTransferred, totalTransactionsPerBlock, fromAddresses, toAddresses);
    
    const uniqueFromAddresses = await fromAddresses.filter(self.unique); 
    const uniqueToAddresses = await toAddresses.filter(self.unique); 

    if(transactionData.length > 0) {
      aggregateData["Total Amount of Ether Transferred"] = self.aggregate(amountsTransferred);
      aggregateData["Total Transactions in this Report"] = self.aggregate(totalTransactionsPerBlock);
      aggregateData["Unique Addresses Receiving Ether"] = uniqueToAddresses;
      aggregateData["Number of Unique Addresses Receiving Ether"] = uniqueToAddresses.length;
      aggregateData["Unique Addresses Sending Ether"] = uniqueFromAddresses;
      aggregateData["Number of Unique Addresses Sending Ether"] = uniqueFromAddresses.length;
    } else {
      aggregateData["Total Amount of Ether Transferred"] = "0 Ether";
      aggregateData["Total Transactions in this Report"] = "0";
      aggregateData["Unique Addresses Receiving Ether"] = "None"
      aggregateData["Number of Unique Addresses Receiving Ether"] = "0";
      aggregateData["Unique Addresses Sending Ether"] = "None";
      aggregateData["Number of Unique Addresses Sending Ether"] = "0";
    }
    

    return aggregateData;
  }, 

  /**
  * get transaction level data for the query
  * @param {Array} transactions
  * @returns {Object}
  */
  transactionData: async function(transactions) {
    console.log(transactions);
    let self = this; 

    const transactionData = await transactions.map(self.processTransaction);


    return transactionData;
  },

  /**
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
  * main function for block explorer query
  * @param {Array} blockRange
  * 
  */
  blockExplorerData: async function(blockRange) {
    let self = this;



    const blockData = await self.blockData(blockRange);


    let transactions = blockData[0].transactions;

    //concatenate transactions arrays from multiple blocks; as long as there are transactions
    // note: Genesis block transactions are not available through the methods in web3
    // if(transactions.length > 0) {
      for (let i = 1; i < blockData.length; i++) {
        transactions = transactions.concat(blockData[i].transactions);
      }
    // }
    

    const transactionData = await self.transactionData(transactions);

    
    const aggregateData = await self.aggregateData(blockData, transactionData);

    const blockExplorerData = await Promise.all(blockData, transactionData. aggregateData);



    console.log(JSON.stringify(blockData, null, 2));
    console.log(JSON.stringify(transactionData, null, 2));
    console.log(JSON.stringify(aggregateData, null, 2));
  }

}



module.exports = EthBlockExplorer;
