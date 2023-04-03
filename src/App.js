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
    </>
  );
}

export default function Game() {
  const [rowColSize, setRowColSize] = useState(3); // // Set the state of the initial row and column size, update as desired
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

  function updateBoardSize(sizeOfRowCol) {
    setCurrentMove(0);
    setRowColSize(sizeOfRowCol);
    setHistory([Array(sizeOfRowCol).fill(Array(sizeOfRowCol).fill(null))]);
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
        <div>
          Select your board size:
        </div>
        <div>
          <button onClick={() => updateBoardSize(3)}>3x3</button>
          <button onClick={() => updateBoardSize(4)}>4x4</button>
          <button onClick={()=> updateBoardSize(5)}>5x5</button>
        </div>
        <br/>
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

  // Check if values from each elements a row, for every row, matches
  // ------------------------------------------------------------------------
  // We go through each rows
  for (let row = 0; row < squares.length; row++){

    // We set a flag, we assume that each element in a row matches, until we find one that does not
    let rowCheck = true;

    // We set a counter to track the number of valid matches in our comparsion
    let numOfRowMatches = 0;
    // We go through each elements in a particular row
    for (let col = 1; col < squares.length; col++){

      // We check if the elements we are comparing are valid or not null
      if (squares[row][col - 1] && squares[row][col]) {

        // If so, we compare the current element and adjacent element in each row
        // If the two elements do not match, we change the flag to false indiciating the items along this row do not match
        if (!(squares[row][col - 1] === squares[row][col])) {
          rowCheck = false;
        }

        // Else increase our counter
        else {
          numOfRowMatches++;
        }

        // If our flag is still valid after we performed set amount of comparsions, then we found a winner and return player who won
        // The # of comparsions are # elements along a row minus one
        if (rowCheck && numOfRowMatches === squares.length - 1) {
          return squares[row][col];
        }
      }

    }
  }


  // Check if values from each elements a column, for every column, matches
  // ------------------------------------------------------------------------
    // We go through each column
  for (let col = 0; col < squares.length; col++){

    // We set a flag, we assume that each element in a column matches, until we find one that does not
    let colCheck = true;

    // We set a counter to track the number of valid matches in our comparsion
    let numOfColMatches = 0;
    // We go through each elements in a particular column
    for (let row = 1; row < squares.length; row++){

      // We check if the elements we are comparing are valid or not null
      if (squares[row-1][col] && squares[row][col]) {

        // If so, we compare the current element and adjacent element in each column
        // If the two elements do not match, we change the flag to false indiciating the items along this column do not match
        if (!(squares[row-1][col] === squares[row][col])) {
          colCheck = false;
        }

        // Else increase our counter
        else {
          numOfColMatches++;
        }

        // If our flag is still valid after we performed set amount of comparsions, then we found a winner and return player who won
        // The # of comparsions are # elements along a column minus one
        if (colCheck && numOfColMatches === squares.length - 1) {
          return squares[row][col];
        }
      }

    }
  }


  // Checks if values top-right to bottom-left diagonal elements matches, i.e. [0,0], [1,1], [2,2]
  // ------------------------------------------------------------------------
  // We set a flag, we assume that each element in a diagonal line matches, until we find one that does not
  let diagonalCheck = true;

  // We set a counter to track the number of valid matches in our comparsion
  let numOfDiagonalMatches = 0;
  // We loop through the diagonal elements in the grid
  for (let rowCol = 1; rowCol < squares.length; rowCol++){
    
    // We check if the elements we are comparing are valid or not null
    if (squares[rowCol - 1][rowCol - 1] && squares[rowCol][rowCol]) {

      // If so, we compare the current element and adjacent element along the diagonal line
      // If the two elements do not match, we change the flag to false indiciating the items along this diagonal line do not match
      if (!(squares[rowCol - 1][rowCol - 1] === squares[rowCol][rowCol])) {
        diagonalCheck = false;
      }

      // Else increase our counter
      else {
        numOfDiagonalMatches++;
      }

      // If our flag is still valid after we performed set amount of comparsions, then we found a winner and return player who won
      // The # of comparsions are # elements along the diagonal line minus one
      if (diagonalCheck && numOfDiagonalMatches === squares.length - 1) {
        return squares[rowCol][rowCol];
      }
    }
  }


  // Checks if values bottom-right to top-left diagonal elements matches, i.e. [0,2], [1,1], [2,0]
  // ------------------------------------------------------------------------
  // We set a flag, we assume that each element in a diagonal line matches, until we find one that does not
  diagonalCheck = true;

  // We set a counter to track the number of valid matches in our comparsion
  numOfDiagonalMatches = 0;

  // We loop through the diagonal elements in the grid with two variables, one representing the row and column indices
  // We set the row index at the "starting point" and we set the column index at the "ending point" and iterate through opposite direction
  for (let row = 1, col = squares.length - 2; row < squares.length; row++, col--){
    // We check if the elements we are comparing are valid or not null
    if (squares[row - 1][col + 1] && squares[row][col]) {

      // If so, we compare the current element and adjacent element along the diagonal line
      // If the two elements do not match, we change the flag to false indiciating the items along this diagonal line do not match
      if (!(squares[row - 1][col + 1] === squares[row][col])) {
        diagonalCheck = false;
      }

      // Else increase our counter
      else {
        numOfDiagonalMatches++;
      }

      // If our flag is still valid after we performed set amount of comparsions, then we found a winner and return player who won
      // The # of comparsions are # elements along the diagonal line minus one
      if (diagonalCheck && numOfDiagonalMatches === squares.length - 1) {
        return squares[row][col];
      }
    }
  }

  return null;
}