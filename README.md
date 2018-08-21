# Ether Block Explorer

The purpose of this tool is to allow a user to access basic information from the Ethereum blockchain regarding a specified set of blocks. 

A user may input either a single number representing how far back from the present block the query should operate, or two numbers providing a range of block numbers to query. 

Given the user input, this tool will provide the following about each block queried: 

1) Amount of Ether transferred in total
2) The addresses that received Ether and the amount received in total
3) The addresses that sent Ether and the amount they sent in total
4) Which of the addresses listed for teh block are contract addresses


# USAGE

npm install ethblockexplorer

Oonce installed, create a .env file with your Infura token, in order to use Infura to access the Ethereum blockchain. You must have your own token in order to access Infura. Sign up here: https://infura.io/


