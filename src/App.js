// Khiem Nguyen - CIS 658
// File's Purpose - Creates the Square and Board (gameboard) components. The Board component is composed of 3x3 sets of Squares component for 
// the project. The board component will render the Square component. Written in JSX.
// Date - 2023/31/03
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faO, faX } from '@fortawesome/free-solid-svg-icons';
  

function Square({ value, onSquareClick }) {
  // Note: If desired, replace FontAwesomeIcon w/ Img Elements
  if (value === "X") {
    return <button className="square" onClick={onSquareClick}><FontAwesomeIcon icon={faX} color="blue" /></button>;
  }
  else if (value === "O") {
    return <button className="square" onClick={onSquareClick}><FontAwesomeIcon icon={faO} color="red"/></button>;
  }
  else {
    return <button className="square" onClick={onSquareClick}>{value}</button>;
  }

}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(row, col) {
    if (squares[row][col] || calculateWinner(squares)) {
      return;
    }

    // Perform a deep copy of the nested array; Initial program only did a shallow copy
    // https://dev.to/samanthaming/how-to-deep-clone-an-array-in-javascript-3cig
    const nextSquares = JSON.parse(JSON.stringify(squares));

    if (xIsNext) {
      nextSquares[row][col] = "X";
    }
    else {
      nextSquares[row][col] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  }
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      {/* Create a dynamic board template based on size */}
      <div className="status">{status}</div>
      {/*  Figuring out how to generate loops in JSX
      https://stackoverflow.com/questions/22876978/loop-inside-react-jsx */}
      <div>
        {
          squares.map((nestedArray, rowIndex) => {
            return (
              <div className="board-row" key={rowIndex}>
                {
                  nestedArray.map((cells, colIndex) => {
                    return <Square key={colIndex} value={squares[rowIndex][colIndex]} onSquareClick={() => { handleClick(rowIndex, colIndex) }}/>
                  })
                }
              </div>
            );
          })
        }
      </div>
      
      {/* COMMENT OUT FOR NOW TO PREVENT CODING ERROR */}
      {/* <div>      
        <div className="status">{status}</div>
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
      </div> */}
    </>
  );
}

export default function Game() {
  const [rowColSize, setRowSize] = useState(5); // // Set the state of the initial row and column size, update as desired
  const initialBoard = Array(rowColSize).fill(Array(rowColSize).fill(null)); // The intial gameboard defined by the row and column size set by the player(s). To be passed into the initial history state
  const [history, setHistory] = useState([initialBoard]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {

    // Creates a new array with the previous history array from the first index to the index of the selected move, 
    // and adds new square elements. (see tutorial)
    // Alternative Explanation: https://www.samanthaming.com/tidbits/92-6-use-cases-of-spread-with-array/
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    // Update and set the History array latest history collection.
    setHistory(nextHistory); 

    // Update and set the current move to match the index of the nextHistory array's last element or latest point in history,
    // every time a move is made
    setCurrentMove(nextHistory.length - 1);

  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => { 
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    }
    else {
      description = 'Go to start game';
    }
    return (
      // Key prop required for each child in an array or iterator
      <li key={move}>
        <button onClick={()=> jumpTo(move)}>
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>
          {/* Takes an array of JSX element and renders it as a collection of item */}
          {moves}
        </ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Check if values from each elements a row, for every row, matches
  for (let row = 0; row < squares.length; row++){
    let isElementMatchInRow = true;
    let matchingRow = false;
    for (let col = 0; col < squares.length - 1; col++) {
    
    }
  }

  // Check if values from each elements a column, for every column, matches


  // Checks if values top-right to bottom-left diagonal elements matches, i.e. [0,0], [1,1], [2,2]
  let diagonalCheck = true;
  for (let rowCol = 1; rowCol < squares.length; rowCol++){
    if (!diagonalCheck || !(squares[rowCol - 1][rowCol - 1] === squares[rowCol][rowCol])) {
      diagonalCheck = false;
    }
    if (diagonalCheck && rowCol === squares.length - 1) {
      return squares[rowCol][rowCol];
    }
  }


  // Checks if values bottom-right to top-left diagonal elements matches, i.e. [0,2], [1,1], [2,0]
  // NEED TO RUN A FEW MORE CHECKS
  diagonalCheck = true;
  for (let row = 1, col = squares.length - 2; row < squares.length; row++, col--){
    console.log("count", row-1, col+1, " compare with", row, col);
    if (!diagonalCheck || !(squares[row - 1][col + 1] === squares[row][col])) {
      diagonalCheck = false;
    }
    if (diagonalCheck && row === squares.length - 1) {
      return squares[row][col];
    }
  }


  // COMMENT OUT FOR NOW TO PREVENT CODING ERROR
  // for (let i = 0; i < lines.length; i++){
  //   const [a, b, c] = lines[i];
  //   if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
  //     return squares[a];
  //   }
  // }
  return null;
}