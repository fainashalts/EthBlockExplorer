const Web3 = require("web3");
const infura = "https://mainnet.infura.io/";
const web3 = new Web3(new Web3.providers.HttpProvider(infura));


var EthBlockExplorer = {

  getLatestBlock: function() {
   return web3.eth.blockNumber;
  },

  getTransaction: function(transactionHash) {
    
    return web3.eth.getTransaction(transactionHash);
  },

  getTransactionsInBlock: function(blockNumber) {
    var self = this;

    var block =  web3.eth.getBlock(blockNumber);
    var transactionHashes = block.transactions;
    var transactionsFromBlock = [];
    var blockTotalValue = 0;
    var totalTransactions = 0;
    var totalContracts = 0;
    if(transactionHashes.length > 0) {
      for(var i = 0; i < transactionHashes.length; i++) {
      var transaction = self.getTransaction(transactionHashes[i]);
      var transactionObject = {};
      totalTransactions += 1;

      // only passing the items we plan to display from the transaction to return to the calling function
      transactionObject.blockNumber = transaction.blockNumber;
      transactionObject.transactionHash = transaction.hash;
      transactionObject.from = transaction.from;
      transactionObject.to = transaction.to; 


      // ****TODO**** need to check if the to field is null before deciding an item is contract
      if(transaction.value > 0) {
        var transaction_value = transaction.value *  Math.pow(10, -18);
        transactionObject.value = transaction_value.toFixed(5);
      } else {
        transactionObject.value = 0;
      }

      if(transactionObject.to == null) {
        transactionObject.isContract = 1;
        totalContracts += 1;
      } else {
        transactionObject.isContract = 0;
      }

      blockTotalValue = blockTotalValue + parseFloat(transactionObject.value);

      transactionsFromBlock.push(transactionObject);
      }
    } 

    // aggregating values to make it easier to put this data together at the multi-block level
    transactionsFromBlock.blockTotalValue = blockTotalValue;
    transactionsFromBlock.totalTransactions = totalTransactions;
    transactionsFromBlock.totalContracts = totalContracts;
    
    //this returns an array of all transactions in this block plus aggregate data for the block
    return transactionsFromBlock;
  },

  getBlockRangeTransactions: function(blockRange){
    var self = this;
    var blockObject = {}
    var blocksAggregateValue = 0;
    var blocksAggregateTotalTransactions = 0;
    var blocksAggregateTotalContracts = 0;
    for(var i = blockRange[0]; i <= blockRange[1]; i++) {
      var transactionsList = self.getTransactionsInBlock(i);
      if(transactionsList.length > 0) {
        blocksAggregateValue = blocksAggregateValue + transactionsList.blockTotalValue;
        blocksAggregateTotalTransactions = blocksAggregateTotalTransactions + transactionsList.totalTransactions;
        blocksAggregateTotalContracts = blocksAggregateTotalContracts + transactionsList.totalContracts;
        blockObject[i] = transactionsList;
      } else {
        blockObject[i] = 'no transactions in this block'; 
      }
    }

    blockObject.aggregateData = {"totalValue" : blocksAggregateValue, "percentageContracts": blocksAggregateTotalContracts / blocksAggregateTotalTransactions}
  
    return blockObject;
  },

  blockExplorerData: function(blockRange) {
    var self = this;
    
    var blockTransactions = self.getBlockRangeTransactions(blockRange);

    console.log(JSON.stringify(blockTransactions, null, 2));
  }

}

module.exports = EthBlockExplorer;
