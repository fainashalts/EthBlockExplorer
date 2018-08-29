#!/usr/bin/env node
/**
* @module EthBlockExplorer
* @requires module:src/userInput
* @requires module:src/blockFunctions
*/

const userInput = require('./src/user-input.js');
const blockFunctions = require('./src/block-functions.js');

//ask user some questions (found in user-input module) about what info they want
userInput.startPrompt();

