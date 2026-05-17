export type Matrix = number[][];

// Keep the grid finite so patterns interact with edges in a predictable way.
export const WRAP_EDGES = false;

export function normalizeMatrix(matrix: Matrix): Matrix {
  const safeRows = Array.isArray(matrix) ? matrix.filter(Array.isArray) : [];
  const columnCount = safeRows.reduce((max, row) => Math.max(max, row.length), 0);

  if (columnCount === 0) {
    return [];
  }

  return safeRows.map((row) =>
    Array.from({ length: columnCount }, (_, index) => (row[index] === 1 ? 1 : 0)),
  );
}

export function cloneMatrix(matrix: Matrix): Matrix {
  return normalizeMatrix(matrix).map((row) => [...row]);
}

function countLiveNeighboursInNormalizedMatrix(matrix: Matrix, row: number, col: number): number {
  if (matrix.length === 0) {
    return 0;
  }

  const rowCount = matrix.length;
  const colCount = matrix[0].length;
  let liveNeighbours = 0;

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }

      let nextRow = row + rowOffset;
      let nextCol = col + colOffset;

      if (WRAP_EDGES) {
        nextRow = (nextRow + rowCount) % rowCount;
        nextCol = (nextCol + colCount) % colCount;
      } else if (nextRow < 0 || nextRow >= rowCount || nextCol < 0 || nextCol >= colCount) {
        continue;
      }

      if (matrix[nextRow][nextCol] === 1) {
        liveNeighbours += 1;
      }
    }
  }

  return liveNeighbours;
}

export function countLiveNeighbours(matrix: Matrix, row: number, col: number): number {
  const normalized = normalizeMatrix(matrix);
  return countLiveNeighboursInNormalizedMatrix(normalized, row, col);
}

export function stepLife(matrix: Matrix): Matrix {
  const normalized = normalizeMatrix(matrix);

  if (normalized.length === 0) {
    return [];
  }

  return normalized.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const liveNeighbours = countLiveNeighboursInNormalizedMatrix(normalized, rowIndex, colIndex);

      if (cell === 1) {
        return liveNeighbours === 2 || liveNeighbours === 3 ? 1 : 0;
      }

      return liveNeighbours === 3 ? 1 : 0;
    }),
  );
}

export function countLiveCells(matrix: Matrix): number {
  return normalizeMatrix(matrix).reduce(
    (total, row) => total + row.reduce((rowTotal, cell) => rowTotal + (cell === 1 ? 1 : 0), 0),
    0,
  );
}

export function matrixToClipboardText(matrix: Matrix): string {
  return JSON.stringify(normalizeMatrix(matrix), null, 2);
}
