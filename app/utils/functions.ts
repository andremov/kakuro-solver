import { KakuroCellType, KakuroColType, KakuroType } from "./types";

export function generateKakuro(): KakuroType {
  return {
    width: 6,
    height: 6,
    grid: generateColumns(6),
  };
}

function generateColumns(columnCount: number): KakuroColType[] {
  const arr = [];

  for (let idx1 = 0; idx1 < columnCount; idx1++) {
    arr.push(generateCells(columnCount, idx1));
  }

  return arr;
}

function generateCells(rowCount: number, y: number): KakuroCellType[] {
  const arr = [];

  for (let idx2 = 0; idx2 < rowCount; idx2++) {
    arr.push(generateCell(y, idx2));
  }

  return arr;
}

function generateCell(y: number, x: number): KakuroCellType {
  return {
    x,
    y,
    isHint: false,
    isSolved: false,
    options: [],
    common: [],
  };
}

export function deleteColumn(grid: KakuroType): KakuroType {
  return {
    width: grid.width - 1,
    height: grid.height,
    grid: grid.grid.map((col) => {
      const col2 = [...col];

      col2.splice(col2.length - 1, 1);

      return col2;
    }),
  };
}

export function addColumn(grid: KakuroType): KakuroType {
  return {
    width: grid.width + 1,
    height: grid.height,
    grid: grid.grid.map((col, idx) => [...col, generateCell(idx, grid.height)]),
  };
}

export function addRow(grid: KakuroType): KakuroType {
  const rowCount = grid.grid[0].length;
  return {
    width: grid.width,
    height: grid.height + 1,
    grid: [...grid.grid, generateCells(rowCount, grid.height)],
  };
}

export function deleteRow(grid: KakuroType): KakuroType {
  const contents = [...grid.grid];

  contents.splice(grid.grid.length - 1, 1);

  return {
    width: grid.width,
    height: grid.height - 1,
    grid: contents,
  };
}

export function generateCombinations(
  sum: number,
  length: number,
  blockedNumbers: number[]
): number[][] {
  const results: number[][] = [];

  function helper(path: number[], start: number, remainingSum: number) {
    if (path.length === length) {
      if (remainingSum === 0) results.push([...path]);
      return;
    }

    for (let i = start; i <= 9; i++) {
      if (i > remainingSum) break;
      helper([...path, i], i + 1, remainingSum - i);
    }
  }

  helper([], 1, sum);
  return results.filter((result) => {
    return intersection(result, blockedNumbers).length === 0;
  });
}

export function intersection(arr1: number[], arr2: number[]) {
  return arr1.filter((item) => arr2.includes(item));
}

export function union(arr1: number[][]) {
  return Array.from(new Set([...arr1.flat()]));
}

export function sum(arr: number[]) {
  if (arr.length === 0) return 0;
  return arr.reduce((prev, curr) => prev + curr);
}
