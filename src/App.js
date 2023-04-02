// Khiem Nguyen - CIS 658
// File's Purpose - Creates the Square and Board (gameboard) components. The Board component is composed of 3x3 sets of Squares component for 
// the project. The board component will render the Square component. Written in JSX.
// Date - 2023/31/03
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]}/>
        <Square value={squares[2]}/>
      </div>

      <div className="board-row">
        <Square value={squares[3]}/>
        <Square value={squares[4]}/>
        <Square value={squares[5]}/>
      </div>

      <div className="board-row">
        <Square value={squares[6]}/>
        <Square value={squares[7]}/>
        <Square value={squares[8]}/>
      </div>
    </>
  );
}