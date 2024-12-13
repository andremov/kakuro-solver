import clsx from "clsx";
import { ChangeEvent } from "react";
import { KakuroType, Position } from "~/utils/types";

type GridType = {
  kakuro: KakuroType;
  onCellClick: (x: number, y: number) => void;
  editCellHints: (
    x: number,
    y: number,
    e: ChangeEvent<HTMLInputElement>,
    position: Position
  ) => void;
};

export function GridDisplay(props: GridType) {
  const { kakuro, onCellClick, editCellHints } = props;

  return (
    <div className="flex gap-1 flex-col">
      {kakuro.grid.map((col, idx1) => (
        <div key={idx1} className="flex gap-1">
          {col.map((cell, idx2) =>
            cell.isHint ? (
              <HintSquare
                key={idx2}
                up={cell.hintNumberUp!}
                down={cell.hintNumberDown!}
                left={cell.hintNumberLeft!}
                right={cell.hintNumberRight!}
                showUp={
                  kakuro.grid[idx1 - 1] && !kakuro.grid[idx1 - 1][idx2].isHint
                }
                showDown={
                  kakuro.grid[idx1 + 1] && !kakuro.grid[idx1 + 1][idx2].isHint
                }
                showLeft={
                  kakuro.grid[idx1][idx2 - 1] &&
                  !kakuro.grid[idx1][idx2 - 1].isHint
                }
                showRight={
                  kakuro.grid[idx1][idx2 + 1] &&
                  !kakuro.grid[idx1][idx2 + 1].isHint
                }
                onClick={() => onCellClick(idx2, idx1)}
                editHintValue={(e, pos) => editCellHints(idx2, idx1, e, pos)}
              />
            ) : cell.isSolved ? (
              <SolvedSquare
                key={idx2}
                number={cell.solvedNumber!}
                onClick={() => onCellClick(idx2, idx1)}
              />
            ) : (
              <UnsolvedSquare
                key={idx2}
                numbers={cell.common}
                onClick={() => onCellClick(idx2, idx1)}
              />
            )
          )}
        </div>
      ))}
    </div>
  );
}

function HintSquare(props: {
  up: number;
  down: number;
  left: number;
  right: number;
  showUp: boolean;
  showDown: boolean;
  showLeft: boolean;
  showRight: boolean;
  onClick: () => void;
  editHintValue: (e: ChangeEvent<HTMLInputElement>, position: Position) => void;
}) {
  const {
    up,
    down,
    left,
    right,
    onClick,
    editHintValue,
    showUp,
    showDown,
    showLeft,
    showRight,
  } = props;

  function onFocus(event: React.FocusEvent<HTMLInputElement>) {
    event.target.select();
  }

  return (
    <BaseSquare
      className="border-white/30 text-white bg-black text-lg"
      onClick={onClick}
    >
      {showUp ? (
        <input
          onFocus={onFocus}
          className="w-10 border border-white/0 bg-transparent left-1/3 absolute top-0 rounded-md text-center"
          value={up}
          onChange={(e) => editHintValue(e, Position.UP)}
        />
      ) : (
        <></>
      )}
      {showDown ? (
        <input
          onFocus={onFocus}
          className="w-10 border border-white/0 bg-transparent left-1/3 absolute bottom-0 rounded-md text-center"
          value={down}
          onChange={(e) => editHintValue(e, Position.DOWN)}
        />
      ) : (
        <></>
      )}
      {showLeft ? (
        <input
          onFocus={onFocus}
          className="w-10 border border-white/0 bg-transparent absolute top-1/3 left-0 rounded-md text-center"
          value={left}
          onChange={(e) => editHintValue(e, Position.LEFT)}
        />
      ) : (
        <></>
      )}
      {showRight ? (
        <input
          onFocus={onFocus}
          className="w-10 border border-white/0 bg-transparent absolute top-1/3 right-0 rounded-md text-center"
          value={right}
          onChange={(e) => editHintValue(e, Position.RIGHT)}
        />
      ) : (
        <></>
      )}
    </BaseSquare>
  );
}

function SolvedSquare(props: { number: number; onClick: () => void }) {
  const { number, onClick } = props;

  return (
    <BaseSquare
      className="border-black bg-white text-black text-3xl"
      onClick={onClick}
    >
      <span>{number}</span>
    </BaseSquare>
  );
}

function UnsolvedSquare(props: { numbers: number[]; onClick: () => void }) {
  const { numbers, onClick } = props;

  return (
    <BaseSquare
      className="border-black bg-white text-black flex flex-wrap text-xl px-2 py-1.5 justify-between"
      onClick={onClick}
    >
      <span className={clsx(["mx-1.5", { "opacity-0": !numbers.includes(1) }])}>
        1
      </span>
      <span className={clsx(["mx-1.5", { "opacity-0": !numbers.includes(2) }])}>
        2
      </span>
      <span className={clsx(["mx-1.5", { "opacity-0": !numbers.includes(3) }])}>
        3
      </span>
      <span className={clsx(["mx-1.5", { "opacity-0": !numbers.includes(4) }])}>
        4
      </span>
      <span className={clsx(["mx-1.5", { "opacity-0": !numbers.includes(5) }])}>
        5
      </span>
      <span className={clsx(["mx-1.5", { "opacity-0": !numbers.includes(6) }])}>
        6
      </span>
      <span className={clsx(["mx-1.5", { "opacity-0": !numbers.includes(7) }])}>
        7
      </span>
      <span className={clsx(["mx-1.5", { "opacity-0": !numbers.includes(8) }])}>
        8
      </span>
      <span className={clsx(["mx-1.5", { "opacity-0": !numbers.includes(9) }])}>
        9
      </span>
    </BaseSquare>
  );
}

function BaseSquare(props: {
  children: JSX.Element | JSX.Element[];
  onClick: () => void;
  className?: string;
}) {
  const { onClick, className, children } = props;
  return (
    <button
      className={clsx([
        "relative rounded-md w-24 h-24 border flex items-center justify-center",
        className,
      ])}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
