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
  const [currentGrid, setCurrentGrid] = useState(false);
  const [grid, setGrid] = useState(GRID);
  const [highlightedIndex, setHighlightedIndex] = useState(false);
  const [relativeNumbersIndex, setRelativeNumbersIndex] = useState(false);
  const [relativeNumbers, setRelativeNumbersArray] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [oneClick, setOneClick] = useState(false);

  const setRelativeNumbers = (index, array) => {
    setRelativeNumbersIndex(index);
    setRelativeNumbersArray(array);
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
