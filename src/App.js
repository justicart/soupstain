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
      heightAdjust: undefined,
      topAdjust: undefined,
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

  selectStripe (selected, topAdjust, heightAdjust) {
    return () => {
      console.warn(selected, topAdjust, heightAdjust);
      this.setState({ selected, heightAdjust, topAdjust })
    }
  }

  render() {
    const { size, selected, heightAdjust, topAdjust } = this.state;
    const stripes = [
      { letter: 'S', previewText: 'Conway\'s Game of Life', content: <Life />, top: '0', height: 'calc(100vh + 12.5em)'},
      { letter: 'O', previewText: 'Perlin Noise Loop', content: <PerlinNoise />, top: '0', height: 'calc(100vh + 10.5em)'},
      { letter: 'U', previewText: 'Some day', content: '', top: '-1.7em', height: 'calc(100vh + 10.5em)'},
      { letter: 'P', previewText: 'Some day', content: '', top: '-3.4em', height: 'calc(100vh + 10.5em)'},
      { letter: 'S', previewText: 'Some day', content: '', top: '-5.1em', height: 'calc(100vh + 10.5em)'},
      { letter: 'T', previewText: 'Some day', content: '', top: '-6.8em', height: 'calc(100vh + 10.5em)'},
      { letter: 'A', previewText: 'Some day', content: '', top: '-8.5em', height: 'calc(100vh + 10.5em)'},
      { letter: 'I', previewText: 'Some day', content: '', top: '-10.2em', height: 'calc(100vh + 10.5em)'},
      { letter: 'N', previewText: 'Some day', content: '', top: '-11.9em', height: 'calc(100vh + 12.2em)'},
    ]
    const renderStripes = stripes.map((stripe, index) => {
      return (
        <Stripe
          key={index}
          name={`stripe${index + 1}`}
          letter={stripe.letter}
          preview={<div className="generic">{stripe.previewText}</div>}
          size={size}
          selectStripe={this.selectStripe}
          selected={selected}
          stripe={stripe}
          reveal
        >
          {stripe.content}
        </Stripe>
      )
    });
    const height = selected ? heightAdjust : '100vh';
    const top = selected ? topAdjust : '0';
    return (
      <div className="main columnParent" style={{ height, top }}>
        {renderStripes}
      </div>
    );
  }
}

export default App;
