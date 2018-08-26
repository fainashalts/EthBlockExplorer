var chai = require("chai");
// var sinon = require("sinon");
var blockFunctions = require("../index");



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
      var block = blockFunctions.getTransaction('0xd5875cdc5dea095e713b2409d585bd713d7f67bf1f0a0143293c00dc3db187da');
      chai.assert.isObject(block);
    });
  });
  describe('#getTransactionsInBlock', function() {
    var array = blockFunctions.getTransactionsInBlock(1757201);
    it('should return an array of transactions', function(){
      chai.assert.isArray(array);
    }); 
  });
  describe('#getBlockRangeTransactions', function() {
    var object = blockFunctions.getBlockRangeTransactions([1757201, 175202]);
    it('should return an object', function(){
      chai.assert.isObject(object);
    });
  
    it('adds aggregate values for blocks with transactions data', function(){
      chai.assert.exists(object['aggregateData']);
    });
  });
  describe('#blockExplorerData', function() {
    it('should output object', function(){
      // var blockObject = blockFunctions.blockExplorerData(1757201);
      // chai.assert.isObject(blockObject);
    });
  });
  
});
