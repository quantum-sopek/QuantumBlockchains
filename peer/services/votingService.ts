import { Block } from '../types';
import { computeProposalHash } from '../utils/computeProposalHash';
import { sendAddBlockToChain, sendAddVote, sendVerifyAndVote } from './api';
import { nodeService } from './nodeService';

export const votingService = () => {
  let votes = 0;
  let isVoteEnded = false;

  const { getAllNodesHashes } = nodeService();
  const allNodesHashes = getAllNodesHashes();

  const initializeVote = async (peerQueue: string[], transactionHash: string) => {
    try {
      const voter = peerQueue[0];
      await sendVerifyAndVote(voter, peerQueue.slice(1), transactionHash);
    } catch (error) {
      console.error(error)
      throw error;
    }
  };

  const verifyVote = (
    blockProposal: Block,
    toeplitzGroupSignature: string[],
    transactionHash: string,
  ) => {
    return allNodesHashes.some(nodeHash => {
      const hashedTransactions = toeplitzGroupSignature.map(hash => computeProposalHash(hash, nodeHash, blockProposal.data));
      return hashedTransactions.some(hash => transactionHash === hash);
    });
  };

  const addVote = () => (votes = votes + 1);

  const getVotes = () => votes;

  const sendAddVoteAllPeers = async () => {
    for (const nodeHash of allNodesHashes) {
      await sendAddVote(nodeHash);
    }
  };

  const sendAddBlockToChainToAllPeers = async () => {
    for (const nodeHash of allNodesHashes) {
      await sendAddBlockToChain(nodeHash);
    }
  };

  const clearVotes = () => {
    votes = 0;
  };

  const setIsVoteEnded = (value: boolean) => {
    isVoteEnded = value;
  };

  const getIsVoteEnded = () => isVoteEnded;

  return {
    initializeVote,
    addVote,
    getVotes,
    verifyVote,
    sendAddVoteAllPeers,
    sendAddBlockToChainToAllPeers,
    clearVotes,
    setIsVoteEnded,
    getIsVoteEnded,
  };
};
