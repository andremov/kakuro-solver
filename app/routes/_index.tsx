import type { MetaFunction } from "@remix-run/node";
import clsx from "clsx";
import {
  DotIcon,
  PlayIcon,
  RotateCcwIcon,
  SquareArrowDownIcon,
  SquareArrowLeftIcon,
  SquareArrowRightIcon,
  SquareArrowUpIcon,
  SquareDashedIcon,
  SquareMousePointerIcon,
  XIcon,
} from "lucide-react";
import { ChangeEvent, useState } from "react";
import { GridDisplay } from "~/components/grid-display";
import { PuzzleDisplay } from "~/components/puzzle-display";
import {
  addColumn,
  addRow,
  deleteColumn,
  deleteRow,
  generateKakuro,
} from "~/utils/functions";
import { getPuzzles, solveKakuro } from "~/utils/solve-functions";
import { KakuroType, Position, Tool } from "~/utils/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Kakuro Solver" },
    { name: "description", content: "👤✏️ Andrés Movilla" },
  ];
};

export default function Index() {
  const [kakuro, setKakuro] = useState(generateKakuro());
  const [tool, setTool] = useState(Tool.NONE);

  function setToolSquare() {
    setTool(Tool.TOGGLE_SQUARE);
  }

  function setToolNone() {
    setTool(Tool.NONE);
  }

  function callAddRow() {
    setKakuro(addRow(kakuro));
  }

  function callDelRow() {
    setKakuro(deleteRow(kakuro));
  }

  function callDelCol() {
    setKakuro(deleteColumn(kakuro));
  }

  function callAddCol() {
    setKakuro(addColumn(kakuro));
  }

  function onCellClick(y: number, x: number) {
    const kakuroCopy = JSON.parse(JSON.stringify(kakuro)) as KakuroType;

    if (tool === Tool.TOGGLE_SQUARE) {
      if (kakuroCopy.grid[x][y].isHint) {
        kakuroCopy.grid[x][y].isHint = false;
        kakuroCopy.grid[x][y].hintNumberDown = undefined;
        kakuroCopy.grid[x][y].hintNumberLeft = undefined;
        kakuroCopy.grid[x][y].hintNumberRight = undefined;
        kakuroCopy.grid[x][y].hintNumberUp = undefined;
        kakuroCopy.grid[x][y].isSolved = false;
      } else {
        kakuroCopy.grid[x][y].isHint = true;
        kakuroCopy.grid[x][y].hintNumberDown = 0;
        kakuroCopy.grid[x][y].hintNumberLeft = 0;
        kakuroCopy.grid[x][y].hintNumberRight = 0;
        kakuroCopy.grid[x][y].hintNumberUp = 0;
        kakuroCopy.grid[x][y].options = [];
        kakuroCopy.grid[x][y].solvedNumber = undefined;
        kakuroCopy.grid[x][y].common = [];
        kakuroCopy.grid[x][y].isSolved = false;
      }
    }

    setKakuro(getPuzzles(kakuroCopy));
  }

  function doSolveStep() {
    setKakuro(solveKakuro(kakuro));
  }

  function doReset() {
    setKakuro(generateKakuro());
  }

  function doClear() {
    const kakuroCopy = JSON.parse(JSON.stringify(kakuro)) as KakuroType;

    for (let x = 0; x < kakuroCopy.width; x++) {
      for (let y = 0; y < kakuroCopy.height; y++) {
        kakuroCopy.grid[x][y].common = [];
        kakuroCopy.grid[x][y].isSolved = false;
        kakuroCopy.grid[x][y].options = [];
        kakuroCopy.grid[x][y].solvedNumber = undefined;
      }
    }

    setKakuro(getPuzzles(kakuroCopy));
  }

  function onEditCellHints(
    y: number,
    x: number,
    e: ChangeEvent<HTMLInputElement>,
    position: Position
  ) {
    const kakuroCopy = JSON.parse(JSON.stringify(kakuro)) as KakuroType;
    const thisCell = kakuroCopy.grid[x][y];

    if (position === Position.UP) {
      const [affectedPuzzle] = kakuroCopy.puzzles!.filter((p) => {
        return (
          p.sum === thisCell.hintNumberUp &&
          p.hintCells.some(
            (cell) => cell.x === thisCell.x && cell.y === thisCell.y
          ) &&
          p.hintCells.every((cell) => cell.x === thisCell.x)
        );
      });

      const involvedIndex = affectedPuzzle.hintCells.findIndex(
        (cell) => cell.x === thisCell.x && cell.y === thisCell.y
      );

      thisCell.hintNumberUp = Number(e.target.value);

      if (affectedPuzzle.hintCells.length > 1) {
        const alternateHintCell = (involvedIndex + 1) % 2;

        const { x: altY, y: altX } =
          affectedPuzzle.hintCells[alternateHintCell];

        kakuroCopy.grid[altX][altY].hintNumberDown = Number(e.target.value);
      }
    }

    if (position === Position.DOWN) {
      const [affectedPuzzle] = kakuroCopy.puzzles!.filter((p) => {
        console.log(p.hintCells);

        return (
          p.sum === thisCell.hintNumberDown &&
          p.hintCells.some(
            (cell) => cell.x === thisCell.x && cell.y === thisCell.y
          ) &&
          p.hintCells.every((cell) => cell.x === thisCell.x)
        );
      });

      const involvedIndex = affectedPuzzle.hintCells.findIndex(
        (cell) => cell.x === thisCell.x && cell.y === thisCell.y
      );

      thisCell.hintNumberDown = Number(e.target.value);

      if (affectedPuzzle.hintCells.length > 1) {
        const alternateHintCell = (involvedIndex + 1) % 2;

        const { x: altY, y: altX } =
          affectedPuzzle.hintCells[alternateHintCell];

        kakuroCopy.grid[altX][altY].hintNumberUp = Number(e.target.value);
      }
    }

    if (position === Position.LEFT) {
      const [affectedPuzzle] = kakuroCopy.puzzles!.filter((p) => {
        return (
          p.sum === thisCell.hintNumberLeft &&
          p.hintCells.some(
            (cell) => cell.x === thisCell.x && cell.y === thisCell.y
          ) &&
          p.hintCells.every((cell) => cell.y === thisCell.y)
        );
      });

      const involvedIndex = affectedPuzzle.hintCells.findIndex(
        (cell) => cell.x === thisCell.x && cell.y === thisCell.y
      );

      thisCell.hintNumberLeft = Number(e.target.value);

      if (affectedPuzzle.hintCells.length > 1) {
        const alternateHintCell = (involvedIndex + 1) % 2;

        const { x: altY, y: altX } =
          affectedPuzzle.hintCells[alternateHintCell];

        kakuroCopy.grid[altX][altY].hintNumberRight = Number(e.target.value);
      }
    }

    if (position === Position.RIGHT) {
      const [affectedPuzzle] = kakuroCopy.puzzles!.filter((p) => {
        return (
          p.sum === thisCell.hintNumberRight &&
          p.hintCells.some(
            (cell) => cell.x === thisCell.x && cell.y === thisCell.y
          ) &&
          p.hintCells.every((cell) => cell.y === thisCell.y)
        );
      });

      const involvedIndex = affectedPuzzle.hintCells.findIndex(
        (cell) => cell.x === thisCell.x && cell.y === thisCell.y
      );

      thisCell.hintNumberRight = Number(e.target.value);

      if (affectedPuzzle.hintCells.length > 1) {
        const alternateHintCell = (involvedIndex + 1) % 2;

        const { x: altY, y: altX } =
          affectedPuzzle.hintCells[alternateHintCell];

        kakuroCopy.grid[altX][altY].hintNumberLeft = Number(e.target.value);
      }
    }

    setKakuro(getPuzzles(kakuroCopy));
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-900 w-screen">
      <div className="flex gap-4">
        <GridDisplay
          kakuro={kakuro}
          onCellClick={onCellClick}
          editCellHints={onEditCellHints}
        />
        <PuzzleDisplay puzzles={kakuro.puzzles} />
      </div>

      <div className="flex gap-4 p-4 items-center">
        <div className="flex gap-2">
          <div className="flex gap-2 justify-center flex-col">
            <button
              className="flex gap-2 items-center px-4 py-2 border border-white rounded-md hover:border-green-400 hover:bg-green-400/20 transition"
              onClick={callAddCol}
            >
              <SquareArrowRightIcon />
              <span>Add Column</span>
            </button>
            <button
              className="flex gap-2 items-center px-4 py-2 border border-white rounded-md hover:border-red-400 hover:bg-red-400/20 transition"
              onClick={callDelCol}
            >
              <SquareArrowLeftIcon />
              <span>Del Column</span>
            </button>
          </div>
          <div className="flex gap-2 justify-center flex-col">
            <button
              className="flex gap-2 items-center px-4 py-2 border border-white rounded-md hover:border-green-400 hover:bg-green-400/20 transition"
              onClick={callAddRow}
            >
              <SquareArrowDownIcon />
              <span>Add Row</span>
            </button>
            <button
              className="flex gap-2 items-center px-4 py-2 border border-white rounded-md hover:border-red-400 hover:bg-red-400/20 transition"
              onClick={callDelRow}
            >
              <SquareArrowUpIcon />
              <span>Del Row</span>
            </button>
          </div>
        </div>

        <DotIcon />

        <div className="flex flex-wrap gap-2 flex-col">
          <button
            className={clsx([
              "flex gap-2 items-center px-4 py-2 border rounded-md transition",
              {
                "border-blue-500 bg-blue-500/20": tool === Tool.TOGGLE_SQUARE,
                "border-white hover:bg-white/20": tool !== Tool.TOGGLE_SQUARE,
              },
            ])}
            onClick={setToolSquare}
          >
            <SquareMousePointerIcon />
            <span>Toggle Square</span>
          </button>

          <button
            className={clsx([
              "flex gap-2 items-center px-4 py-2 border rounded-md transition",
              {
                "border-blue-500 bg-blue-500/20": tool === Tool.NONE,
                "border-white hover:bg-white/20": tool !== Tool.NONE,
              },
            ])}
            onClick={setToolNone}
          >
            <SquareDashedIcon />
            <span>No Tool</span>
          </button>
        </div>

        <DotIcon />

        <div className="flex flex-wrap gap-2">
          <button
            className={clsx([
              "flex gap-2 items-center px-4 py-2 border rounded-md transition border-white hover:bg-white/20",
            ])}
            onClick={doSolveStep}
          >
            <PlayIcon />
            <span>Solve</span>
          </button>

          <button
            className={clsx([
              "flex gap-2 items-center px-4 py-2 border rounded-md transition border-white hover:bg-white/20",
            ])}
            onClick={doClear}
          >
            <XIcon />
            <span>Clear</span>
          </button>

          <button
            className={clsx([
              "flex gap-2 items-center px-4 py-2 border rounded-md transition border-white hover:bg-white/20",
            ])}
            onClick={doReset}
          >
            <RotateCcwIcon />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
