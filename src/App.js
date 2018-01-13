import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Stripe from './components/stripe';

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
        <Stripe name="stripe01" letter="S" size={size} selectStripe={this.selectStripe} selected={this.state.selected}>
          <div>Coming soon!</div>
        </Stripe>
        <Stripe name="stripe02" letter="O" size={size} selectStripe={this.selectStripe} selected={this.state.selected}>
          <div>Coming soon!</div>
        </Stripe>
        <Stripe name="stripe03" letter="U" size={size} selectStripe={this.selectStripe} selected={this.state.selected}>
          <div>Coming soon!</div>
        </Stripe>
        <Stripe name="stripe04" letter="P" size={size} selectStripe={this.selectStripe} selected={this.state.selected}>
          <div>Coming soon!</div>
        </Stripe>
        <Stripe name="stripe05" letter="S" size={size} selectStripe={this.selectStripe} selected={this.state.selected}>
          <div>Coming soon!</div>
        </Stripe>
        <Stripe name="stripe06" letter="T" size={size} selectStripe={this.selectStripe} selected={this.state.selected}>
          <div>Coming soon!</div>
        </Stripe>
        <Stripe name="stripe07" letter="A" size={size} selectStripe={this.selectStripe} selected={this.state.selected}>
          <div>Coming soon!</div>
        </Stripe>
        <Stripe name="stripe08" letter="I" size={size} selectStripe={this.selectStripe} selected={this.state.selected}>
          <div>Coming soon!</div>
        </Stripe>
        <Stripe name="stripe09" letter="N" size={size} selectStripe={this.selectStripe} selected={this.state.selected}>
          <div>Coming soon!</div>
        </Stripe>
      </div>
    );
  }
}

export default App;
