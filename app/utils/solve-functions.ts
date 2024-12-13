import { intersection, union, generateCombinations, sum } from "./functions";
import {
  KakuroCellType,
  KakuroPuzzleType,
  KakuroType,
  Position,
} from "./types";

export function solveKakuro(kakuro: KakuroType): KakuroType {
  clearOptions(kakuro);
  getOptions(kakuro);
  getCommonOptions(kakuro);

  let changed = false;

  changed = solveUniques(kakuro);

  if (changed) return { ...kakuro };

  changed = solveMinPossible(kakuro);

  if (changed) return { ...kakuro };

  return { ...kakuro };
}

export function getPuzzles(kakuro: KakuroType) {
  kakuro.puzzles = [];

  for (let x = 0; x < kakuro.width; x++) {
    for (let y = 0; y < kakuro.height; y++) {
      const cell = kakuro.grid[y][x];
      if (cell.isHint) {
        if (cell.hintNumberDown !== undefined) {
          const hintNumber = cell.hintNumberDown;
          const breadth = [];
          let offset = 1;
          let currCell = kakuro.grid[y + offset]
            ? kakuro.grid[y + offset][x]
            : undefined;

          while (currCell && !currCell.isHint) {
            breadth.push(currCell);
            offset++;
            currCell = kakuro.grid[y + offset]
              ? kakuro.grid[y + offset][x]
              : undefined;
          }

          const hintCells = [cell];

          if (currCell) {
            hintCells.push(currCell);
          }

          if (offset > 1) {
            kakuro.puzzles.push({
              direction: Position.DOWN,
              cells: breadth,
              hintCells: hintCells,
              length: breadth.length,
              sum: hintNumber,
            });
          }
        }

        if (cell.hintNumberUp !== undefined) {
          const hintNumber = cell.hintNumberUp;
          const breadth = [];
          let offset = 1;
          let currCell = kakuro.grid[y - offset]
            ? kakuro.grid[y - offset][x]
            : undefined;

          while (currCell && !currCell.isHint) {
            breadth.push(currCell);
            offset++;
            currCell = kakuro.grid[y - offset]
              ? kakuro.grid[y - offset][x]
              : undefined;
          }

          const hintCells = [cell];

          if (currCell) {
            hintCells.push(currCell);
          }

          if (offset > 1) {
            kakuro.puzzles.push({
              direction: Position.UP,
              cells: breadth,
              hintCells: hintCells,
              length: breadth.length,
              sum: hintNumber,
            });
          }
        }

        if (cell.hintNumberLeft !== undefined) {
          const hintNumber = cell.hintNumberLeft;
          const breadth = [];
          let offset = 1;
          let currCell = kakuro.grid[y][x - offset];

          while (currCell && !currCell.isHint) {
            breadth.push(currCell);
            offset++;
            currCell = kakuro.grid[y][x - offset];
          }

          const hintCells = [cell];

          if (currCell) {
            hintCells.push(currCell);
          }

          if (offset > 1) {
            kakuro.puzzles.push({
              direction: Position.LEFT,
              cells: breadth,
              hintCells: hintCells,
              length: breadth.length,
              sum: hintNumber,
            });
          }
        }

        if (cell.hintNumberRight !== undefined) {
          const hintNumber = cell.hintNumberRight;
          const breadth = [];
          let offset = 1;
          let currCell = kakuro.grid[y][x + offset];

          while (currCell && !currCell.isHint) {
            breadth.push(currCell);
            offset++;
            currCell = kakuro.grid[y][x + offset];
          }

          const hintCells = [cell];

          if (currCell) {
            hintCells.push(currCell);
          }

          if (offset > 1) {
            kakuro.puzzles.push({
              direction: Position.RIGHT,
              cells: breadth,
              hintCells: hintCells,
              length: breadth.length,
              sum: hintNumber,
            });
          }
        }
      }
    }
  }

  kakuro.puzzles = kakuro.puzzles.filter(
    (p1, idx, arr) =>
      idx ===
      arr.findIndex(
        (p2) =>
          puzzleToString(p1) === puzzleToString(p2) ||
          puzzleToString(p1) === puzzleToStringAlt(p2)
      )
  );

  return kakuro;
}

function cellToString(cell: KakuroCellType) {
  return `[${cell.x}, ${cell.y}]`;
}

