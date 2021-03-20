import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square({ onClick, value }) {
  return (
    <button className={`square value-${value}`} onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ size, squares, onClick }) {
  const renderSquare = function (i) {
    return (
      <Square
        key={i}
        value={squares[i % size][Math.floor(i / size)]}
        onClick={() => onClick(i)}
      />
    );
  };

  return (
    <div>
      {Array(size)
        .fill(1)
        .map((el, i) => {
          return (
            <div key={i} className="board-row">
              {Array(size)
                .fill(1)
                .map((el, j) => {
                  return renderSquare(i * size + j);
                })}
            </div>
          );
        })}
    </div>
  );
}

function Game({ size }) {
  const [history, setHistory] = useState([
    {
      squares: Array(size)
        .fill("null")
        .map((x) =>
          Array(size)
            .fill("null")
            .map((x) => null)
        ),
    },
  ]);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);
  const [winner, setWinner] = useState(false);

  const current = history[stepNumber];

  const move = (x, y) => {
    const historyAtStep = history.slice(0, stepNumber + 1);
    const current = historyAtStep[historyAtStep.length - 1];
    let sq = current.squares.map((x) => x.map((y) => y));
    const player = xIsNext ? "X" : "O";

    if (winner || sq[x][y] !== null) {
      return;
    } else {
      sq[x][y] = player;
    }

    // check winning moves in Rows, Columns and Diagonals
    for (let i = 0; i < size; i++) {
      if (sq[x][i] !== player) break;
      if (i === size - 1) {
        setWinner(player);
      }
    }

    for (let i = 0; i < size; i++) {
      if (sq[i][y] !== player) break;
      if (i === size - 1) {
        setWinner(player);
      }
    }
    if (x === y) {
      for (let i = 0; i < size; i++) {
        if (sq[i][i] !== player) break;
        if (i === size - 1) {
          setWinner(player);
        }
      }
    }

    if (x + y === size - 1) {
      for (let i = 0; i < size; i++) {
        if (sq[i][size - 1 - i] !== player) break;
        if (i === size - 1) {
          setWinner(player);
        }
      }
    }

    if (stepNumber === Math.pow(size, 2) - 1) {
      console.log("Draw")
    }

    setHistory(historyAtStep.concat([{ squares: sq }]));
    setXIsNext(!xIsNext);
    setStepNumber(historyAtStep.length);
  };

  const handleOnClick = (i) => {
    move(i % size, Math.floor(i / size));
  };

  const jumpTo = (step) => {
    setXIsNext(step % 2 === 0);
    setStepNumber(step);
    setWinner(false);
  };

  const moves = history.map((step, idx) => {
    const desc = idx ? `Go back to move #${idx}` : `Go to game start`;
    return (
      <li key={idx}>
        <button onClick={() => jumpTo(idx)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = `The winner is ${winner}`;
  } else if (stepNumber === Math.pow(size, 2)) {
    status = "It's a draw";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          size={size}
          onClick={(i) => handleOnClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

ReactDOM.render(<Game size={3} />, document.getElementById("root"));