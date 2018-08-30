/**
* @module userInput;
* @requires module:blockFunctions
*/
const inquirer = require('inquirer');
const blockFunctions = require("./block-functions");


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

 /**
 * validates user input
 * @param {Object} answers - user input 
 * @param {string} [answers.howManyBlocksBack]
 * @param {string} [answers.blockRangeStart]
 * @param {string} [answers.blockRangeEnd]
 */
 validateUserInput: function(answers) {
  let self = this;
  let maxBlock = blockFunctions.getLatestBlock();
  
  if(answers["howManyBlocksBack"] && Number.isNaN(+answers["howManyBlocksBack"])) {
    console.log("Please provide an integer");
    self.startPrompt();
  } else if (answers["blockRangeStart"] && (Number.isNaN(+answers["blockRangeStart"]) || Number.isNaN(+answers["blockRangeStart"]))) {
    console.log("Please provide integer values for the starting and ending blocks");
    self.startPrompt();
  } else if (answers["blockRangeStart"] && (parseInt(answers["blockRangeEnd"]) < parseInt(answers["blockRangeStart"]))) {
    console.log("Please make sure that your starting block is smaller than your ending block")
    self.startPrompt();
  } else if(answers["blockRangeStart"] && answers["blockRangeEnd"] > maxBlock) {
    console.log("The latest block is #" + maxBlock + "- please enter an ending block less than or equal to this");
  } else {
    self.getBlockData(answers);
  }
 },

  /** 
  * get data about block(s) in question based on what user asks for
  * @param {Object} answers - user input 
  * @param {string} [answers.howManyBlocksBack] 
  * @param {string} [answers.blockRangeStart] 
  * @param {string} [answers.blockRangeEnd]
  */
  getBlockData: function(answers){
    let self = this;
    let blockRange = [];
    if(answers.blockRangeStart && answers.blockRangeEnd) {
      blockRange = [answers.blockRangeStart, answers.blockRangeEnd];
    } else if(answers.howManyBlocksBack) {
      let latestBlock = blockFunctions.getLatestBlock();
      let startBlock = latestBlock - answers.howManyBlocksBack;
      blockRange = [startBlock ,latestBlock]
    }
    console.log("Thanks! Loading your report...")
    blockFunctions.blockExplorerData(blockRange);
  },
 

  
  /**
  * process user request (answers to input questions) before passing query to getBlockData;
  * @param {Object} answers 
  * @param {string} answers.inquiryType  - type of inquiry user is making 
  */
  process: function(answers){
    let self = this;
    if(answers.inquiryType == inquiryType[0].choices[0]) {
      inquirer.prompt(goingBackFromRecentBlock).then(answers=> self.validateUserInput(answers));
    } else {
      inquirer.prompt(provideBlockRange).then(answers=> self.validateUserInput(answers));
    }
  },

  /**
  * prompt user for info to query from Ethereum blockchain
  **/
  startPrompt: function() {
    let self = this;
    inquirer.prompt(inquiryType).then(answers => self.process(answers));
  }  
}


module.exports = userInput;

