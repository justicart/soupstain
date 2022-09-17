import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useInterval from '../../../hooks/useInterval';
import { LifeContext } from '../../../contexts/LifeContext';

import Formula from '../components/formula';

import '../style.css';

import Block from './../../../components/life/block';

import shapes from './../generators/shapes.json';
import generator from '../generators/generator';

const BUTTON_ROW_HEIGHT = 100;
const LARGE_GRID_WIDTH = 18;
const SMALL_GRID_WIDTH = 18;

function Grid() {
  const {
    currentGrid,
    setCurrentGrid,
    grid,
    setGrid,
    relativeNumbersIndex,
    setRelativeNumbers,
    showSettings, 
    setShowSettings,
    oneClick,
    setOneClick,
  } = useContext(LifeContext);
  const [state, setState] = useState({
    width: 0,
    height: 0,
    running: false,
    showNumbers: false,
  });
  const elementRef = useRef();
  const [playing, setPlaying] = useState(false);
  const [playingSpeed, setPlayingSpeed] = useState(100);

  useEffect(() => {
    window.addEventListener('resize', getSize);
    return () => {
      window.removeEventListener('resize', getSize);
    }
  });

  useInterval(() => {
    mutate()
  }, playing ? (playingSpeed > 100 ? playingSpeed : 100) : null);

  const refCallback = useCallback(element => {
    if (element) {
      elementRef.current = element;
      getSize();
    }
  }, []);

  const getSize = () => {
    const size = elementRef.current.getBoundingClientRect();
    const width = size.width;
    let newGridWidth;
    if (width < 400) {
      newGridWidth = SMALL_GRID_WIDTH;
    } else {
      newGridWidth = LARGE_GRID_WIDTH;
    }
    const height = size.height;
    const numColumns = Math.floor(width / newGridWidth);
    const numRows = Math.floor((height - BUTTON_ROW_HEIGHT) / newGridWidth);
    const numberOfBlocks = numColumns * numRows;
    const newEmptyGrid = (new Array(numberOfBlocks)).fill(false);
    // const currentGrid = [...state.currentGrid];
    // console.log('resize', numberOfBlocks, emptyGrid.length, currentGrid.length)
    // TODO resize doesn't work reliably
    const newGrid = {
      columns: numColumns, 
      rows: numRows, 
      gridWidth: newGridWidth, 
      emptyGrid: newEmptyGrid,
    }
    setGrid(newGrid);
  }

  const generateRandomGrid = () => {
    const workingGrid = grid.emptyGrid.map((block, index) => {
      return Math.random() < 0.5;
    });
    setCurrentGrid(workingGrid);
  }

  const checkBlock = (index) => {
    const { columns } = grid;
    const firstInRow = index % columns === 0;
    const lastInRow = index % columns === columns - 1;
    const firstInColumn = index < columns;
    const lastInColumn = index > currentGrid.length - columns - 1;
    let count = 0;
    const nw = index - columns - 1;
    if (currentGrid[nw] && currentGrid[nw] === true && !firstInRow && !firstInColumn) count ++;
    const n = index - columns;
    if (currentGrid[n] && currentGrid[n] === true && !firstInColumn) count ++;
    const ne = index - columns + 1;
    if (currentGrid[ne] && currentGrid[ne] === true && !lastInRow && !firstInColumn) count ++;
    const w = index - 1;
    if (currentGrid[w] && currentGrid[w] === true && !firstInRow) count ++;
    const e = index + 1;
    if (currentGrid[e] && currentGrid[e] === true && !lastInRow) count ++;
    const sw = index + columns - 1;
    if (currentGrid[sw] && currentGrid[sw] === true && !firstInRow && !lastInColumn) count ++;
    const s = index + columns;
    if (currentGrid[s] && currentGrid[s] === true && !lastInColumn) count ++;
    const se = index + columns + 1;
    if (currentGrid[se] && currentGrid[se] === true && !lastInRow && !lastInColumn) count ++;
    switch (count) {
      case 2:
        return currentGrid[index] === true ? true : false;
      case 3:
        return true;
      default:
        return false;
    }
  }

  const playMutate = () => {
    setPlaying(!playing);
  }

  const mutate = () => {
    const workingGrid = grid.emptyGrid.map((_block, index) => {
      return checkBlock(index);
    })
    setCurrentGrid(workingGrid);
  }

  const addShapeAtCenter = (shape) => {
    const isEven = grid.rows % 2 === 0;
    const half = grid.emptyGrid.length / 2;
    const middleIndex = Math.floor(isEven ? half + (grid.columns / 2) : half);
    const workingGrid = generator(middleIndex, grid.columns, shapes[shape], grid.emptyGrid)
    setCurrentGrid(workingGrid);
  }

  const toggleNumbers = () => {
    const showNumbers = !state.showNumbers;
    setState({ ...state, showNumbers });
  }

  const toggleRelativeNumbers = (index) => {
    if (relativeNumbersIndex === index) {
      setRelativeNumbers(null, []);
      return null;
    }
    const { columns, emptyGrid } = grid;
    const newRelativeNumbersIndex = index;
    const indexColPos = newRelativeNumbersIndex % columns;
    const rowFirst = newRelativeNumbersIndex - indexColPos;
    const rowLast = rowFirst + columns - 1;
    const newRelativeNumbers = emptyGrid.map((_block, i) => {
      const colPos = i % columns;
      const offset = colPos - indexColPos;
      let cols = 0;
      if (i < rowFirst) {
        cols = (Math.ceil((rowFirst - i) / columns)) * -1;
      }
      if (i > rowLast) {
        cols = Math.ceil((i - rowLast) / columns)
      }
      // return `${cols}c ${offset}`;
      return [cols, offset];
    });
    setRelativeNumbers(newRelativeNumbersIndex, newRelativeNumbers);
  }

  const clear = () => {
    const workingGrid = [...grid.emptyGrid];
    setCurrentGrid(workingGrid);
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  }

  const { emptyGrid } = grid;
  const { showNumbers } = state;

  const renderGrid = emptyGrid.map((_block, index) => {
    return (
      <Block
        index={index}
        key={index}
        toggleRelativeNumbers={toggleRelativeNumbers}
        showNumbers={showNumbers}
      />
    )
  })

  const presets = Object.keys(shapes).map((shape) => {
    return (
      <button onClick={() => addShapeAtCenter(shape)} key={shape}>{shape}</button>
    )
  })


  return (
    <div style={{ height: '100%', width: '100%' }} ref={refCallback}>
      <div className="flexWrap">
        {renderGrid}
      </div>
      <div className="controls">
        <div style={{ marginBottom: '5px' }}>
          <button onClick={mutate} className="mutate">Mutate</button>
          <button onClick={playMutate} className={`mutate ${playing ? 'playing' : ''}`}>
            {playing ? 'Playing' : 'Play'}
          </button>
          &nbsp;&nbsp;
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button onClick={toggleSettings}>Settings</button>
            {showSettings && <div className="settings">
              <div><label><input type="checkbox" checked={state.showNumbers} onClick={toggleNumbers}/> Show numbers</label></div>
              <div><label><input type="checkbox" checked={oneClick} onClick={() => setOneClick(!oneClick)}/> One Click</label></div>
              <div>
                <label>
                  <input
                    type="number"
                    value={playingSpeed}
                    onChange={(e) => setPlayingSpeed(e.target.value)}
                    style={{width: 50}}
                  />
                  Speed
                </label>
              </div>
            </div>}
          </div>
        </div>
        <div>
          <button onClick={generateRandomGrid}>Random</button>
          &nbsp;&nbsp;
          {presets}
          &nbsp;&nbsp;
          <button onClick={clear}>Clear</button>
        </div>
        <Formula />
      </div>
    </div>
  );
}

export default Grid;
