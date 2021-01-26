import { Block } from '../types';
import { computeProposalHash } from '../utils/computeProposalHash';
import { sendHashedTransaction } from './api';
import { nodeService } from './nodeService';

export const transactionService = () => {
  let transactionHash: string | undefined;

  const { getMyNodeHash } = nodeService();
  const myNodeHash = getMyNodeHash();

  const calculateTransactionHash = (blockProposal: Block, toeplitzHash: string) =>
    computeProposalHash(toeplitzHash, myNodeHash, blockProposal.data);

  const storeTransactionHash = (hashedTransaction: string) => {
    transactionHash = hashedTransaction;
  }

  const getTransactionHash = () => transactionHash;

  const clearTransactionHash = () => {
    transactionHash = undefined;
  };

  return {
    calculateTransactionHash,
    storeTransactionHash,
    getTransactionHash,
    clearTransactionHash,
  };
};
