import React from 'react';
import classNames from 'classnames';

class Block extends React.Component {
  render () {
    const { showNumbers, index, highlightedIndex, relativeNumbersIndex, relativeNumbers } = this.props;
    const fill = this.props.currentGrid[this.props.index] === true;
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
          fontSize: `${this.props.gridWidth}px`,
          width: this.props.gridWidth,
          height: this.props.gridWidth
        }}
        onClick={this.props.highlightIndex(index)}
      >
        <div className="blockInner">
          <div>{showNumbers && index}</div>
          <div>{relativeNumbersIndex && relativeNumbers[index]}</div>
        </div>
        {selected && <div className="hud">
          <div className="x">x</div>
          <div className="toggle" onClick={this.props.toggleIndex(index)}></div>
          <div className="buttonBar">
            <button onClick={this.props.addPulsar(index)}>Pulsar</button>
            <button onClick={this.props.addGlider(index)}>Glider</button>
            <button onClick={this.props.addGlidergun(index)}>Glider Gun</button>
            <hr/>
            <button onClick={this.props.toggleRelativeNumbers(index)}>Relative</button>
          </div>
        </div>}
      </div>
    );
  }
}

export default Block;
