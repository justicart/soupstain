import React from 'react';
import classNames from 'class-names';

class Stripe extends React.Component {
  constructor () {
    super();
    this.state = {
      active: false,
    };
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.selectStripe = this.selectStripe.bind(this);
  }

  mouseEnter () {
    return () => {
      if (this.props.selected !== this.props.name) {
        this.setState({ active: true });
      }
    }
  }
  mouseLeave () {
    return () => {
      setTimeout(() => this.setState({ active: false }), 200);
    }
  }
  selectStripe (name) {
    return () => {
      if (this.props.selected !== this.props.name) {
        this.setState({ active: false }, this.props.selectStripe(name));
      }
    }
  }
  render () {
    const classes = classNames(
      'stripe',
      {
        active: this.state.active,
        selected: this.props.selected === this.props.name,
        small: this.props.selected && this.props.selected !== this.props.name,
      }
    );
    const backgroundUrl = this.props.backgroundUrl || './images/bg-clouds-bw.jpg';
    return (
      <div className={classes} style={{ fontSize: `${this.props.size}px` }} onMouseEnter={this.mouseEnter()} onMouseLeave={this.mouseLeave()} onClick={this.selectStripe(this.props.name)}>
        <div className="background" style={{ background: `url(${backgroundUrl}) no-repeat 50% 50%/cover` }}></div>
        <div className="letter" onClick={this.props.selectStripe()}>{this.props.letter}</div>
        <div className="inner flexChild columnParent flexCenter">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Stripe;
