import React from 'react';
import P5Wrapper from 'react-p5-wrapper';
import perlinNoise from './perlinNoise.js';
import PerlinControls from './controls.js';

class PerlinNoise extends React.Component {
  state = {
    height: 200,
    width: 200,
    showApp: false,
    showMobileControls: true,
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
    }
  };

  toggleApp = () => {
    this.setState({ showApp: !this.state.showApp });
    this.setDevice();
  }

  toggleMobileControls = () => {
    this.setState({ showMobileControls: !this.state.showMobileControls });
  }

  getSize = () => {
    const size = this.perlinRef.getBoundingClientRect();
    const width = size.width;
    const height = size.height;
    this.setState({ height, width });
  }

  setDevice = () => {
    const size = this.parentRef.getBoundingClientRect();
    console.warn(size.width, size.height);
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
    return (
      <React.Fragment>
        <div style={{ height: '100%', width: '100%' }} ref={this.parentRefCallback}>
          {this.state.showApp && this.state.device === 'mobile' && <div className="mobile">
            <div style={{ height: '100%', width: '100%' }} ref={this.refCallback} onClick={this.toggleMobileControls}>
              <P5Wrapper sketch={perlinNoise} width={width} height={height} {...values} />
            </div>
            {this.state.showMobileControls && <div className="controls">
              <PerlinControls updateValue={this.updateValue} {...this.state.values} />
              <button onClick={this.toggleMobileControls}>Hide Controls</button>
            </div>}
          </div>}
          {this.state.showApp && this.state.device !== 'mobile' && <div className="rowParent">
            <div className="controls flexChild scroll shrink">
              <PerlinControls updateValue={this.updateValue} {...this.state.values} />
            </div>
            <div className="flexChild">
              <div style={{ height: '100%', width: '100%' }} ref={this.refCallback}>
                <P5Wrapper sketch={perlinNoise} width={width} height={height} {...values} />
              </div>
            </div>
          </div>}
          {!this.state.showApp && <button onClick={this.toggleApp}>Start the chaos</button>}
        </div>
      </React.Fragment>
    );
  }
}

export default PerlinNoise;
