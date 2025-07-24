import React, {useState} from 'react';

const SequineContext = React.createContext();

const SequineProvider = (props) => {
  const [selected, setSelected] = useState(props.initialSelected);
  
  // Update selected when initialSelected changes
  React.useEffect(() => {
    if (props.initialSelected !== undefined) {
      setSelected(props.initialSelected);
    }
  }, [props.initialSelected]);
  
  return (
    <SequineContext.Provider value={[selected, setSelected]}>
      {props.children}
    </SequineContext.Provider>
  );
}

export { SequineContext, SequineProvider };
