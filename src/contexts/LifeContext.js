import React, {useState} from 'react';

const GRID = {
  emptyGrid: [], columns: 0, rows: 0, gridWidth: 0
}

export const LifeContext = React.createContext({
  currentGrid: [], setCurrentGrid: () => {},
  grid: {}, setGrid: () => {},
  relativeNumbersIndex: null, setRelativeNumbersIndex: () => {},
  relativeNumbers: [], setRelativeNumbers: () => {},
  showSettings: false, setShowSettings: () => {},
})

export const LifeProvider = (props) => {
  const [currentGrid, setCurrentGrid] = useState(false);
  const [grid, setGrid] = useState(GRID);
  const [relativeNumbersIndex, setRelativeNumbersIndex] = useState(false);
  const [relativeNumbers, setRelativeNumbers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <LifeContext.Provider value={{
      currentGrid, setCurrentGrid,
      grid, setGrid,
      relativeNumbersIndex, setRelativeNumbersIndex,
      relativeNumbers, setRelativeNumbers,
      showSettings, setShowSettings,
    }}>
      {props.children}
    </LifeContext.Provider>
  );
}
