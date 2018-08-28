const Web3 = require("web3");
const infura = "https://mainnet.infura.io/";
const web3 = new Web3(new Web3.providers.HttpProvider(infura));


var EthBlockExplorer = {

//web3 functions
  getLatestBlock: function() {
   return web3.eth.blockNumber;
  },

  getBlock: function(blockNumber) {
    let blockObject = {}
    const block =  web3.eth.getBlock(blockNumber, true);
    blockObject['block number'] = blockNumber;
    blockObject['totalTransactions'] = Object.keys(block.transactions).length; 
    blockObject['transactions'] = block.transactions;

    return blockObject;
  },

//functions for aggregating and processing data
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

  
  aggregate: function(arrayToReduce){
    const sum = arrayToReduce.reduce((total, amount) => parseFloat(total) + parseFloat(amount)); 
    return sum;
  },
  transactionAmount: function(transaction) {
    return transaction['Amount of Ether'];
  }, 
  numberOfTransactions: function(block) {
    return block['totalTransactions'];
  },

  fromAddress: function(transaction) {
    const fromAddress = transaction["From Address"];
    // const isContract = web3.eth.getCode(fromAddress);
    // if(isContract !== '0x') {
    //   fromAddress = "Contract Address " + fromAddress;
    // }
    return fromAddress;
  },
  toAddress: function(transaction) {
    let toAddress = transaction["To Address"]
    // const isContract = web3.eth.getCode(toAddress);
    // if(isContract !== '0x') {
    //   toAddress = "Contract Address " + toAddress;
    // }
    return toAddress;
  },
  unique: function(value, index, self) { 
    return self.indexOf(value) === index;
  },
  
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

    // await Promise.all(fromAddresses, uniqueFromAddresses, toAddresses, uniqueToAddresses, fromContractAddresses, toContractAddresses);


    aggregateData["Total Amount of Ether Transferred"] = self.aggregate(amountsTransferred);
    aggregateData["Total Transactions in this Report"] = self.aggregate(totalTransactionsPerBlock);
    aggregateData["Unique Addresses Receiving Ether"] = uniqueToAddresses;
    aggregateData["Number of Unique Addresses Receiving Ether"] = uniqueToAddresses.length;
    aggregateData["Unique Addresses Sending Ether"] = uniqueFromAddresses;
    aggregateData["Number of Unique Addresses Sending Ether"] = uniqueFromAddresses.length;

    return aggregateData;
  }, 

  transactionData: async function(transactions) {
    let self = this; 

    const transactionData = await transactions.map(self.processTransaction);


    return transactionData;
  },

  blockData: async function(blockRange) {
    let self = this;
    
    const blockList = Array(blockRange[1] - blockRange[0] + 1).fill().map((item, index) => blockRange[0] + index);
    const blockData = await blockList.map(self.getBlock);

    // await Promise.all(blockData);

    return blockData;
  }, 


  blockExplorerData: async function(blockRange) {
    let self = this;

    const blockData = await self.blockData(blockRange);


    let transactions = blockData[0].transactions;

    for (let i = 1; i < blockData.length; i++) {
      transactions = transactions.concat(blockData[i].transactions);
    }

    const transactionData = await self.transactionData(transactions);
    
    const aggregateData = await self.aggregateData(blockData, transactionData);

    const blockExplorerData = await Promise.all(blockData, transactionData. aggregateData);



    console.log(JSON.stringify(blockData, null, 2));
    console.log(JSON.stringify(transactionData, null, 2));
    console.log(JSON.stringify(aggregateData, null, 2));
  }

}



module.exports = EthBlockExplorer;
