import React from 'react';

import '../style.css';

import generatePulsar from './../../../components/life/generators/pulsar.js';
import generateGlider from './../../../components/life/generators/glider.js';
import generateGlidergun from './../../../components/life/generators/glidergun.js';

import Block from './../../../components/life/block';

const BUTTON_ROW_HEIGHT = 100;

class Grid extends React.Component {
  state = {
    width: 0,
    height: 0,
    currentGrid: [],
    nextGrid: [],
    running: false,
    gridWidthDraft: '',
    gridWidth: 30,
    showNumbers: false,
    highlightedIndex: undefined,
    relativeNumbersIndex: undefined,
    relativeNumbers: [],
    showSettings: false,
  }

  componentDidMount () {
    // this.getSize();
    window.addEventListener('resize', this.getSize);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.getSize);
  }

  refCallback = element => {
    if (element) {
      this.elementRef = element;
      this.getSize();
    }
  };

  getSize = () => {
    const size = this.elementRef.getBoundingClientRect();
    const width = size.width;
    const height = size.height;
    const columns = Math.floor(width / this.state.gridWidth);
    const rows = Math.floor((height - BUTTON_ROW_HEIGHT) / this.state.gridWidth);
    const numberOfBlocks = columns * rows;
    const emptyGrid = (new Array(numberOfBlocks)).fill();
    const currentGrid = [...this.state.currentGrid];
    this.setState({ currentGrid, emptyGrid, columns, rows });
  }

  updateNextGrid = (index) => {
    const nextGrid = this.state.nextGrid;
    nextGrid[index] = this.checkBlock(index);
    if (index === nextGrid.length - 1) {
      return this.setState({ currentGrid: nextGrid, nextGrid: [] });
    }
    return this.setState({ nextGrid });
  }

  generateRandomGrid = () => {
    const currentGrid = [];
    this.state.emptyGrid.map((block, index) => {
      return currentGrid[index] = Math.random() < 0.5;
    });
    this.setState({ currentGrid });
  }

  checkBlock = (index) => {
    const { columns, currentGrid } = this.state;
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

  mutate = () => {
    const emptyGrid = this.state.emptyGrid;
    emptyGrid.forEach((block, index) => {
      return this.updateNextGrid(index);
    })
  }

  glider = () => {
    const startingIndex = (2 * this.state.columns) + 2;
    const grid = generateGlider(startingIndex, this.state.columns);
    this.setState({ currentGrid: grid });
  }

  addGlider = (index) => {
    return () => {
      const currentGrid = generateGlider(index, this.state.columns, this.state.currentGrid)
      this.setState({ currentGrid });
    }
  }

  glidergun = () => {
    const isEven = this.state.rows % 2 === 0
    const half = this.state.emptyGrid.length / 2;
    const middleIndex = Math.floor(isEven ? half + (this.state.columns / 2) : half);
    const grid = generateGlidergun(middleIndex, this.state.columns)
    this.setState({ currentGrid: grid });
  }

  addGlidergun = (index) => {
    return () => {
      const currentGrid = generateGlidergun(index, this.state.columns, this.state.currentGrid)
      this.setState({ currentGrid });
    }
  }

  pulsar = () => {
    const isEven = this.state.rows % 2 === 0
    const half = this.state.emptyGrid.length / 2;
    const middleIndex = Math.floor(isEven ? half + (this.state.columns / 2) : half);
    const grid = generatePulsar(middleIndex, this.state.columns)
    this.setState({ currentGrid: grid });
  }

  addPulsar = (index) => {
    return () => {
      const currentGrid = generatePulsar(index, this.state.columns, this.state.currentGrid)
      this.setState({ currentGrid });
    }
  }

  updateWidth = (event) => {
    this.setState({ gridWidthDraft: event.target.value });
  }

  changeWidth = (event) => {
    event.preventDefault();
    this.setState({ gridWidth: parseInt(this.state.gridWidthDraft, 10) }, this.getSize);
  }

  toggleNumbers = () => {
    const showNumbers = !this.state.showNumbers;
    this.setState({ showNumbers });
  }

  highlightIndex = (index) => {
    return () => {
      const highlightedIndex = this.state.highlightedIndex === index ? undefined : index;
      this.setState({ highlightedIndex })
    }
  }

  toggleIndex = (index) => {
    return () => {
      const currentGrid = this.state.currentGrid;
      currentGrid[index] = !currentGrid[index];
      this.setState({ currentGrid });
    }
  }

  toggleRelativeNumbers = (index) => {
    return () => {
      const { columns, emptyGrid } = this.state;
      const relativeNumbersIndex = this.state.relativeNumbersIndex === index ? undefined : index;
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
      this.setState({ relativeNumbersIndex, relativeNumbers });
    }
  }

  clear = () => {
    this.setState({ currentGrid: this.state.emptyGrid });
  }

  toggleSettings = () => {
    this.setState({ showSettings: !this.state.showSettings });
  }

  render () {
    const { emptyGrid, highlightedIndex, gridWidth } = this.state;
    const gridArray = emptyGrid || [];
    const renderGrid = gridArray.map((block, index) => {
      return (
        <Block
          gridWidth={gridWidth}
          index={index}
          highlightedIndex={highlightedIndex}
          key={index}
          highlightIndex={this.highlightIndex}
          toggleIndex={this.toggleIndex}
          relativeNumbersIndex={this.relativeNumbersIndex}
          toggleRelativeNumbers={this.toggleRelativeNumbers}
          addPulsar={this.addPulsar}
          addGlider={this.addGlider}
          addGlidergun={this.addGlidergun}
          {...this.state}
        />
      )
    })
    return (
      <div style={{ height: '100%', width: '100%' }} ref={this.refCallback}>
        <div className="flexWrap">
          {renderGrid}
        </div>
        <div className="controls">
          <div style={{ marginBottom: '5px' }}>
            <button onClick={this.mutate} className="mutate">Mutate</button>
          </div>
          <div>
            <button onClick={this.generateRandomGrid}>Random</button>
            <button onClick={this.glider}>Glider</button>
            <button onClick={this.glidergun}>Glider Gun</button>
            <button onClick={this.pulsar}>Pulsar</button>
            &nbsp;&nbsp;
            <button onClick={this.clear}>Clear</button>
            &nbsp;&nbsp;
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button onClick={this.toggleSettings}>Settings</button>
              {this.state.showSettings && <div className="settings">
                <label><input type="checkbox" onClick={this.toggleNumbers}/> Show numbers</label>
                &nbsp;&nbsp;
                <form>
                  <input type="number" style={{ width: '75px' }} onChange={this.updateWidth} />
                  <button onClick={this.changeWidth}>Size</button>
                </form>
              </div>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Grid;
