export type KakuroType = {
  width: number;
  height: number;
  grid: KakuroColType[];
  puzzles?: KakuroPuzzleType[];
};

export type KakuroPuzzleType = {
  length: number;
  sum: number;
  cells: KakuroColType;
  hintCells: KakuroColType;
  direction: Position;
};

export type KakuroColType = KakuroCellType[];

export type KakuroCellType = {
  x: number;
  y: number;

  isHint: boolean;
  hintNumberUp?: number;
  hintNumberDown?: number;
  hintNumberLeft?: number;
  hintNumberRight?: number;

  options: number[][];
  common: number[];

  isSolved: boolean;
  solvedNumber?: number;
};

export enum Tool {
  NONE = 0,
  TOGGLE_SQUARE,
}

export enum Position {
  UP = 0,
  DOWN,
  LEFT,
  RIGHT,
}
