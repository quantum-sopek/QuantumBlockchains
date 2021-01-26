import { generateRandomBinaryArray } from '../utils/generateRandomBinaryArray';
import { sendOneTimePad, checkIfOneTimePadIsEstablished } from './api';
import { nodeService } from './nodeService';

export interface OneTimePadMapping {
  oneTimePad: number[];
  nodeHash: string;
}

export const oneTimePadService = () => {
  let oneTimePadMapping = [] as OneTimePadMapping[];

  const { getContiguousNodesHashes, getMyNodeHash } = nodeService();
  const contiguousNodesHashes = getContiguousNodesHashes();
  const myNodeHash = getMyNodeHash();

  const establishOneTimePad = async () => {
    for (const nodeHash of contiguousNodesHashes) {
      const { body } = await checkIfOneTimePadIsEstablished(
        nodeHash,
        myNodeHash
      );
      const { oneTimePad } = body;
      const oneTimePadFromMapping = getOneTimePadFromMapping(nodeHash);
      if (!!body && compareOneTimePads(oneTimePadFromMapping, oneTimePad)) {
        throw Error('Non matching one time pad');
      }
      if (!(!!body && compareOneTimePads(oneTimePadFromMapping, oneTimePad))) {
        generateAndSendOneTimePad(nodeHash);
      }
    }
    return oneTimePadMapping;
  };

  const getOneTimePadFromMapping = (nodeHash: string) => {
    const filteredOneTimePadMapping = oneTimePadMapping.filter(
      (oneTimePadMap) => oneTimePadMap.nodeHash === nodeHash
    )[0];
    return filteredOneTimePadMapping?.oneTimePad;
  };

  const generateAndSendOneTimePad = async (nodeHash: string) => {
    const oneTimePad = generateRandomBinaryArray(35);
    oneTimePadMapping.push({
      nodeHash,
      oneTimePad
    });
    await sendOneTimePad(nodeHash, oneTimePad, myNodeHash);
  };

  const checkIfOneTimePadExists = (nodeHash: string) => {
    const toeplitzObjectFound = oneTimePadMapping.filter(
      (oneTimePadMap) => oneTimePadMap.nodeHash === nodeHash
    )[0];
    return toeplitzObjectFound?.oneTimePad;
  };

  const addOneTimePad = (oneTimePad: number[], nodeHash: string) => {
    if (!oneTimePadMapping.some(oneTimePadMap => oneTimePadMap.nodeHash === nodeHash)) {
      oneTimePadMapping.push({
        nodeHash,
        oneTimePad
      });
    }
  };

  const clearOneTimePads = () => {
    oneTimePadMapping = [];
  };

  const getOneTimePadMapping = () => oneTimePadMapping;

  return {
    establishOneTimePad,
    checkIfOneTimePadExists,
    addOneTimePad,
    clearOneTimePads,
    getOneTimePadMapping,
  };
};

const compareOneTimePads = (leftOneTimePad: number[], rightOneTimePad: number[]) => {
  if (!leftOneTimePad || !rightOneTimePad) {
    return false;
  }
  return leftOneTimePad.every((value, index) => value === rightOneTimePad[index]);
}