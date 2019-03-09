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
      noiseMax: 1000,
      count: 1,
      spacing: 1000,
      smooth: 5,
      size: 100,
      twist: 0,
      rotate: 3,
      strokeWidth: 200,
      strokeWidthDecay: 100,
      strokeOpacityDecay: 100,
      zOffset: 0,
    },
    device: 'desktop',
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
  parentRefCallback = element => {
    if (element) {
      this.parentRef = element;
      this.setDevice();
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

  setDevice = () => {
    const size = this.parentRef.getBoundingClientRect();
    if (size.width < 640 || size.height < 640) {
      return this.setState({ device: 'mobile' });
    }
    return false;
  }

  updateValue = (key, value) => {
    this.setState({ values: { ...this.state.values, [key]: value }});
  }
  render () {
    const { width, height, values } = this.state;
    const classes = this.state.device === 'mobile' ? 'mobile columnParent reverse' : 'rowParent';
    return this.state.showApp ?
      (<div className={classes} style={{ height: '100%', width: '100%' }} ref={this.parentRefCallback}>
        <div className="controls flexChild scroll shrink">
          <PerlinControls updateValue={this.updateValue} {...this.state.values} />
        </div>
        <div className="flexChild">
          <div style={{ height: '100%', width: '100%' }} ref={this.refCallback}>
            <P5Wrapper sketch={perlinNoise} width={width} height={height} {...values} />
          </div>
        </div>
      </div>) :
      (<button onClick={this.toggleApp}>Start the chaos</button>);
  }
}

export default PerlinNoise;
