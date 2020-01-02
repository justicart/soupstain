import React from 'react';
import classNames from 'class-names';

class Stripe extends React.Component {
  constructor () {
    super();
    this.state = {
      active: false,
      peekNext: false,
      peekPrevious: false,
    };
    this.mouseEnter = this.mouseEnter.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.selectStripe = this.selectStripe.bind(this);
  }

  mouseEnter () {
    return () => {
      const {index, selected} = this.props;
      const active = selected !== index;
      this.setState({ active });
    }
  }
  mouseLeave () {
    return () => {
      setTimeout(() => this.setState({ active: false }), 200);
    }
  }
  selectStripe (index) {
    return () => {
      const {index, selected, selectStripe} = this.props;
      if (selected !== index) {
        this.setState({ active: false }, selectStripe(index));
      }
    }
  }
  render () {
    const {
      backgroundUrl = './images/bg-clouds-bw.jpg',
      children,
      index,
      letter,
      preview,
      reveal,
      selected,
      selectStripe,
      size,
      vh,
    } = this.props;
    const isSelected = selected === index;
    const small = selected != null && selected !== index;
    const previousHidden = selected != null
      && index < selected - 1;
    const nextHidden = selected != null
      && index > selected + 1;
    const classes = classNames(
      'stripe',
      {
        active: this.state.active,
        selected: isSelected,
        small,
      }
    );
    const deferReveal = reveal ? isSelected : true;
    const selectedMultiplier = index === 0 || index === 8 ? 1 : 2;
    let smallSize = size * .2;
    if (smallSize < 40) {
      smallSize = 40;
    }
    const innerHeight = 100 * vh - (selectedMultiplier * smallSize);
    return (
      <div
        className={classes}
        onMouseEnter={this.mouseEnter()}
        onMouseLeave={this.mouseLeave()}
        onClick={this.selectStripe(index)}
        style={{
          height: small
            ? `${smallSize}px`
            : isSelected
              ? `${innerHeight}px`
              : null,
          marginBottom: nextHidden ? `-${smallSize}px` : null,
          marginTop: previousHidden ? `-${smallSize}px` : null,
        }}
      >
        <div className="background" style={{ background: `url(${backgroundUrl}) no-repeat 50% 50%/cover` }}></div>
        <div
          className="letter"
          onClick={selectStripe()}
          style={{ fontSize: small ? `${smallSize}px` : `${size}px` }}
        >{letter}</div>
        <div className="inner" style={{ height: `calc(100% - ${size || 20}px)` }}>
          {deferReveal && children}
        </div>
        <div className="preview flexChild columnParent flexCenter">
          {preview}
        </div>
      </div>
    );
  }
}

export default Stripe;
