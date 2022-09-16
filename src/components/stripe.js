import React from 'react';
import {useCallback, useContext, useState} from 'react';
import classNames from 'class-names';

import {SequineContext} from '../contexts/SequineContext';

function Stripe(
  {
    backgroundUrl = './images/bg-clouds-bw.jpg',
    children,
    index,
    letter,
    preview,
    reveal,
    size,
    vh,
  }
) {
  const [active, setActive] = useState(false);

  const [selected, setSelected] = useContext(SequineContext);

  const mouseEnter = () => {
    const active = selected !== index;
    setActive(active);
  }
  const mouseLeave = () => {
    setTimeout(() => setActive(false), 200);
  }
  const selectStripeHandler = useCallback(() => {
    if (selected === index) {
      return setSelected(undefined);
    }
    setSelected(index);
    setActive(false);
  }, [selected])

  const isSelected = selected === index;
  const small = selected != null && selected !== index;
  const previousHidden = selected != null
    && index < selected - 1;
  const nextHidden = selected != null
    && index > selected + 1;
  const classes = classNames(
    'stripe',
    {
      active,
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
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      onClick={isSelected ? null : selectStripeHandler}
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
        onClick={selectStripeHandler}
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

export default Stripe;
