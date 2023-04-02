// Khiem Nguyen - CIS 658
// File's Purpose - Creates the Square and Board (gameboard) components. The Board component is composed of 3x3 sets of Squares component for 
// the project. The board component will render the Square component. Written in JSX.
// Date - 2023/31/03
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => { handleClick(0) }}/>
        <Square value={squares[1]} onSquareClick={() => { handleClick(1) }}/>
        <Square value={squares[2]} onSquareClick={() => { handleClick(2) }}/>
      </div>

      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => { handleClick(3) }}/>
        <Square value={squares[4]} onSquareClick={() => { handleClick(4) }}/>
        <Square value={squares[5]} onSquareClick={() => { handleClick(5) }}/>
      </div>

      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => { handleClick(6) }}/>
        <Square value={squares[7]} onSquareClick={() => { handleClick(7) }}/>
        <Square value={squares[8]} onSquareClick={() => { handleClick(8) }}/>
      </div>
    </>
  );
}