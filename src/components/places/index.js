import React from 'react';
import Tabletop from 'tabletop';
import USAMap from "react-usa-map";
import {useEffect, useState} from 'react';

import './style.css';

const DEFAULT_FILL = "rgba(0,0,0,.5)";
const COLOR = "36, 211, 253";

function Places() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Tabletop.init({
      key: 'https://docs.google.com/spreadsheets/d/138fGAaCD7ffFta0G6LKypg_cj6thnMYrZFLj2vfTxCs/edit?usp=sharing',
      simpleSheet: true,
    }).then((data, tabletop) => {
      setData(data);
    })
  }, [setData]);

  const visitedStates = {};
  data != null && data.filter(row => row.have_been_to !== '').map(row => {
    return visitedStates[row.abbreviation] = {
      fill: `rgba(${COLOR}, 0.5)`,
    }
  });

  const traveledThroughStates = {};
  data != null && data.filter(row => row.traveled_through !== '').map(row => {
    return traveledThroughStates[row.abbreviation] = {
      fill: `rgba(${COLOR}, 0.2)`,
    }
  });

  const livedInStates = {};
  data != null && data.filter(row => row.lived_in !== '').map(row => {
    return visitedStates[row.abbreviation] = {
      fill: `rgba(${COLOR}, 0.8)`,
    }
  });

  const mapCustomization = {
    ...visitedStates,
    ...traveledThroughStates,
    ...livedInStates
  };

  return (
    <USAMap customize={mapCustomization} defaultFill={DEFAULT_FILL} />
  );
}

export default Places;