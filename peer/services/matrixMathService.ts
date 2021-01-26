export const matrixMathService = () => {
  const isToeplitzMatrix = (matrix: number[][]) => {
    for (let row = 0; row < matrix.length - 1; row ++) {
      for (let column = 0; column < matrix[0].length - 1; column ++) {
        if (matrix[row][column] !== matrix[row + 1][column + 1]) {
          return false;
        }
      }
    }
    return true;
  };

  const compareToeplitzMatrixes = (leftMatrix: number[][], rightMatrix: number[][]) => {
    if (!leftMatrix || !rightMatrix) {
      return false;
    }
    for (let row = 0; row < leftMatrix.length - 1; row ++) {
      for (let column = 0; column < leftMatrix[0].length - 1; column ++) {
        if (leftMatrix[row][column] !== rightMatrix[row][column]) {
          return false;
        }
      }
    }
    return true;
  };

  const generateToeplitzMatrix = (binaryArray: number[]) => {
    const firstRow = binaryArray.slice(0, binaryArray.length / 2 + 1);
    const restRows = binaryArray.slice(binaryArray.length / 2 + 1);
    let matrix = [firstRow];
    for (let row = 0; row < restRows.length; row++) {
      const emptyRow = new Array(restRows.length).fill(0);
      matrix.push([restRows[row], ...emptyRow]);
    }

    for (let row = 0; row < matrix.length - 1; row ++) {
      for (let column = 0; column < matrix[0].length - 1; column ++) {
        matrix[row+1][column+1] = matrix[row][column]
      }
    }
    return matrix;
  }

  const convertStringToBinary = (text: string) => {
    let binaryRepresentation = '';
    for (let index = 0; index < text.length; index++) {
      binaryRepresentation += text[index].charCodeAt(0).toString(2);
    }
    return binaryRepresentation;
  };

  const createMatrixFromStringAsBinary = (stringAsBinary: string) => {
    let matrix = [];
    for (let i=0; i < stringAsBinary.length; i++) {
      matrix[i] = [Number(stringAsBinary[i])];
    }
    return matrix;
  };

  const calculateModuloFromMatrixElements = (array: number[][]) => {
    return array
      .map(element => {
        return element[0] % 2;
      })
      .join('');
  };

  const calculateXor = (leftBinary: string, rightBinary: string) => {
    let XorResult = '';
    if (leftBinary.length === rightBinary.length) {
      for (let index = 0; index < leftBinary.length; index++) {
        XorResult += leftBinary[index].charCodeAt(0) ^ rightBinary[index].charCodeAt(0);
      }
    }
    return XorResult;
  };

  return {
    isToeplitzMatrix,
    compareToeplitzMatrixes,
    generateToeplitzMatrix,
    convertStringToBinary,
    createMatrixFromStringAsBinary,
    calculateModuloFromMatrixElements,
    calculateXor
  };
};
