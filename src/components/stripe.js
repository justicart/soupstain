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
  selectStripe (name, top, height) {
    return () => {
      if (this.props.selected !== this.props.name) {
        this.setState({ active: false }, this.props.selectStripe(name, top, height));
      }
    }
  }
  render () {
    const selected = this.props.selected === this.props.name;
    const stripe = this.props.stripe;
    const small = this.props.selected && this.props.selected !== this.props.name;
    const classes = classNames(
      'stripe',
      {
        active: this.state.active,
        selected,
        small,
      }
    );
    const backgroundUrl = this.props.backgroundUrl || './images/bg-clouds-bw.jpg';
    const reveal = this.props.reveal ? selected : true;
    return (
      <div
        className={classes}
        onMouseEnter={this.mouseEnter()}
        onMouseLeave={this.mouseLeave()}
        onClick={this.selectStripe(this.props.name, stripe.top, stripe.height)}
      >
        <div className="background" style={{ background: `url(${backgroundUrl}) no-repeat 50% 50%/cover` }}></div>
        <div className="letter" onClick={this.props.selectStripe()} style={{ fontSize: small ? `${this.props.size * .2}px` : `${this.props.size}px` }}>{this.props.letter}</div>
        <div className="inner" style={{ height: `calc(100% - ${this.props.size || 20}px)` }}>
          {reveal && this.props.children}
        </div>
        <div className="preview flexChild columnParent flexCenter">
          {this.props.preview}
        </div>
      </div>
    );
  }
}

export default Stripe;
