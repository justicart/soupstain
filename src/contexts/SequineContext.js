import React, {useState} from 'react';

const SequineContext = React.createContext();

const SequineProvider = (props) => {
  const [selected, setSelected] = useState();
  return (
    <SequineContext.Provider value={[selected, setSelected]}>
      {props.children}
    </SequineContext.Provider>
  );
}

export { SequineContext, SequineProvider };
