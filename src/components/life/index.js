import React from 'react';

import Grid from './../../components/life/grid';
import Throbber from '../throbber';

class Life extends React.Component {
  state = {
    showLife: false,
  }
  componentDidMount () {
    setTimeout(this.toggleLife, 1000);
  }
  toggleLife = () => {
    this.setState({ showLife: !this.state.showLife });
  }
  render () {
    return this.state.showLife ?
      (<Grid />) :
      (<Throbber />);
  };
}

export default Life;
