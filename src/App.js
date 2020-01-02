import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Stripe from './components/stripe';

import Life from './components/life';
import PerlinNoise from './components/perlin';
import StupidUI from './components/stupidui';
import Places from './components/places';

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
    const { size, selected } = this.state;
    const stripes = [
      { backgroundUrl: './images/tx-chuys.jpg', letter: 'S', previewText: 'Conway\'s Game of Life', content: <Life />},
      { backgroundUrl: './images/ny-public.jpg', letter: 'O', previewText: 'Perlin Noise Loop', content: <PerlinNoise />},
      { backgroundUrl: './images/ny-emp.jpg', letter: 'U', previewText: 'Stupid UI', content: <StupidUI />},
      { backgroundUrl: './images/sf-ggb.jpg', letter: 'P', previewText: 'Oh the Places You\'ll Go', content: <Places />},
      { letter: 'S', previewText: 'Some day', content: ''},
      { letter: 'T', previewText: 'Some day', content: ''},
      { letter: 'A', previewText: 'Some day', content: ''},
      { letter: 'I', previewText: 'Some day', content: ''},
      { letter: 'N', previewText: 'Some day', content: ''},
    ]
    const renderStripes = stripes.map((stripe, index) => {
      return (
        <Stripe
          backgroundUrl={stripe.backgroundUrl}
          key={index}
          index={index}
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
    return (
      <div className="main columnParent">
        {renderStripes}
      </div>
    );
  }
}

export default App;
