// Khiem Nguyen - CIS 658
// File's Purpose - Creates the Square and Board (gameboard) components. The Board component is composed of 3x3 sets of Squares component for 
// the project. The board component will render the Square component. Written in JSX.
// Date - 2023/31/03
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    console.log('clicked!');
  }

  return <button className="square" onClick={handleClick}>{value}</button>;
}

export default function Board() {

  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>

      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>

      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}