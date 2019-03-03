import React from 'react';
import P5Wrapper from 'react-p5-wrapper';
import perlinNoise from './perlinNoise.js';
import PerlinControls from './controls.js';

class PerlinNoise extends React.Component {
  state = {
    height: 200,
    width: 200,
    showApp: false,
    values: {
      noiseMax: 100,
      count: 1,
      spacing: 1000,
      detail: 5,
      size: 100,
      twist: 0,
      strokeWidth: 200,
      strokeWidthDecay: 100,
      strokeOpacityDecay: 100,
      zOffset: 0,
    }
  };
  componentDidMount () {
    // this.getSize();
    window.addEventListener('resize', this.getSize);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.getSize);
  }

  refCallback = element => {
    if (element) {
      this.perlinRef = element;
      this.getSize();
    }
  };

  toggleApp = () => {
    this.setState({ showApp: !this.state.showApp });
  }

  getSize = () => {
    const size = this.perlinRef.getBoundingClientRect();
    const width = size.width;
    const height = size.height;
    this.setState({ height, width });
  }

  updateValue = (key, value) => {
    this.setState({ values: { ...this.state.values, [key]: value }});
  }
  render () {
    const { width, height, values } = this.state;
    return this.state.showApp ?
      (<div className="rowParent" style={{ height: '100%', width: '100%' }}>
        <PerlinControls updateValue={this.updateValue} {...this.state.values} />
        <div style={{ height: '100%', width: '100%' }} ref={this.refCallback}>
          <P5Wrapper sketch={perlinNoise} width={width} height={height} {...values} />
        </div>
      </div>) :
      (<button onClick={this.toggleApp}>Start the chaos</button>);
    // return (
    //   <div style={{ height: '100%', width: '100%' }} ref={this.refCallback}>
    //     <P5Wrapper sketch={perlinNoise} width={width} height={height} />
    //   </div>
    // );
  }
}

export default PerlinNoise;
