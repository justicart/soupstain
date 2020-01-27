import React, {useState} from 'react';

const AppContext = React.createContext();

const AppProvider = (props) => {
  const [selected, setSelected] = useState();
  return (
    <AppContext.Provider value={[selected, setSelected]}>
      {props.children}
    </AppContext.Provider>
  );
}

export { AppContext, AppProvider };
