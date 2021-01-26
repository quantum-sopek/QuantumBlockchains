import express from 'express';
import bodyParser from 'body-parser';
import { blockchainService } from './services/blockchainService';
import { toeplitzService } from './services/toeplitzService';
import { blockService } from './services/blockService';
import { oneTimePadService } from './services/oneTimePadService';
import { transactionService } from './services/transactionService';
import { votingService } from './services/votingService';
import { nodeService } from './services/nodeService';
import { shuffleArray } from './utils/shuffleArray';
import { wait } from './utils/wait';

const normalConnection = express();
const quantumConnection = express();
const jsonParser = bodyParser.json();
const normalConnectionPort = 3016;
const quantumConnectionPort = 3017;

const { getAllNodesHashes, getMyNodeHash } = nodeService();

const { getLastBlock, addBlock, saveBlock } = blockchainService();

const {
  establishToeplitzMatrix,
  checkIfToeplitzAsStringExists,
  calculateToeplitzHash,
  generateToeplitzHash,
  verifyToeplitzGroupSignature,
  addToeplitzMatrix,
  getToeplitzMapping,
  generateToeplitzGroupSignature,
  storeToeplitzGroupSignature,
  getToeplitzGroupSignature,
  addToeplitzHashToGroupSignature,
  clearToeplitzGroupSignature,
} = toeplitzService();

const {
  establishOneTimePad,
  checkIfOneTimePadExists,
  addOneTimePad,
  clearOneTimePads,
  getOneTimePadMapping,
} = oneTimePadService();

const {
  createBlockProposal,
  sendBlockProposalToAllPeers,
  setBlockProposal,
  getBlockProposal,
  clearBlockProposal,
} = blockService();

const {
  calculateTransactionHash,
  storeTransactionHash,
  getTransactionHash,
  clearTransactionHash,
} = transactionService();

const {
  initializeVote,
  verifyVote,
  addVote,
  getVotes,
  sendAddVoteAllPeers,
  sendAddBlockToChainToAllPeers,
  clearVotes,
  setIsVoteEnded,
  getIsVoteEnded,
} = votingService();

const clearEverything = () => {
  clearToeplitzGroupSignature();
  clearOneTimePads();
  clearTransactionHash();
  clearBlockProposal();
  clearVotes();
};

const establishNecessaryData = async () => {
  console.log('Establishing Toeplitz matrix with peers - transaction');
  await establishToeplitzMatrix();
  console.log('Establishing one time pad with peers - transaction');
  await establishOneTimePad();
};

const generateHashedTransaction = (toeplitzHash: string) => {
  console.log('Calculating my hashed transaction');
  const calculatedTransactionHash = calculateTransactionHash(getBlockProposal(), toeplitzHash);
  console.log('Storing my hashed transaction');
  storeTransactionHash(calculatedTransactionHash);
  return calculatedTransactionHash;
}

const addProposalPeerToToeplitzGroupSignature = () => {
  const toeplitzHash = generateToeplitzHash(getBlockProposal());
  const calculatedTransactionHash = generateHashedTransaction(toeplitzHash);
  console.log('Adding Toeplitz Hash to Toeplitz Group Signature');
  addToeplitzHashToGroupSignature(toeplitzHash);
  return calculatedTransactionHash;
};

const startVoting = (calculatedTransactionHash: string) => {
  console.log('Starting voting, create peer queue');
  const randomPeerArray = shuffleArray(getAllNodesHashes());
  console.log(`Random peer array: ${randomPeerArray}`);
  initializeVote(randomPeerArray, calculatedTransactionHash);
};

const waitForDataToPropagate = async () => {
  console.log('Waiting for data to propagate');
  await wait(() => getToeplitzGroupSignature().length === 4, 500);
  await wait(() => !!getBlockProposal(), 500);
};

normalConnection.post('/receive-transaction', jsonParser, async (req, res) => {
  if (getMyNodeHash() !== '313c7cdbb127b808387486993859a2be864711cbf80f1ea89038bd09') {
    res.send('Received transaction');
    return;
  }
  try {
    setIsVoteEnded(false);
    console.log('Received transaction');
    const { transaction } = req.body;
    if (transaction.length !== 5) {
      throw Error('Invalid transaction length');
    }
    await establishNecessaryData();
    console.log('Generating Toeplitz Group Signature');
    const toeplitzGroupSignature = generateToeplitzGroupSignature(
      getToeplitzMapping(),
      getOneTimePadMapping(),
      transaction
    );
    console.log('Generating block proposal');
    createBlockProposal(transaction, getLastBlock());
    const calculatedTransactionHash = addProposalPeerToToeplitzGroupSignature();
    console.log('Sending block proposal to peers');
    await sendBlockProposalToAllPeers(toeplitzGroupSignature);
    startVoting(calculatedTransactionHash);
  } catch (error) {
    console.error(error);
  }
  res.send('Block proposal sent to all peers');
});

