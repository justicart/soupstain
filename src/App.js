import React, { Component } from 'react';
import {useEffect, useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Stripe from './components/stripe';

import {AppProvider} from './AppContext';

import Life from './components/life';
import PerlinNoise from './components/perlin';
import StupidUI from './components/stupidui';
import Places from './components/places';
import Sequin from './components/sequin';

const stripes = [
  { backgroundUrl: './images/tx-chuys.jpg', letter: 'S', previewText: 'Conway\'s Game of Life', content: <Life />},
  { backgroundUrl: './images/ny-public.jpg', letter: 'O', previewText: 'Perlin Noise Loop', content: <PerlinNoise />},
  { backgroundUrl: './images/ny-emp.jpg', letter: 'U', previewText: 'Stupid UI', content: <StupidUI />},
  { backgroundUrl: './images/sf-ggb.jpg', letter: 'P', previewText: 'Oh the Places You\'ll Go', content: <Places />},
  { letter: 'S', previewText: 'Sequin Pillow (WIP)', content: <Sequin />},
  { letter: 'T', previewText: 'Some day', content: ''},
  { letter: 'A', previewText: 'Some day', content: ''},
  { letter: 'I', previewText: 'Some day', content: ''},
  { letter: 'N', previewText: 'Some day', content: ''},
];

function App() {
  const [size, setSize] = useState(20);
  const [vh, setVh] = useState(0);

  const element = useRef();

  const calculateSizes = () => {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    const size = element.current.clientHeight / 9;
    setSize(size);
    setVh(vh);
  };

  useEffect(() => {
    calculateSizes();
    window.addEventListener('resize', calculateSizes);
    return () => {
      window.removeEventListener('resize', calculateSizes);
    }
  });

  const renderStripes = stripes.map((stripe, index) => {
    return (
      <Stripe
        backgroundUrl={stripe.backgroundUrl}
        key={index}
        index={index}
        letter={stripe.letter}
        preview={<div className="generic">{stripe.previewText}</div>}
        size={size}
        reveal
        vh={vh}
      >
        {stripe.content}
      </Stripe>
    )
  });
  return (
    <AppProvider>
      <div className="main columnParent" ref={element}>
        {renderStripes}
      </div>
    </AppProvider>
  );
}

export default App;
