import clsx from "clsx";
import { CheckIcon } from "lucide-react";
import { KakuroPuzzleType } from "~/utils/types";

type PuzzleDisplayType = {
  puzzles?: KakuroPuzzleType[];
};

export function PuzzleDisplay(props: PuzzleDisplayType) {
  const { puzzles = [] } = props;

  return (
    <div className="overflow-y-auto flex flex-col gap-2 w-80 max-h-[590px] border-b-white border-b px-2">
      {puzzles.map((puz, idx) => (
        <SinglePuzzle puzzle={puz} key={idx} />
      ))}
    </div>
  );
}

function SinglePuzzle(props: { puzzle: KakuroPuzzleType }) {
  const { puzzle } = props;

  const isSolved = puzzle.cells.every((cell) => cell.isSolved);

  return (
    <div
      className={clsx([
        "border rounded-md p-2 flex flex-col gap-2",
        {
          "border-green-400/40 bg-green-400/10 text-green-700": isSolved,
          "border-white/20": !isSolved,
        },
      ])}
    >
      <div className="flex justify-between">
        <span className="w-20">Length: {puzzle.length}</span>
        <span className="w-16">Sum: {puzzle.sum}</span>
      </div>
      <div className="flex gap-2">
        {puzzle.cells.map((cell, idx) => (
          <div
            className="w-6 h-6 p-1 text-sm rounded-sm bg-white text-black flex items-center justify-center"
            key={idx}
          >
            {cell.solvedNumber}
          </div>
        ))}
        {isSolved ? (
          <CheckIcon className="ml-auto" />
        ) : (
          <div className="flex gap-1 ml-auto">
            {puzzle.hintCells.map((cell, idx) => (
              <div
                className="w-4 h-4 rounded-sm bg-black text-sm"
                key={idx}
                title={`${cell.x}, ${cell.y}`}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
