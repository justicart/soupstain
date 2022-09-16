import React, {useContext} from 'react';
import { LifeContext } from '../../../contexts/LifeContext';
import classNames from 'classnames';

function Block({
  gridWidth,
  showNumbers,
  index,
  highlightIndex,
  highlightedIndex,
  toggleIndex,
  addCenterShape,
  addGlider,
  toggleRelativeNumbers,
}) {
  const {
    currentGrid,
    relativeNumbersIndex,
    relativeNumbers,
  } = useContext(LifeContext);
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
      onClick={() => highlightIndex(index)}
    >
      <div className="blockInner">
        <div>{showNumbers && index}</div>
        {/* <div>{relativeNumbersIndex && relativeNumbers[index]}</div> */}
        <div>{relativeNumbersIndex && `${relativeNumbers[index][0]}, ${relativeNumbers[index][1]}`}</div>
      </div>
      {selected && <div className="hud">
        <div className="x">&times;</div>
        <div className="toggle" onClick={() => toggleIndex(index)}></div>
        <div className="buttonBar">
          <button onClick={() => addCenterShape('pulsar', index)}>Pulsar</button>
          <button onClick={() => addGlider(index)}>Glider</button>
          <button onClick={() => addCenterShape('glidergun', index)}>Glider Gun</button>
          <button onClick={() => addCenterShape('pentadeca', index)}>Penta-Deca</button>
          <hr/>
          <button onClick={() => toggleRelativeNumbers(index)}>Relative</button>
        </div>
      </div>}
    </div>
  );
}

export default Block;
