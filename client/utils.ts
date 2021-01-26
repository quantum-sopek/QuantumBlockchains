import dotenv from 'dotenv';
dotenv.config();

export const getAllPeersHashes = () => ([
  process.env.FIRST_PEER_HASH,
  process.env.SECOND_PEER_HASH,
  process.env.THIRD_PEER_HASH,
  process.env.FOURTH_PEER_HASH
]);