function puzzleToString(puzzle: KakuroPuzzleType) {
  if (puzzle.hintCells.length === 1) {
    return `${cellToString(puzzle.hintCells[0])} ${puzzle.direction}`;
  }

  return puzzle.hintCells
    .map((cell) => cellToString(cell))
    .reduce((prev, curr) => `${prev}, ${curr}`);
}

function puzzleToStringAlt(puzzle: KakuroPuzzleType) {
  if (puzzle.hintCells.length === 1) {
    return `${cellToString(puzzle.hintCells[0])} ${puzzle.direction}`;
  }

  return puzzle.hintCells
    .map((cell) => cellToString(cell))
    .reverse()
    .reduce((prev, curr) => `${prev}, ${curr}`);
}

function getOptions(kakuro: KakuroType) {
  if (!kakuro.puzzles) return;

  for (let p = 0; p < kakuro.puzzles.length; p++) {
    const puzzle = kakuro.puzzles[p];

    const solvedNums = puzzle.cells
      .filter((cell) => cell.isSolved)
      .map((cell) => cell.solvedNumber!);

    const combos = union(
      generateCombinations(
        puzzle.sum - sum(solvedNums),
        puzzle.length - solvedNums.length,
        solvedNums
      )
    );

    puzzle.cells.forEach((cell) => {
      if (!cell.isSolved) cell.options.push(combos);
    });
  }
}

function clearOptions(kakuro: KakuroType) {
  for (let x = 0; x < kakuro.width; x++) {
    for (let y = 0; y < kakuro.height; y++) {
      const cell = kakuro.grid[y][x];

      if (!cell.isHint && cell.options.length > 0) {
        cell.options = [];
        cell.common = [];
      }
    }
  }
}

function getCommonOptions(kakuro: KakuroType) {
  for (let x = 0; x < kakuro.width; x++) {
    for (let y = 0; y < kakuro.height; y++) {
      const cell = kakuro.grid[y][x];
      if (!cell.isHint && cell.options.length > 0) {
        cell.common = cell.options.reduce(intersection);
      }
    }
  }
}

function solveUniques(kakuro: KakuroType) {
  let changed = false;

  for (let x = 0; x < kakuro.width; x++) {
    for (let y = 0; y < kakuro.height; y++) {
      const cell = kakuro.grid[y][x];

      if (!cell.isSolved && cell.common.length === 1) {
        changed = true;
        cell.isSolved = true;
        cell.solvedNumber = cell.common[0];
      }
    }
  }

  return changed;
}

function solveMinPossible(kakuro: KakuroType) {
  let changed = false;

  for (let p = 0; p < kakuro.puzzles!.length; p++) {
    const puzzle = kakuro.puzzles![p];
    if (puzzle.cells.every((cell) => cell.isSolved)) {
      continue;
    }

    const options = puzzle.cells.map((cell) => cell.common.sort());
    const combinations = getAllCombinationSumsWithDetails(options)
      .sort((c1, c2) => c1.sum - c2.sum)
      .filter((combo) => combo.sum === puzzle.sum);

    if (combinations.length === 0) continue;

    if (combinations.length === 1) {
      // UNIQUE COMBINATION
      changed = true;
      puzzle.cells.forEach((cell, idx) => {
        cell.isSolved = true;
        cell.solvedNumber = combinations[0].combination[idx];
      });
    } else {
      puzzle.cells.forEach((cell, idx) => {
        const crossOptions = new Set(
          combinations.reduce(
            (prev, curr) => [...prev, curr.combination[idx]],
            [] as number[]
          )
        );
        if (crossOptions.size === 1) {
          cell.isSolved = true;
          cell.solvedNumber = combinations[0].combination[idx];
        }
      });
    }
  }

  return changed;
}

function getAllCombinationSumsWithDetails(
  arrays: number[][]
): { sum: number; combination: number[] }[] {
  const results: { sum: number; combination: number[] }[] = [];

  // Helper function to generate combinations recursively
  function combine(
    index: number,
    currentSum: number,
    currentCombination: number[]
  ) {
    // If we've processed all arrays, add the sum and combination to results
    if (index === arrays.length) {
      results.push({ sum: currentSum, combination: [...currentCombination] });
      return;
    }

    // Loop through each number in the current array
    for (const num of arrays[index]) {
      currentCombination.push(num); // Add the number to the current combination
      combine(index + 1, currentSum + num, currentCombination);
      currentCombination.pop(); // Backtrack to try the next number
    }
  }

  combine(0, 0, []); // Start recursion
  return results.filter(
    (result) => new Set(result.combination).size === result.combination.length
  );
}
