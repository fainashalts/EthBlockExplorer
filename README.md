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

# Optimization Ideas

Querying the Ethereum blockchain via infura.io is, expectedly, a slow process. This proof-of-concept module is not really scalable without some sort of optimization. 

1) Caching
Caching the results of previous queries or already existing blocks would significantly help speed up the query time. Since blocks are immutable once recorded, there is not really a need to access the Ethereum blockchain anew for transaction information related to old blocks. We could, therefore, store the data we need in a key-value store, like Redis.

Of course, if a user runs their own node locally, they could bypass a great deal of this inefficiency, and may not need to cache previous blocks.

2) ElasticSearch 
Creating a centrally hosted search option is another possible optimization. Similar to caching, using something like ElasticSearch to index the Ethereum blockchain and provide optimized search options would greatly increase the speed with which queries could be made. Several examples of such a service currently being developed exist, such as this one: http://jonathanpatrick.me/blog/elastic-ethereum

The major drawback here is that this would be a centralized search engine, would need to be synced with new blocks regularly, and would need some sort of mechanism in place to ensure fidelity to the information contained in the blockchain itself.

3) Swarm/IPFS, some other database to hold Ethereum blockchain data for easier search
If centralization is a concern, something like Swarm or IPFS could be an option. Main drawback here is that as far as I can tell, the functionality is not as developed so implementing a good search would require more work out the gate. 

4) Concurrent Processes 
Another possible optimization is to run concurrent processes when querying Infura. Javascript is single-threaded, but there are some options for running essentially multi-threaded processes using Node. Other programming languages may provide easier implementations for multi-threaded requests, as well as parallel requests, which would likely provide greater optimization.

A drawback of this approach is the possibility of rate limits stopping out multiple processes. The discussion here is somewhat unclear about whether Infura currently implements any sort of rate limit: https://github.com/INFURA/infura/issues/58

