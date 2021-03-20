import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square({ onClick, value }) {
  return (
    <button className="square" onClick={onClick}>
      {value}
    </button>
  );
}

function Board({ squares, onClick }) {
  const renderSquare = function (i) {
    return <Square key={i} value={squares[i]} onClick={() => onClick(i)} />;
  };

  let idx = 0;
  return (
    <div>
      {Array(3)
        .fill(1)
        .map((el, i) => {
          return (
            <div key={i} className="board-row">
              {Array(3)
                .fill(1)
                .map((el, i) => {
                  return renderSquare(idx++);
                })}
            </div>
          );
        })}
    </div>
  );
}

function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [xIsNext, setXIsNext] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const handleOnClick = (i) => {
    const historyAtStep = history.slice(0, stepNumber + 1);
    const current = historyAtStep[historyAtStep.length - 1];
    const sq = current.squares.slice();
    if (calculateWinner(sq) || sq[i]) {
      return;
    }
    sq[i] = xIsNext ? "X" : "O";
    setHistory(historyAtStep.concat([{ squares: sq }]));
    setXIsNext(!xIsNext);
    setStepNumber(historyAtStep.length);
  };

  const jumpTo = (step) => {
    setXIsNext(step % 2 === 0);
    setStepNumber(step);
  };

  const moves = history.map((step, move) => {
    const desc = move ? `Go back to move #${move}` : `Go to game start`;
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = `The winner is ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={(i) => handleOnClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
