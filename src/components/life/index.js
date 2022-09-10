import React, { useEffect, useRef, useState } from 'react';

import Grid from './../../components/life/grid';
import Throbber from '../throbber';

function Life() {
  const [showLife, setShowLife] = useState(false);
  const timeout = useRef();

  useEffect(() => {
    timeout.current = setTimeout(toggleLife, 1000);
    return () => {
      clearTimeout(timeout.current);
    }
  }, []);

  const toggleLife = () => {
    setShowLife(!showLife);
  }
  return showLife ?
    (<Grid />) :
    (<Throbber />);
}

export default Life;
