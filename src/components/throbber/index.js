import React from 'react';
import classNames from 'classnames';
import './style.css';

type Props = {
  inline?: boolean,
  dark?: boolean,
}

const Throbber = (props: Props) => {
  const { inline, dark } = props;
  const classes = classNames('throbberContainer', {
    inline,
    dark,
  })
  return (
    <div className={classes}>
      <div className="throbber">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </div>
  );
}

export default Throbber;
