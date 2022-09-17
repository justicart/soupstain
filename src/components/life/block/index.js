import React, {useContext} from 'react';
import { LifeContext } from '../../../contexts/LifeContext';
import classNames from 'classnames';

import shapes from './../generators/shapes.json';

function Block({
  showNumbers,
  index,
  highlightIndex,
  highlightedIndex,
  toggleIndex,
  addShapeAtIndex,
  toggleRelativeNumbers,
}) {
  const {
    grid,
    currentGrid,
    relativeNumbersIndex,
    relativeNumbers,
    oneClick,
  } = useContext(LifeContext);
  const fill = currentGrid[index] === true;
  const selected = highlightedIndex === index;
  const relative = relativeNumbersIndex === index;
  const classes = classNames('block', {
    fill,
    selected,
    relative,
  });

  const {gridWidth} = grid;

  const handleClick = () => {
    oneClick === true
      ? toggleIndex(index)
      : highlightIndex(index);
  }

  const presets = Object.keys(shapes).map(shape => {
    return <button onClick={() => addShapeAtIndex(shape, index)}>{shape}</button>
  })

  return (
    <div
      className={classes}
      style={{
        fontSize: `${gridWidth}px`,
        width: gridWidth,
        height: gridWidth
      }}
      onClick={handleClick}
    >
      <div className="blockInner">
        <div>{showNumbers && index}</div>
        <div>{relativeNumbersIndex && `${relativeNumbers[index][0]}, ${relativeNumbers[index][1]}`}</div>
      </div>
      {selected && <div className="hud">
        <div className="x">&times;</div>
        <div className="toggle" onClick={() => toggleIndex(index)}></div>
        <div className="buttonBar">
          {presets}
          <hr/>
          <button onClick={() => toggleRelativeNumbers(index)}>Relative</button>
        </div>
      </div>}
    </div>
  );
}

export default Block;
