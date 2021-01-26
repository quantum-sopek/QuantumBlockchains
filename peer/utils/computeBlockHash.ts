import crypto from 'crypto';

export const computeBlockHash = (
  index: number,
  transaction: string,
  timestamp: number,
  previousBlockHash: string,
) => {
  const blockString = `${index}-${transaction}-${timestamp}-${previousBlockHash}`;
  const hashFunction = crypto.createHash('sha256');
  hashFunction.update(blockString);
  return hashFunction.digest('hex');
};
