import crypto from 'crypto';

export const computeProposalHash = (
  teoplitzHash: string,
  nodeHash: string,
  transaction: string,
) => {
  const blockString = `${teoplitzHash}-${nodeHash}-${transaction}`;
  const hashFunction = crypto.createHash('sha256');
  hashFunction.update(blockString);
  return hashFunction.digest('hex');
};
