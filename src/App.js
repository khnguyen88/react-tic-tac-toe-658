/*
Khiem Nguyen - CIS 658
Date - 2023/04/04

File's Purpose - Creates the Game, Board, and Square components, and holds the logic for checking the winners along the grid, history of board states, and more.

The Square components determine what should display on the button given a value. The Board component provide the templates for the 2D grid of Square components 
and pass values into their props, holds the handleClick method and calls on the calculateWinner methods to check if there is a winner, and more.

The Game component provides template for boarder game layout which includes the list items of player moves, a set of buttons and inputs to set
the board size, and board itself. It holds some important variables and methods such as handlePlay, updateBoardSize methods, and pass values into props of the board component.
It is exported out and rendered by React.

Written in JS/JSX. For more information on the extended portions of code, read the comments below. 
*/

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
      <div className="status">{status}</div>
      {/* Creates a dynamic board template based on size */}
      {/* Generates 2D grid of squares components by calling the nested map methods within the 2d square arrays passed into the Board component prop.*/}
      {/* Nested maps essentially returns an nested array of JSX elements that Babel can render, but it requires unique keys */}
      {/* Source for figuring out how to generate loops in: JSX https://stackoverflow.com/questions/22876978/loop-inside-react-jsx */}
      {/* Source to understand JS Array's map method: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map */}
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

  // This function resets the currentMove state variable to 0, set the RowColSize
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
        <div className="dashboard">
          <div>
            Select your board size:
          </div>
          <div>
            <button onClick={() => updateBoardSize(3)}>3x3</button>
            <button onClick={() => updateBoardSize(4)}>4x4</button>
            <button onClick={() => updateBoardSize(5)}>5x5</button>
          </div>
          <br/>
          <div>
            {/* Resource references: */}
            {/* https://medium.com/swlh/building-controlled-forms-using-functional-components-in-react-965d033a89bd */}
            {/* https://stackoverflow.com/questions/18062069/why-does-valueasnumber-return-nan-as-a-value */}
            {/* https://aguidehub.com/blog/how-to-allow-only-numbers-in-input-field-react/ */}
            <form>
              <label class="label-text" for="rowColSize">Set Row & Col Size:</label><br/>
              {/* Dynamic number input that binds it's values to rowColSize and checks to see if values entered in is numeric, if so call the updateBoardSize function and pass in the target value as a number, pass in current rowColSize value */}
              <input name='rowColSize' pattern="[0-9]*" type='number' value={rowColSize} min="1" onChange={e => { updateBoardSize(e.target.validity.valid ? e.target.valueAsNumber : rowColSize);  }} required/>
            </form>
          </div>
          <br />
        </div>
        
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

  // Edge case handling - Player set board size equal to 1, lol.
  if (squares.length === 1 && squares[0].length === 1) {
    return squares[0][0];
  }

  return null;
}