normalConnection.post('/receive-block-proposal', jsonParser, async (req, res) => {
  try {
    setIsVoteEnded(false);
    console.log('Received block proposal');
    const { blockProposal, toeplitzGroupSignature } = req.body;
    console.log('Verifying block proposal signature');
    const calculatedToeplitzHash = calculateToeplitzHash(getToeplitzMapping(), getOneTimePadMapping(), blockProposal);
    const isVerified = verifyToeplitzGroupSignature(toeplitzGroupSignature, calculatedToeplitzHash);
    if (isVerified) {
      console.log('Storing block proposal');
      setBlockProposal(blockProposal);
      console.log('Storing Toeplitz Group Signature');
      storeToeplitzGroupSignature(toeplitzGroupSignature);
      const calculatedTransactionHash = generateHashedTransaction(calculatedToeplitzHash);
      startVoting(calculatedTransactionHash);
    } else {
      throw Error('Invalid block proposal signature');
    }
  } catch (error) {
    console.error(error);
  }
  res.send('Received block proposal');
});

normalConnection.post('/verify-and-vote', jsonParser, async (req, res) => {
  try {
    console.log('My turn to verify and vote');
    const { peerQueue, transactionHash } = req.body;
    await waitForDataToPropagate();
    console.log('Verifying');
    const isVerified = verifyVote(getBlockProposal(), getToeplitzGroupSignature(), transactionHash);
    if (isVerified) {
      console.log('Verified');
      console.log('Sending verified vote to all peers');
      await sendAddVoteAllPeers();
      if (getVotes() >= 12) {
        console.log('Sending request to add block to chain');
        await sendAddBlockToChainToAllPeers();
      } else {
        if (peerQueue.length !== 0) {
          console.log('Sending verify and vote to next peer in queue');
          initializeVote(peerQueue, transactionHash);
        }
      }
    } else {
      throw Error('Non verified');
    }
  } catch (error) {
    console.error(error);
  }
  res.send('Voted');
});

normalConnection.post('/add-vote', async (req, res) => {
  console.log('Received add vote request');
  if (getIsVoteEnded()) {
    console.log('Vote ended');
    res.send('Vote ended');
    return;
  }
  try {
    console.log('Adding vote');
    addVote();
  } catch (error) {
    console.error(error);
  }
  res.send('Added vote');
});

normalConnection.post('/add-block-to-chain', (req, res) => {
  console.log('Received add block to chain request');
  if (getIsVoteEnded()) {
    console.log('Vote ended');
    res.send('Vote ended');
    return;
  }
  try {
    setIsVoteEnded(true);
    console.log('Adding block to chain');
    addBlock(getBlockProposal());
    saveBlock(getLastBlock());
    console.log(getLastBlock());
    console.log('\x1b[31m', 'CONSENSUS ACHIEVED' ,'\x1b[0m');
    console.log('Clearing one time pads, hashed transaction, block proposal and votes');
    clearEverything();
  } catch (error) {
    console.error(error);
  }
  res.send('Added block to chain');
});

normalConnection.get('/show-last-block', (req, res) => {
  res.send(getLastBlock());
});

normalConnection.get('/show-block-proposal', (req, res) => {
  res.send(getBlockProposal());
});

normalConnection.get('/show-hashed-transaction', (req, res) => {
  res.send(getTransactionHash());
});

normalConnection.listen(normalConnectionPort, () => {
  console.log('Peer normal connection listening');
});

quantumConnection.post('/check-toeplitz', jsonParser, (req, res) => {
  console.log('Received check Toepltiz matrix request');
  const { nodeHash } = req.body;
  console.log('Checking if Toeplitz matrix exists');
  const toeplitzMatrix = checkIfToeplitzAsStringExists(nodeHash);
  console.log('Sending found Toeplitz matrix');
  res.send({ toeplitzMatrix });
});

quantumConnection.post('/check-one-time-pad', jsonParser, (req, res) => {
  console.log('Received check one time pad request');
  const { nodeHash } = req.body;
  console.log('Checking if one time pad exists');
  const oneTimePad = checkIfOneTimePadExists(nodeHash);
  console.log('Sending found one time pad');
  res.send({ oneTimePad });
});

quantumConnection.post('/receive-toeplitz', jsonParser, async (req, res) => {
  console.log('Received request to store established Toeplitz matrix');
  try {
    const { toeplitzMatrix, nodeHash } = req.body;
    console.log('Adding established Toeplitz matrix');
    addToeplitzMatrix(toeplitzMatrix, nodeHash);
  } catch (error) {
    console.error(error);
  }
  res.send('Toeplitz string added');
});

quantumConnection.post(
  '/receive-one-time-pad',
  jsonParser,
  async (req, res) => {
    console.log('Received request to store established one time pad');
    try {
      const { oneTimePad, nodeHash } = req.body;
      console.log('Adding established one time pad');
      addOneTimePad(oneTimePad, nodeHash);
    } catch (error) {
      console.error(error);
    }
    res.send('One-time pad added');
  }
);

quantumConnection.get('/show-toeplitz', (req, res) => {
  res.send(getToeplitzMapping());
});

quantumConnection.get('/show-one-time-pad', (req, res) => {
  res.send(getOneTimePadMapping());
});

quantumConnection.listen(quantumConnectionPort, () => {
  console.log('Peer quantum connection listening');
});
