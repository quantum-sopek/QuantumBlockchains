# Quantum Blockchain

Quantum Blockchain is MVP based on the whitepaper: https://www.mdpi.com/1099-4300/21/9/887.
The Repository consists of two parts. The first one is implementation of the consensus with specific assumptions. It is based on 4 peers and 1 client which sends transactions to peers. Both client and peers are closed in docker containers and communicate with each other using REST requests. Each peer has 2 ports open for communication simulating normal channel and quantum channel. The second part is visualisation of how consensus works. It is based on simple JS, CSS and HTML.

#### Required software:

  * python3
  * curl
  * yarn
  * docker
  * docker-compose
  * Tilix (Linux) or iTerm (Mac OS)


#### To install dependencies (in main directory):

```sh
  yarn
```

#### To start peers and client in docker container (in main directory):

```sh
  python3 start_docker.py
```

#### To make client send transaction to peers (in main directory):

```sh
  python3 send_transaction.py
```

#### To stop client and peers (in main directory):

```sh
  python3 stop_docker.py
```

**Important! In order to preserve block persistence use python scripts to start and stop client and peers**


#### To open peers logging terminals on Linux (in main directory):

```sh
  tilix --session tilix.json
```

#### To open peers logging terminals on Mac OS (in main directory):

```sh
  itermocil
```

#### To open visualisation:

```
  Open index.html file from demo/visualisation folder in any browser (Chrome recommended)
```

## Code structure:

#### Client:

Client code consists of three main elements:
1. `api.ts`: POST request for sending transaction to peers
2. `client.ts`: HTTP server which handles receiving POST request to send transaction to peers
3. `Dockerfile`: instructions how docker should build docker image

#### Peer:

Peer code consists of three main elements:
1. services: services consisting of required functionalities
2. `peer.ts`: HTTP server which handles receiving all REST request and handles them properly
3. `Dockerfile`: instructions how docker should build docker image

Peer services:
1. `api.ts`: REST requests for establishing Toeplitz matrix, one-time pad, sending block proposal, sending hashed transaction, voting
2. `blockchainService.ts`: functionalities responsible for loading and storing blocks on drive, adding blocks to chain, showing last block
3. `blockService.ts`: functionalities responsible for creating block proposal, sending block proposal to peers
4. `matrixMathService.ts`: functionalities responsible for mathematics behind Toeplitz matrix and Toeplitz hash
5. `nodeService.ts`: getters responsible for passing peers hashes
6. `oneTimePadService.ts`: functionalities responsible for establishing one-time pad, storing one-time pad mapping, generating one-time pad
7. `toeplitzService.ts`: functionalities responsible for establishing Toeplitz matrix, storing Toeplitz matrix mapping, generating Toeplitz matrix, generating Toeplitz hash, generating Toeplitz Group Signature, verifying Toeplitz Group Signature
8. `transactionService.ts:` functionalities responsible for calculating hashed transaction, storing hashed transaction
9. `votingService.ts`: functionalities responsible for vote initialization, verifying other peer's votes

Peer.ts:

It is responsible for initializing all services and HTTP servers. It is important that services are initialized in one place because it provides data persistence. HTTP servers are listening on 2 ports: 3016, 3017. The first one is imitating a normal channel, the second one simulates a quantum channel. Upon receiving REST requests, proper functions from services are invoked and the whole consensus process works automatically. It is important to notice that the proposal peer is hardcoded. All peers receive transactions from the client but only one peer can be proposal one.

#### Docker composition

Starting docker is initialized by `docker-compose.yml` file. It uses docker images from client and peer folders. Also it has peers hash hardcoded and port mapping between docker containers and host machine.

#### Scripts

For starting and stopping docker containers python scripts are prepared. They start and stop all peers and the client. They use `package.json` scripts and yarn to run specific functionalities. It is important to use them to start and stop containers because they are used for block persistence. When the container is starting it copies blocks folder from peer/blocks folder and adds blocks from json files to blockchain. If the blocks folder doesn't exist, peer creates genesis block. When a block is added to the chain due to the consensus achievement a new json file is created and stored on the container's drive. When containers are stopped using python script json block files from the drive of the proposal peer are copied to host drive and stored in peer/blocks folder.

## Consensus algorithm:

1. Transaction (currently just string) is sent by the client to all peers, choosing proposal one is hardcoded (NC).
2. Proposal peer establishes a Toeplitz matrix with all neighbouring peers (QC).
3. Proposal peer establishes a one-time pad as a random binary string with all neighbouring peers (QC).
4. Proposal peer generates Toeplitz Group Signature.

> Example:
  > * The Toeplitz matrix is generated by generating a random binary string with 69 digits (representing the first row and first column) and populating diagonal values with the same values.
  > * The one-time pad is a random binary string with 35 digits.
  > * Transaction data is limited to 5 letters which are then parsed to a binary string using UTF8.
  > * Toeplitz hash is calculated by multiplying Toeplitz matrix with transaction data. Then the result is used for modulo 2 calculation. The last step is calculating bitwise XOR between modulo result and one-time pad.
  > * Toeplitz Group Signature is an array containing all calculated Toeplitz hashes, one for each connection between proposal peer and neighbouring ones (in our scenario we have 3 Toeplitz hashes).

5. Proposal peer generates Toeplitz hash for itself and adds it to Toeplitz Group Signature. Without it, the proposal peer wouldn’t be able to vote because it wouldn’t have data to hash the transaction and send it with a vote request.
6. Proposal peer creates a proposal block and sends it to all neighbouring peers together with Toeplitz Group Signature (NC).
7. Other peers after receiving proposal block they:

  * Verify if Toeplitz Group Signature is correct: calculates Toeplitz hash using Toeplitz matrix, block proposal data and one-time pad established before with proposal peer and checks if Toeplitz Group Signature has the same hash as calculated Toeplitz hash.
  * If Toeplitz Group Signature is correct they store block proposal.
  * If Toeplitz Group Signature is correct they store Toeplitz Group Signature
  * If Toeplitz Group Signature is correct they hash transaction (node hash + transaction + calculated Toeplitz hash) and store it (NC).

8. Each peer generates a random array of all peers and sends a request to vote to the first one together with a hashed transaction (NC).
9. When peers get a request to vote they:

  * Wait for block proposal and Toeplitz Group Signature
  * Hash transaction for each neighbouring peer using transaction from block proposal, node hash and Toeplitz Group Signature.
  * Check if the calculated hashed transaction is the same as one received from a voting request.
  * If hashes are the same, they send to all peers request to increase their vote number by 1 (NC).
  * If the number of the votes is equal or bigger than 12 (together with one just added), they send to all peers that they should add a proposal block to the blockchain (NC).
  * If the number of the votes is less than 12 (together with one just added), they send a request to the next peer in the queue to vote together with a hashed transaction (NC).

10. After adding the block to blockchain each peer clears Toeplitz Group Signature array, one-time pads array, transaction hash, block proposal and votes number.


Establishing of the Toeplitz value and one-time pad is as follows:

1. The first peer sends a request to check if the second peer has Toeplitz value/one-time pad with the node hash of the first peer
2. If yes the first peer checks if it also has the same Toeplitz value/one-time pad and if everything is alright establishment is finished
3. If the second peer doesn’t have corresponding Toeplitz value/one-time pad the first peer generates Toeplitz value/one-time pad and sends it to the second peer
