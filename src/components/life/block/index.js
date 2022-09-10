import React from 'react';
import classNames from 'classnames';

function Block({
  currentGrid,
  gridWidth,
  showNumbers,
  index,
  highlightIndex,
  highlightedIndex,
  relativeNumbersIndex,
  relativeNumbers,
  toggleIndex,
  addPulsar,
  addGlider,
  addGlidergun,
  toggleRelativeNumbers,
}) {
  const fill = currentGrid[index] === true;
  const selected = highlightedIndex === index;
  const relative = relativeNumbersIndex === index;
  const classes = classNames('block', {
    fill,
    selected,
    relative,
  });
  return (
    <div
      className={classes}
      style={{
        fontSize: `${gridWidth}px`,
        width: gridWidth,
        height: gridWidth
      }}
      onClick={highlightIndex(index)}
    >
      <div className="blockInner">
        <div>{showNumbers && index}</div>
        <div>{relativeNumbersIndex && relativeNumbers[index]}</div>
      </div>
      {selected && <div className="hud">
        <div className="x">x</div>
        <div className="toggle" onClick={toggleIndex(index)}></div>
        <div className="buttonBar">
          <button onClick={addPulsar(index)}>Pulsar</button>
          <button onClick={addGlider(index)}>Glider</button>
          <button onClick={addGlidergun(index)}>Glider Gun</button>
          <hr/>
          <button onClick={toggleRelativeNumbers(index)}>Relative</button>
        </div>
      </div>}
    </div>
  );
}

export default Block;
