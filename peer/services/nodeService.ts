import dotenv from 'dotenv';
dotenv.config();

export const nodeService = () => {
  const nodes = [
    process.env.MY_PEER_HASH,
    process.env.SECOND_PEER_HASH,
    process.env.THIRD_PEER_HASH,
    process.env.FOURTH_PEER_HASH,
  ];

  const getContiguousNodesHashes = () => {
    return [
      process.env.SECOND_PEER_HASH,
      process.env.THIRD_PEER_HASH,
      process.env.FOURTH_PEER_HASH,
    ]
  }

  const getMyNodeHash = () => process.env.MY_PEER_HASH

  const getAllNodesHashes = () => nodes;

  return { getContiguousNodesHashes, getMyNodeHash, getAllNodesHashes };
};
