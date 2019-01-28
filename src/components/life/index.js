import React from 'react';

import Grid from './../../components/life/grid';

class Life extends React.Component {
  state = {
    showLife: false,
  }
  toggleLife = () => {
    this.setState({ showLife: !this.state.showLife });
  }
  render () {
    return this.state.showLife ?
      (<Grid />) :
      (<button onClick={this.toggleLife}>Play Conway's Game of Life</button>);
  };
}

export default Life;
