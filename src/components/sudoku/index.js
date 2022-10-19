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
    blankBoard[i] = {...cellShape, row, col, pencil: [], centerPencil: []};
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
  const [selectedCell, setSelectedCell] = useState([]);

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

  function addPencil(num, center) {
    const pencil = center === true ? 'centerPencil' : 'pencil';
    const newBoard = [...board];
    for (const cell of selectedCell) {
      if (
        newBoard[cell][pencil].indexOf(num) < 0 &&
        newBoard[cell].isGiven !== true
      ) {
        newBoard[cell][pencil].push(num);
        newBoard[cell][pencil].sort(function(a, b) {
          return a - b;
        });
      }
    }
    setBoard(newBoard);
  }
  
  function deletePencil(num, center) {
    const pencil = center === true ? 'centerPencil' : 'pencil';
    const newBoard = [...board];
    for (const cell of selectedCell) {
      newBoard[cell][pencil] = newBoard[cell][pencil]
        .filter(item => item !== num);
    }
    setBoard(newBoard);
  }

  function setSelectedCellNumber(num) {
    if (board[selectedCell[0]].isGiven) {
      return;
    }
    const newBoard = [...board];
    newBoard[selectedCell[0]].number = num;
    if (autoValidate === true) {
      validateBoard();
    } else {
      clearValidation();
    }
    setBoard(newBoard);
  }

  function handleSetSelectedCell(num, e) {
    if (selectedCell[0] === num) {
      return setSelectedCell([]);
    }
    if (e.shiftKey) {
      e.preventDefault();
      const newSelectedCell = [...selectedCell];
      newSelectedCell.push(num);
      return setSelectedCell(newSelectedCell);
    }
    setSelectedCell([num]);
  }

  function handleCellClick(num) {
    if (selectedCell.length < 1) {
      return;
    }
    const number = num !== board[selectedCell[0]].number ? num : null;
    setSelectedCellNumber(number)
  }
  
  function handlePencilClick(num, center = false) {
    if (selectedCell.length < 1) {
      return;
    }
    const pencil = center === true ? 'centerPencil' : 'pencil';
    board[selectedCell[0]][pencil].indexOf(num) > -1
      ? deletePencil(num, center)
      : addPencil(num, center);
  }

  return (
    <div>
      <div className="flex">
        <div className="board">
          <div className="line horizontal a" />
          <div className="line horizontal b" />
          <div className="line vertical a" />
          <div className="line vertical b" />
          {
            board.map((cell, index) => {
              const guessed = cell.number != null;
              const selected = selectedCell.indexOf(index) === 0;
              const alsoSelected = selectedCell.indexOf(index) > -1 &&
                selectedCell.indexOf(index) !== 0;
              const invalid = validation[index] === false;
              const given = cell.isGiven;
              const classes = classNames(
                'cell',
                {
                  guessed,
                  selected,
                  alsoSelected,
                  invalid,
                  given,
                }
              );
              return (
                <div
                  className={classes}
                  key={index}
                  onClick={(e) => handleSetSelectedCell(index, e)}
                >
                  <div className="pencilGrid">
                    {
                      cell.pencil.map(pencilNumber => {
                        return <div className="pencil" key={pencilNumber}>{pencilNumber}</div>
                      })
                    }
                  </div>
                  <div className="centerPencilGrid">
                    {
                      cell.centerPencil.map(pencilNumber => {
                        return <div className="pencil" key={pencilNumber}>{pencilNumber}</div>
                      })
                    }
                  </div>
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
          <div className="title">Pencil</div>
          <div className="pencilBoard">
            {
              numbers.map(number => {
                const selected = selectedCell[0] != null && board[selectedCell[0]].pencil.indexOf(number) > -1;
                const classes = classNames(
                  'numberCell',
                  {
                    selected,
                  },
                )
                return (
                  <div
                    className={classes}
                    key={number}
                    onClick={() => {handlePencilClick(number)}}
                  >
                    <div className="number">{number}</div>
                  </div>
                )
              })
            }
          </div>
          <div className="title">Pencil 2</div>
          <div className="pencilBoard">
            {
              numbers.map(number => {
                const selected = selectedCell[0] != null && board[selectedCell[0]].centerPencil.indexOf(number) > -1;
                const classes = classNames(
                  'numberCell',
                  {
                    selected,
                  },
                )
                return (
                  <div
                    className={classes}
                    key={number}
                    onClick={() => {handlePencilClick(number, true)}}
                  >
                    <div className="number">{number}</div>
                  </div>
                )
              })
            }
          </div>
          <div className="title">Number</div>
          <div className="numberBoard">
            {
              numbers.map(number => {
                const selected = selectedCell[0] != null && number === board[selectedCell[0]].number;
                const classes = classNames(
                  'numberCell',
                  {
                    selected,
                  },
                )
                return (
                  <div
                    className={classes}
                    key={number}
                    onClick={() => {handleCellClick(number)}}
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