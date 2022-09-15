import React, { useCallback, useEffect, useRef, useState } from 'react';
import useInterval from '../../../hooks/useInterval';

import '../style.css';

import generatePulsar from './../../../components/life/generators/pulsar.js';
import generateGlider from './../../../components/life/generators/glider.js';
import generateGlidergun from './../../../components/life/generators/glidergun.js';

import Block from './../../../components/life/block';

const BUTTON_ROW_HEIGHT = 100;
const LARGE_GRID_WIDTH = 30;
const SMALL_GRID_WIDTH = 18;

function Grid() {
  const [state, setState] = useState({
    width: 0,
    height: 0,
    currentGrid: [],
    emptyGrid: [],
    nextGrid: [],
    running: false,
    gridWidthDraft: '',
    gridWidth: LARGE_GRID_WIDTH,
    showNumbers: false,
    highlightedIndex: undefined,
    relativeNumbersIndex: undefined,
    relativeNumbers: [],
    showSettings: false,
  });
  const elementRef = useRef();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', getSize);
    return () => {
      window.removeEventListener('resize', getSize);
    }
  });

  useInterval(() => {
    mutate()
  }, playing ? 100 : null);

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
    const currentGrid = [...state.currentGrid];
    // console.log('resize', numberOfBlocks, emptyGrid.length, currentGrid.length)
    // TODO resize doesn't work reliably
    setState({ ...state, currentGrid, emptyGrid, columns, rows, gridWidth: newGridWidth });
  }

  const generateRandomGrid = () => {
    const currentGrid = [];
    state.emptyGrid.map((block, index) => {
      return currentGrid[index] = Math.random() < 0.5;
    });
    setState({ ...state, currentGrid });
  }

  const checkBlock = (index) => {
    const { columns, currentGrid } = state;
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
    const newGrid = [...state.emptyGrid] || [];
    newGrid.forEach((_block, index) => {
      newGrid[index] = checkBlock(index);
    })
    setState({ ...state, currentGrid: newGrid });
  }

  const glider = () => {
    const startingIndex = (2 * state.columns) + 2;
    const grid = generateGlider(startingIndex, state.columns);
    setState({ ...state, currentGrid: grid });
  }

  const addGlider = (index) => {
    return () => {
      const currentGrid = generateGlider(index, state.columns, state.currentGrid)
      setState({ ...state, currentGrid });
    }
  }

  const glidergun = () => {
    const isEven = state.rows % 2 === 0
    const half = state.emptyGrid.length / 2;
    const middleIndex = Math.floor(isEven ? half + (state.columns / 2) : half);
    const grid = generateGlidergun(middleIndex, state.columns)
    setState({ ...state, currentGrid: grid });
  }

  const addGlidergun = (index) => {
    return () => {
      const currentGrid = generateGlidergun(index, state.columns, state.currentGrid)
      setState({ ...state, currentGrid });
    }
  }

  const pulsar = () => {
    const isEven = state.rows % 2 === 0
    const half = state.emptyGrid.length / 2;
    const middleIndex = Math.floor(isEven ? half + (state.columns / 2) : half);
    const grid = generatePulsar(middleIndex, state.columns)
    setState({ ...state, currentGrid: grid });
  }

  const addPulsar = (index) => {
    return () => {
      const currentGrid = generatePulsar(index, state.columns, state.currentGrid)
      setState({ ...state, currentGrid });
    }
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
    return () => {
      const highlightedIndex = state.highlightedIndex === index ? undefined : index;
      setState({ ...state, highlightedIndex })
    }
  }

  const toggleIndex = (index) => {
    return () => {
      const currentGrid = state.currentGrid;
      currentGrid[index] = !currentGrid[index];
      setState({ ...state, currentGrid });
    }
  }

  const toggleRelativeNumbers = (index) => {
    return () => {
      const { columns, emptyGrid } = state;
      const relativeNumbersIndex = state.relativeNumbersIndex === index ? undefined : index;
      const indexColPos = relativeNumbersIndex % columns;
      const rowFirst = relativeNumbersIndex - indexColPos;
      const rowLast = rowFirst + columns - 1;
      const relativeNumbers = relativeNumbersIndex ?
        emptyGrid.map((block, index) => {
          const colPos = index % columns;
          const offset = colPos - indexColPos;
          let cols = 0;
          if (index < rowFirst) {
            cols = Math.ceil((rowFirst - index) / columns);
          }
          if (index > rowLast) {
            cols = Math.ceil((index - rowLast) / columns)
          }
          return `${cols}c ${offset}`;
        })
        : [];
      setState({ ...state, relativeNumbersIndex, relativeNumbers });
    }
  }

  const clear = () => {
    const currentGrid = [];
    state.emptyGrid.map((block, index) => {
      return currentGrid[index] = false;
    });
    setState({ ...state, currentGrid });
  }

  const toggleSettings = () => {
    setState({ ...state, showSettings: !state.showSettings });
  }

  const { emptyGrid, highlightedIndex, gridWidth } = state;

  const renderGrid = emptyGrid.map((_block, index) => {
    return (
      <Block
        currentGrid={state.currentGrid}
        gridWidth={gridWidth}
        index={index}
        highlightedIndex={highlightedIndex}
        key={index}
        highlightIndex={highlightIndex}
        toggleIndex={toggleIndex}
        relativeNumbersIndex={state.relativeNumbersIndex}
        toggleRelativeNumbers={toggleRelativeNumbers}
        addPulsar={addPulsar}
        addGlider={addGlider}
        addGlidergun={addGlidergun}
        // {...state}
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
        </div>
        <div>
          <button onClick={generateRandomGrid}>Random</button>
          <button onClick={glider}>Glider</button>
          <button onClick={glidergun}>Glider Gun</button>
          <button onClick={pulsar}>Pulsar</button>
          &nbsp;&nbsp;
          <button onClick={clear}>Clear</button>
          &nbsp;&nbsp;
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button onClick={toggleSettings}>Settings</button>
            {state.showSettings && <div className="settings">
              <label><input type="checkbox" onClick={toggleNumbers}/> Show numbers</label>
              &nbsp;&nbsp;
              <form>
                <input type="number" style={{ width: '75px' }} onChange={updateWidth} />
                <button onClick={changeWidth}>Size</button>
              </form>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Grid;
