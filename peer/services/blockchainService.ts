import fs from 'fs';
import path from 'path';

import { Block } from '../types';
import { computeBlockHash } from '../utils/computeBlockHash';

export const blockchainService = () => {
  const loadBlocksFromFiles = () => {
    const dirname = path.join(__dirname, '../blocks/');
    fs.readdir(dirname, (error, filenames) => {
      if (error) {
        console.error(error);
        return;
      }
      const sortedFilenames = sortFilenames(filenames);
      sortedFilenames.forEach((filename) => {
        readBlockFromFile(dirname, filename);
      });
    });
  };

  const sortFilenames = (filenames: string[]) => {
    return filenames.sort((left, right) => {
      const leftNumber = Number(left.replace('block_', '').replace('.json', ''));
      const rightNumber = Number(right.replace('block_', '').replace('.json', ''));
      return leftNumber - rightNumber;
    });
  };

  const readBlockFromFile = (dirname: string, filename: string) => {
    fs.readFile(dirname + filename, 'utf-8', (error, blockAsString) => {
      if (error) {
        console.error(error);
        return;
      }
      addBlock(JSON.parse(blockAsString));
    });
  };

  loadBlocksFromFiles();
  const blocks = [] as Block[];

  const addBlock = (block: Block) => {
    blocks.push(block);
  };

  const getLastBlock = () => {
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock) {
      return blocks[blocks.length - 1];
    } else {
      return createGenesisBlock(addBlock);
    }
  };

  const saveBlock = (block: Block) => {
    try {
      const filename = path.join(__dirname, `../blocks/block_${block.index}.json`);
      fs.writeFileSync(filename, JSON.stringify(block));
    } catch (err) {
      console.error(err)
    }
  };

  return { getLastBlock, addBlock, saveBlock };
};

const createGenesisBlock = (addBlock: (block: Block) => void) => {
  const index = 0;
  const timestamp = Date.now();
  const transaction = '';
  const block = {
    index,
    previousBlockHash: '',
    data: '',
    timestamp,
    hash: computeBlockHash(index, transaction, timestamp, ''),
  };
  addBlock(block);
  return block;
};
