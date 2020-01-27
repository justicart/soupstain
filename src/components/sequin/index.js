import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import './style.css';

function Sequin() {
  const [active, setActive] = useState(false);
  const [size, setSize] = useState({width: undefined, height: undefined})
  const ref = useRef();

  const getSize = () => {
    const rect = ref.current.getBoundingClientRect();
    const {width, height} = rect;
    return setSize({
      width: width,
      height: height,
    });
  }

  useEffect(() => {
    setTimeout(() => setActive(true), 500);
    window.addEventListener('resize', getSize);
    return () => {
      window.removeEventListener('resize', getSize);
    }
  }, []);

  useEffect(() => {
    if (active === true) {
      getSize();
    }
  }, [active]);

  const sequinSize = 20;
  const cols = Math.floor((size.width || 0) / sequinSize);
  const rows = Math.floor((size.height || 0) / sequinSize);
  const gap = 2;
  const sequins = parseInt(cols * rows, 10);
  const sequinArray = (new Array(sequins)).fill();

  return (
    <div style={{ height: '100%', width: '100%' }} ref={ref}>
      <div className={`flexWrap fade ${active ? 'active' : ''}`}>
        {sequinArray.map((block, index) => {
          return <div
            className="sequinBox"
            key={index}
            style={{
              height: `${sequinSize}px`,
              width: `${sequinSize}px`,
              zIndex: sequins - index,
            }}
          >
            <div
              className="sequin"
            />
          </div>
        })}
      </div>
    </div>
  );
}

export default Sequin;
