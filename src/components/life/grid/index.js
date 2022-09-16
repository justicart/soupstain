import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useInterval from '../../../hooks/useInterval';
import { LifeContext } from '../../../contexts/LifeContext';

import Formula from '../components/formula';

import '../style.css';

import Block from './../../../components/life/block';

import shapes from './../generators/shapes.json';
import generator from '../generators/generator';

const BUTTON_ROW_HEIGHT = 100;
const LARGE_GRID_WIDTH = 30;
const SMALL_GRID_WIDTH = 18;

function Grid() {
  const {
    currentGrid,
    setCurrentGrid,
    relativeNumbersIndex,
    setRelativeNumbersIndex,
    // relativeNumbers,
    setRelativeNumbers,
    showSettings, 
    setShowSettings, 
  } = useContext(LifeContext);
  const [state, setState] = useState({
    width: 0,
    height: 0,
    emptyGrid: [],
    nextGrid: [],
    running: false,
    gridWidthDraft: '',
    gridWidth: LARGE_GRID_WIDTH,
    showNumbers: false,
    highlightedIndex: undefined,
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
    let newGridWidth = state.gridWidth;
    if (width < 400) {
      newGridWidth = SMALL_GRID_WIDTH;
    } else {
      newGridWidth = LARGE_GRID_WIDTH;
    }
    const height = size.height;
    const columns = Math.floor(width / newGridWidth);
    const rows = Math.floor((height - BUTTON_ROW_HEIGHT) / newGridWidth);
    const numberOfBlocks = columns * rows;
    const emptyGrid = (new Array(numberOfBlocks)).fill(false);
    // const currentGrid = [...state.currentGrid];
    // console.log('resize', numberOfBlocks, emptyGrid.length, currentGrid.length)
    // TODO resize doesn't work reliably
    setState({ ...state, emptyGrid, columns, rows, gridWidth: newGridWidth });
  }

  const generateRandomGrid = () => {
    const workingGrid = [];
    state.emptyGrid.map((block, index) => {
      return workingGrid[index] = Math.random() < 0.5;
    });
    setCurrentGrid(workingGrid);
  }

  const checkBlock = (index) => {
    const { columns } = state;
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
    const workingGrid = [...state.emptyGrid] || [];
    workingGrid.forEach((_block, index) => {
      workingGrid[index] = checkBlock(index);
    })
    setCurrentGrid(workingGrid);
  }

  const glider = () => {
    const startingIndex = (3 * state.columns) + 3;
    const workingGrid = generator(startingIndex, state.columns, shapes.glider);
    setCurrentGrid(workingGrid);
  }

  const addGlider = (index) => {
    const workingGrid = generator(index, state.columns, shapes.glider, state.currentGrid)
    setCurrentGrid(workingGrid);
  }

  const centerShape = (shape) => {
    const isEven = state.rows % 2 === 0
    const half = state.emptyGrid.length / 2;
    const middleIndex = Math.floor(isEven ? half + (state.columns / 2) : half);
    const workingGrid = generator(middleIndex, state.columns, shapes[shape])
    setCurrentGrid(workingGrid);
  }

  const addCenterShape = (shape, index) => {
    const workingGrid = generator(index, state.columns, shapes[shape], state.currentGrid)
    setCurrentGrid(workingGrid);
  }

  const updateWidth = (event) => {
    setState({ ...state, gridWidthDraft: event.target.value });
  }

  const changeWidth = (event) => {
    event.preventDefault();
    setState({ ...state, gridWidth: parseInt(state.gridWidthDraft, 10) }, getSize);
  }

  const toggleNumbers = () => {
    const showNumbers = !state.showNumbers;
    setState({ ...state, showNumbers });
  }

  const highlightIndex = (index) => {
    const highlightedIndex = state.highlightedIndex === index ? undefined : index;
    setState({ ...state, highlightedIndex })
  }

  const toggleIndex = (index) => {
    const workingGrid = [...currentGrid];
    workingGrid[index] = !workingGrid[index];
    setCurrentGrid(workingGrid);
  }

  const toggleRelativeNumbers = (index) => {
    if (relativeNumbersIndex === index) {
      setRelativeNumbersIndex(null);
      setRelativeNumbers([]);
      return null;
    }
    const { columns, emptyGrid } = state;
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
    setRelativeNumbersIndex(newRelativeNumbersIndex);
    setRelativeNumbers(newRelativeNumbers);
  }

  const clear = () => {
    const workingGrid = [...state.emptyGrid];
    setCurrentGrid(workingGrid);
  }

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  }

  const { emptyGrid, highlightedIndex, gridWidth } = state;

  const renderGrid = emptyGrid.map((_block, index) => {
    return (
      <Block
        gridWidth={gridWidth}
        index={index}
        highlightedIndex={highlightedIndex}
        key={index}
        highlightIndex={highlightIndex}
        toggleIndex={toggleIndex}
        toggleRelativeNumbers={toggleRelativeNumbers}
        addCenterShape={addCenterShape}
        addGlider={addGlider}
        showNumbers={state.showNumbers}
      />
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
          <input
            type="number"
            value={playingSpeed}
            onChange={(e) => setPlayingSpeed(e.target.value)}
            style={{width: 50}}
          />
        </div>
        <div>
          <button onClick={generateRandomGrid}>Random</button>
          <button onClick={glider}>Glider</button>
          <button onClick={() => centerShape('glidergun')}>Glider Gun</button>
          <button onClick={() => centerShape('pulsar')}>Pulsar</button>
          <button onClick={() => centerShape('pentadeca')}>Penta-Deca</button>
          &nbsp;&nbsp;
          <button onClick={clear}>Clear</button>
          &nbsp;&nbsp;
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button onClick={toggleSettings}>Settings</button>
            {showSettings && <div className="settings">
              <label><input type="checkbox" onClick={toggleNumbers}/> Show numbers</label>
              &nbsp;&nbsp;
              <form>
                <input type="number" style={{ width: '75px' }} onChange={updateWidth} />
                <button onClick={changeWidth}>Size</button>
              </form>
            </div>}
          </div>
        </div>
        <Formula />
      </div>
    </div>
  );
}

export default Grid;
