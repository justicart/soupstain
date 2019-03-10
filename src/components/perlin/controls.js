import React from 'react';

class PerlinControls extends React.Component {
  updateValue () {
    return (event) => {
      this.props.updateValue(event.target.name, event.target.value);
    }
  };
  updateCheckboxValue () {
    return (event) => {
      this.props.updateCheckboxValue(event.target.name);
    }
  };
  render () {
    const formElements = [
      { name: 'noiseMax', label: 'Noise Max', min: 0, max: 10000, divisor: 1000, round: 3 },
      { name: 'count', label: 'Count', min: 1, max: 100 },
      { name: 'spacing', label: 'Spacing', min: 0, max: 20000, divisor: 100 },
      { name: 'smooth', label: 'Smooth', min: 1, max: 20 },
      { name: 'size', label: 'Radius', min: 1, max: 100 },
      { name: 'twist', label: 'Twist', min: -1000, max: 1000, divisor: 1000 },
      { name: 'rotate', label: 'Rotate', min: -100, max: 100, divisor: 1000, round: 3 },
      { name: 'strokeWidth', label: 'Stroke Width', min: 1, max: 1000, divisor: 100 },
      { name: 'strokeWidthDecay', label: 'Stroke Width Decay', min: 0, max: 100, divisor: 100 },
      { name: 'strokeOpacityDecay', label: 'Stroke Opacity Decay', min: 0, max: 100, divisor: 100 },
      { name: 'zOffset', label: 'Z Offset', min: 0, max: 1000, divisor: 5000, round: 3 },
    ]
    const renderForm = formElements.map(element => {
      const roundTo = element.round || 2;
      return (
        <div className="formRow columnParent" key={element.name}>
          <label htmlFor={element.name} className="rowParent">
            <div className="flexChild">
              {element.label}
            </div>
            <div className="flexChild shrink number">
              {element.divisor ?
                (this.props[element.name] / (element.divisor || 1)).toFixed(roundTo) :
                this.props[element.name]
              }
            </div>
          </label>
          <input
            type="range"
            name={element.name}
            min={element.min}
            max={element.max}
            value={this.props[element.name]}
            onChange={this.updateValue()}
          />
        </div>
      )
    })
    return (
      <div>
        {renderForm}
        <label htmlFor="fps">Show FPS</label>
        <input name="fps" type="checkbox" value={this.props.fps} onChange={this.updateCheckboxValue()}></input>
      </div>
    );
  }
}

export default PerlinControls;
