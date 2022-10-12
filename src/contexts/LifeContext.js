import React, {useState} from 'react';

const GRID = {
  emptyGrid: [], columns: 0, rows: 0, gridWidth: 0
}

export const LifeContext = React.createContext({
  currentGrid: [], setCurrentGrid: () => {},
  grid: {}, setGrid: () => {},
  highlightedIndex: null, setHighlightedIndex: () => {},
  relativeNumbersIndex: null, setRelativeNumbersIndex: () => {},
  relativeNumbers: [], setRelativeNumbersArray: () => {},
  showSettings: false, setShowSettings: () => {},
  oneClick: false, setOneClick: () => {},
})

export const LifeProvider = (props) => {
  const [currentGrid, setCurrentGrid] = useState([]);
  const [grid, setGridData] = useState(GRID);
  const [highlightedIndex, setHighlightedIndex] = useState();
  const [relativeNumbersIndex, setRelativeNumbersIndex] = useState();
  const [relativeNumbers, setRelativeNumbersArray] = useState();
  const [showSettings, setShowSettings] = useState(false);
  const [oneClick, setOneClick] = useState(false);

  const setRelativeNumbers = (index, array) => {
    setRelativeNumbersIndex(index);
    setRelativeNumbersArray(array);
  }

  function setGrid(newGridData) {
    setGridData(newGridData);
    if (currentGrid.length < 1) {
      setCurrentGrid(newGridData.emptyGrid);
    }
  }
  
  return (
    <LifeContext.Provider value={{
      currentGrid, setCurrentGrid,
      grid, setGrid,
      highlightedIndex, setHighlightedIndex,
      relativeNumbersIndex, setRelativeNumbersIndex,
      relativeNumbers, setRelativeNumbers,
      showSettings, setShowSettings,
      oneClick, setOneClick,
    }}>
      {props.children}
    </LifeContext.Provider>
  );
}
