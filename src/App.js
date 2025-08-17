import React from 'react';
import {useEffect, useState, useRef} from 'react';
import './App.css';
import Stripe from './components/stripe';

import {SequineProvider} from './contexts/SequineContext';
import {LifeProvider} from './contexts/LifeContext';

import Life from './components/life';
import PerlinNoise from './components/perlin';
import StupidUI from './components/stupidui';
import Places from './components/places';
import Sudoku from './components/sudoku';
import Sequin from './components/sequin';
import ChatApp from './components/cc';

const stripes = [
  { backgroundUrl: './images/tx-chuys.jpg', letter: 'S', previewText: 'Conway\'s Game of Life', content: <Life />},
  { backgroundUrl: './images/ny-public.jpg', letter: 'O', previewText: 'Perlin Noise Loop', content: <PerlinNoise />},
  { backgroundUrl: './images/ny-emp.jpg', letter: 'U', previewText: 'Stupid UI', content: <StupidUI />},
  { backgroundUrl: './images/sf-ggb.jpg', letter: 'P', previewText: 'Oh the Places You\'ll Go', content: <Places />},
  { letter: 'S', previewText: 'Sudoku', content: <Sudoku />},
  { letter: 'T', previewText: 'Chat', content: <ChatApp />},
  { letter: 'A', previewText: 'Some day', content: ''},
  { letter: 'I', previewText: 'Some day', content: ''},
  { letter: 'N', previewText: 'Sequin Pillow (WIP)', content: <Sequin />},
];

function App() {
  const [size, setSize] = useState(20);
  const [vh, setVh] = useState(0);
  const [initialSelected, setInitialSelected] = useState(null);

  const element = useRef();

  // Parse URL for stripe selection
  useEffect(() => {
    const parseUrl = () => {
      // Check for path-based routing like /s
      const targetLetter = window.location.pathname.slice(1);
      
      if (targetLetter) {
        const targetLower = targetLetter.toLowerCase();
        
        // Check for s1, s2 format
        if (targetLower.match(/^s\d+$/)) {
          const sNumber = parseInt(targetLower.slice(1), 10);
          const sIndices = stripes
            .map((stripe, index) => stripe.letter.toLowerCase() === 's' ? index : -1)
            .filter(index => index !== -1);
          
          if (sIndices[sNumber - 1] !== undefined) {
            setInitialSelected(sIndices[sNumber - 1]);
          }
        } else if (targetLower === 's') {
          // For plain 's', use first occurrence
          const sIndices = stripes
            .map((stripe, index) => stripe.letter.toLowerCase() === 's' ? index : -1)
            .filter(index => index !== -1);
          
          if (sIndices.length >= 1) {
            setInitialSelected(sIndices[0]); // First 'S'
          }
        } else {
          // For other letters, find the first occurrence
          const stripeIndex = stripes.findIndex(stripe => 
            stripe.letter.toLowerCase() === targetLower
          );
          
          if (stripeIndex !== -1) {
            setInitialSelected(stripeIndex);
          }
        }
      }
    };

    parseUrl();
    
    // Listen for browser navigation changes
    const handlePopState = () => parseUrl();
    window.addEventListener('popstate', handlePopState);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Generate URL suffix for each stripe
  const getUrlSuffix = (letter, index) => {
    const letterLower = letter.toLowerCase();
    if (letterLower === 's') {
      const sIndices = stripes
        .map((stripe, idx) => stripe.letter.toLowerCase() === 's' ? idx : -1)
        .filter(idx => idx !== -1);
      
      const sPosition = sIndices.indexOf(index) + 1;
      return sPosition === 1 ? 's' : `s${sPosition}`;
    }
    return letterLower;
  };

  const renderStripes = stripes.map((stripe, index) => {
    return (
      <Stripe
        backgroundUrl={stripe.backgroundUrl}
        key={index}
        index={index}
        letter={stripe.letter}
        urlSuffix={getUrlSuffix(stripe.letter, index)}
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
    <LifeProvider>
      <SequineProvider initialSelected={initialSelected}>
        <div className="main columnParent" ref={element}>
          {renderStripes}
        </div>
      </SequineProvider>
    </LifeProvider>
  );
}

export default App;
