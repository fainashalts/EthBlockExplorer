var chai = require("chai");
// var sinon = require("sinon");
var EthBlockExplorer = require("../index.js");


// var mockObject = { blockNumber: 1757201,
//        transactionHash:
//         '0xd5875cdc5dea095e713b2409d585bd713d7f67bf1f0a0143293c00dc3db187da',
//        from: '0x0b21002b890bf8a03db09cf6f4290b37d92adc90',
//        to: '0xe7a84e176cde685ca2fb47aea022343b76c27cd7',
//        value: '0.11388',
//        isContract: 0 }


describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      chai.assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});


describe('BlockExplorer', function() {
  describe('#getTransaction()', function() {
    it('should return an object', function(){
      var block = EthBlockExplorer.getTransaction('0xd5875cdc5dea095e713b2409d585bd713d7f67bf1f0a0143293c00dc3db187da');
      chai.assert.isObject(block);
    });
  });
  describe('#getTransactionsInBlock', function() {
    var array = EthBlockExplorer.getTransactionsInBlock(1757201);
    it('should return an array of transactions', function(){
      chai.assert.isArray(array);
    }); 
  });
  describe('#getBlockRangeTransactions', function() {
    var object = EthBlockExplorer.getBlockRangeTransactions([1757201, 175202]);
    it('should return an object', function(){
      chai.assert.isObject(object);
    });
    it('adds aggregate values for blocks with transactions data', function(){
      chai.assert.exists(object['aggregateData']);
    });
  });
  describe('#blockExplorerData', function() {
    it('should return an object', function(){
      var blockObject = EthBlockExplorer.blockExplorerData(1757201);
      chai.assert.isObject(blockObject);
    });
  });
  
});
