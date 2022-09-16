import React, {useState} from 'react';

export const LifeContext = React.createContext({
  currentGrid: [], setCurrentGrid: () => {},
  relativeNumbersIndex: null, setRelativeNumbersIndex: () => {},
  relativeNumbers: [], setRelativeNumbers: () => {},
  showSettings: false, setShowSettings: () => {},
})

export const LifeProvider = (props) => {
  const [currentGrid, setCurrentGrid] = useState(false);
  const [relativeNumbersIndex, setRelativeNumbersIndex] = useState(false);
  const [relativeNumbers, setRelativeNumbers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  return (
    <LifeContext.Provider value={{
      currentGrid, setCurrentGrid,
      relativeNumbersIndex, setRelativeNumbersIndex,
      relativeNumbers, setRelativeNumbers,
      showSettings, setShowSettings,
    }}>
      {props.children}
    </LifeContext.Provider>
  );
}
