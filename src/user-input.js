const inquirer = require('inquirer');
const blockFunctions = require("./block-functions");


//variables for getting user input using inquirer plugin
const inquiryType = [
  {
    type : 'list',
    name : 'inquiryType',
    message : 'What would you like to do?',
    choices: ["Get block explorer information for the most recent block and some blocks before it",
     "Get block explorer information for a range of blocks I provide (inclusive)"],
  }
];

const goingBackFromRecentBlock = [
  {
    type: 'input',
    name: 'howManyBlocksBack',
    message: 'how many blocks back from the present block would you like a report for?'
  }
];

const provideBlockRange = [
{
  type: 'input',
  name: 'blockRangeStart',
  message: 'what block would you like to start on?'
}, 
{
  type: 'input',
  name: 'blockRangeEnd',
  message: 'what block would you like to end on?'
}, 
];

var userInput = {

  //get data about block(s) in question based on what user asks for
  getBlockData: function(answers){
    var self = this;
    // process answers here to create a block range and pass to EthBlockExplorer functions
    var blockRange = [];
    if(answers.blockRangeStart && answers.blockRangeEnd) {
      blockRange = [answers.blockRangeStart, answers.blockRangeEnd];
    } else if(answers.howManyBlocksBack) {
      var latestBlock = blockFunctions.getLatestBlock();
      var startBlock = latestBlock - answers.howManyBlocksBack;
      blockRange = [startBlock ,latestBlock]
    }

    blockFunctions.blockExplorerData(blockRange);
  },

  //process user request (answers to input questions) before passing query to getBlockData;
  process: function(answers){
    var self = this;
    if(answers.inquiryType == inquiryType[0].choices[0]) {
      inquirer.prompt(goingBackFromRecentBlock).then(answers=> self.getBlockData(answers));
    } else {
      inquirer.prompt(provideBlockRange).then(answers=> self.getBlockData(answers));
    }
  },

  //begin prompting of user for info to query from Ethereum blockchain
  startPrompt: function() {
    var self = this;
    inquirer.prompt(inquiryType).then(answers => self.process(answers));
  }  
}

// userInput.startPrompt();

module.exports = userInput;

