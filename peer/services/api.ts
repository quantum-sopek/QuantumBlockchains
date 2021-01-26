import got, { Response } from 'got';
import { Block } from '../types';

export const checkIfToeplitzMatrixIsEstablished = async (
  nodeHash: string,
  myNodeHash: string
) => {
  try {
    const url = `http://${nodeHash}:3017/check-toeplitz`;
    const response = await got.post(url, {
      json: {
        nodeHash: myNodeHash,
      },
      responseType: 'json',
    });
    return response as Response<{ toeplitzMatrix: number[][] }>;
  } catch (error) {
    throw error;
  }
};

export const sendTopelitzMatrix = async (
  nodeHash: string,
  toeplitzMatrix: number[][],
  myNodeHash: string
) => {
  try {
    const url = `http://${nodeHash}:3017/receive-toeplitz`;
    const response = await got.post(url, {
      json: {
        toeplitzMatrix,
        nodeHash: myNodeHash,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendOneTimePad = async (
  nodeHash: string,
  oneTimePad: number[],
  myNodeHash: string
) => {
  try {
    const url = `http://${nodeHash}:3017/receive-one-time-pad`;
    const response = await got.post(url, {
      json: {
        oneTimePad,
        nodeHash: myNodeHash,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendBlockProposal = async (
  nodeHash: string,
  blockProposal: Block,
  toeplitzGroupSignature: string[]
) => {
  try {
    const url = `http://${nodeHash}:3016/receive-block-proposal`;
    const response = await got.post(url, {
      json: {
        blockProposal,
        toeplitzGroupSignature,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendHashedTransaction = async (
  nodeHash: string,
  hashedTransaction: string
) => {
  try {
    const url = `http://${nodeHash}:3016/receive-hashed-transaction`;
    const response = await got.post(url, {
      json: {
        hashedTransaction,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkIfOneTimePadIsEstablished = async (
  nodeHash: string,
  myNodeHash: string
) => {
  try {
    const url = `http://${nodeHash}:3017/check-one-time-pad`;
    const response = await got.post(url, {
      json: {
        nodeHash: myNodeHash,
      },
      responseType: 'json',
    });
    return response as Response<{ oneTimePad: number[] }>;
  } catch (error) {
    throw error;
  }
};

export const sendVerifyAndVote = async (
  nodeHash: string,
  peerQueue: string[],
  transactionHash: string,
) => {
  try {
    const url = `http://${nodeHash}:3016/verify-and-vote`;
    const response = await got.post(url, {
      json: {
        peerQueue,
        transactionHash,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendAddVote = async (nodeHash: string) => {
  try {
    const url = `http://${nodeHash}:3016/add-vote`;
    const response = await got.post(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendAddBlockToChain = async (nodeHash: string) => {
  try {
    const url = `http://${nodeHash}:3016/add-block-to-chain`;
    const response = await got.post(url);
    return response;
  } catch (error) {
    throw error;
  }
};
