import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Stripe from './components/stripe';

import Life from './components/life';
import PerlinNoise from './components/perlin';

class App extends Component {
  constructor () {
    super();
    this.state = {
      size: 20,
      selected: undefined,
    };
    this.calculateLetterSize = this.calculateLetterSize.bind(this);
    this.selectStripe = this.selectStripe.bind(this);
  }

  componentDidMount () {
    this.calculateLetterSize();
    window.addEventListener('resize', this.calculateLetterSize);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.calculateLetterSize);
  }

  calculateLetterSize () {
    this.element = ReactDOM.findDOMNode(this);
    const size = this.element.clientHeight / 9;
    this.setState({ size });
  }

  selectStripe (selected) {
    return () => {
      this.setState({ selected })
    }
  }

  render() {
    const size = this.state.size;
    return (
      <div className="main columnParent">
        <Stripe name="stripe01" letter="S" preview={<div className="generic">Conway's Game of Life</div>} size={size} selectStripe={this.selectStripe} selected={this.state.selected} reveal>
          <Life />
        </Stripe>
        <Stripe name="stripe02" letter="O" preview={<div className="generic">Perlin Noise Loop</div>} size={size} selectStripe={this.selectStripe} selected={this.state.selected}>
          <PerlinNoise />
        </Stripe>
        <Stripe name="stripe03" letter="U" preview={<div className="generic">Coming soon!</div>} size={size} selectStripe={this.selectStripe} selected={this.state.selected}>

        </Stripe>
        <Stripe name="stripe04" letter="P" preview={<div className="generic">Coming soon!</div>} size={size} selectStripe={this.selectStripe} selected={this.state.selected}>

        </Stripe>
        <Stripe name="stripe05" letter="S" preview={<div className="generic">Coming soon!</div>} size={size} selectStripe={this.selectStripe} selected={this.state.selected}>

        </Stripe>
        <Stripe name="stripe06" letter="T" preview={<div className="generic">Coming soon!</div>} size={size} selectStripe={this.selectStripe} selected={this.state.selected}>

        </Stripe>
        <Stripe name="stripe07" letter="A" preview={<div className="generic">Coming soon!</div>} size={size} selectStripe={this.selectStripe} selected={this.state.selected}>

        </Stripe>
        <Stripe name="stripe08" letter="I" preview={<div className="generic">Coming soon!</div>} size={size} selectStripe={this.selectStripe} selected={this.state.selected}>

        </Stripe>
        <Stripe name="stripe09" letter="N" preview={<div className="generic">Coming soon!</div>} size={size} selectStripe={this.selectStripe} selected={this.state.selected}>

        </Stripe>
      </div>
    );
  }
}

export default App;
