import React, { useState } from 'react';
import classNames from 'class-names';
import './style.css';

const testBoard = [6,1,9,5,null,null,null,null,null,5,8,null,7,1,null,null,null,null,4,3,null,6,2,null,null,null,null,null,null,null,null,7,null,8,5,2,null,5,1,4,8,null,null,null,null,null,7,null,2,null,5,4,null,null,7,9,6,1,null,4,null,2,8,1,4,5,8,3,2,9,7,6,3,2,8,9,6,7,1,4,5];
const arraySize = 81;
const numbers = [1,2,3,4,5,6,7,8,9];
function createBoard() {
  const cellShape = {
    number: null, isGiven: false, pencil: [], centerPencil: [], row: null, col: null
  }
  const blankBoard = new Array(arraySize);
  for (var i = 0; i < arraySize; i++) {
    const row = Math.floor(i / 9);
    const col = i % 9;
    blankBoard[i] = {...cellShape, row, col};
    // TEST DATA
    blankBoard[i].number = testBoard[i];
    blankBoard[i].isGiven = testBoard[i] != null;
  }
  return blankBoard;
}

export default function Sudoku() {
  const [board, setBoard] = useState(createBoard());
  const [validation, setValidation] = useState(new Array(arraySize).fill(true));
  const [autoValidate, setAutoValidate] = useState(false);
  const [selectedCell, setSelectedCell] = useState();

  function validateBoard() {
    const newValidation = [...validation];
    for (var i = 0; i < arraySize; i++) {
      const cell = board[i];
      let isCellValid = true;
      const row = [];
      const col = [];
      const box = [];
      const cellBox = [
        Math.floor(cell.row / 3),
        Math.floor(cell.col / 3)
      ]
      for (var j = 0; j < arraySize; j++) {
        const c = board[j];
        if (c.row === cell.row && i !== j) {
          row.push(c);
        }
        if (c.col === cell.col && i !== j) {
          col.push(c);
        }
        const cBox = [
          Math.floor(c.row / 3),
          Math.floor(c.col / 3)
        ]
        if (cBox[0] === cellBox[0] && cBox[1] === cellBox[1] && i !== j) {
          box.push(c);
        }
      }
      for (var k = 0; k < 8; k++) {
        if (
          cell.number != null &&
          (row[k].number === cell.number ||
          col[k].number === cell.number ||
          box[k].number === cell.number)
        ) {
          isCellValid = false;
        }
      }
      newValidation[i] = isCellValid;
    }
    setValidation(newValidation);
  }

  function clearValidation() {
    const newValidation = new Array(arraySize).fill(true);
    setValidation(newValidation)
  }

  function setSelectedCellNumber(num) {
    if (selectedCell == null || board[selectedCell].isGiven) {
      return;
    }
    const newBoard = [...board];
    newBoard[selectedCell].number = num;
    if (autoValidate === true) {
      validateBoard();
    } else {
      clearValidation();
    }
    setBoard(newBoard);
  }

  return (
    <div>
      <h1>Sudoku</h1>
      <div className="flex">
        <div className="board">
          <div className="line horizontal a" />
          <div className="line horizontal b" />
          <div className="line vertical a" />
          <div className="line vertical b" />
          {
            board.map((cell, index) => {
              const selected = selectedCell === index;
              const isValid = validation[index];
              const classes = classNames(
                'cell',
                {
                  selected,
                  invalid: isValid === false,
                  given: cell.isGiven,
                }
              );
              return (
                <div
                  className={classes}
                  key={index}
                  onClick={() => setSelectedCell(index)}
                >
                  <div className="number">{cell.number}</div>
                </div>
              )
            })
          }
        </div>
        <div className="controls">
          <div className="flex">
            <button onClick={validateBoard}>Validate</button>
            <label htmlFor="autoValidate">auto
              <input name="autoValidate" type="checkbox" checked={autoValidate} onChange={() => {setAutoValidate(!autoValidate)}} />
            </label>
          </div>
          <div className="numberBoard">
            {
              numbers.map(number => {
                return (
                  <div
                    className="numberCell"
                    key={number}
                    onClick={() => {setSelectedCellNumber(number)}}
                  >
                    <div className="number">{number}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}