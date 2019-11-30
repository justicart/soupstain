import React from 'react';
import {useCallback, useEffect, useState} from 'react';

import './style.css';

const MIN = 2010000000; // NJ 201
const MAX = 9899999999; // MI 989
const DEFAULT_RANGE = {min: MIN, max: MAX, zoom: null};
const ZOOM = [5000000, 500000, 50000, 5000, 500];

function StupidUI() {
  const [phone, setPhone] = useState(0);
  const [fphone, setFphone] = useState();
  const [range, setRange] = useState(DEFAULT_RANGE)

  const formatNumber = (number) => {
    const f1 = String(number).substring(0,3);
    const f2 = String(number).substring(3,6);
    const f3 = String(number).substring(6);
    return `(${f1}) ${f2}-${f3}`
  }
  useEffect(() => {
    setFphone(formatNumber(phone))
  }, [phone, setFphone])
  const decrementPhone = () => {
    setPhone(parseInt(phone, 10) - 1)
  }
  const incrementPhone = () => {
    setPhone(parseInt(phone, 10) + 1)
  }

  const getZoomLevel = useCallback(() => {
    if (range.zoom == null) {
      return 0
    }
    if (range.zoom === ZOOM.length - 1) {
      return null;
    }
    return range.zoom + 1;
  }, [range])

  const zoom = () => {
    if (phone === 0) {
      return;
    }
    const zoomLevel = getZoomLevel();
    let min;
    let max;
    if (zoomLevel != null) {
      min = parseInt(phone, 10) - ZOOM[zoomLevel];
      if (min < MIN) {
        min = MIN;
      }
      max = parseInt(phone, 10) + ZOOM[zoomLevel];
      if (max > MAX) {
        max = MAX;
      }
      return setRange({min, max, zoom: zoomLevel})
    }
    return setRange(DEFAULT_RANGE);
  }
  return (
    <div>
      <h1>Stupid UI</h1>
      <div className="columnParent container">
        <div className="rowParent phoneLabel">
          <div className="flexChild" style={{textAlign: 'left'}}>
            Choose your phone number
          </div>
          <div className="flexChild shrink">
            <button className="zoom" onClick={zoom}>
              {range.zoom != null ? `Zoom ${String(range.zoom + 1)}` : 'Zoom 0'}
            </button>
          </div>
        </div>
        <div className="rowParent phoneInput">
          <input
            className="flexChild"
            type="range"
            min={range.min}
            max={range.max}
            value={phone}
            onChange={(evt) => setPhone(evt.target.value)}
          />
        </div>
        <div
          className={`range rowParent ${range.zoom != null ? 'show' : 'hide'}`}
        >
          <div className="flexChild" style={{textAlign: 'left'}}>
            {formatNumber(range.min)}
          </div>
          <div className="flexChild shrink">
            {formatNumber(range.max)}
          </div>
        </div>
        {phone > 0 && <div className="rowParent phoneOutput">
          <div
            className={`flexChild shrink leftArrow ${phone === 0 ? 'disabled' : ''}`}
            onClick={decrementPhone}
          />
          <div className="flexChild">{fphone}</div>
          <div
            className={`flexChild shrink rightArrow ${phone === 0 ? 'disabled' : ''}`}
            onClick={incrementPhone}
          />
        </div>}
      </div>
    </div>
  );
}

export default StupidUI;
