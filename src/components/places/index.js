import React from 'react';
import Papa from 'papaparse';
import USAMap from "react-usa-map";
import {useEffect, useState} from 'react';

import './style.css';

const DEFAULT_FILL = "rgba(0,0,0,.5)";
const COLOR = "36, 211, 253";

function Places(props) {
  const {vh} = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vS6z77YCTPUTgVlOl31fsujkeVDYNMknQ6HtEmAkPkRZftWH76dCpNIsU9RfKhIHlMaeptYbrG5eZ6W/pub?output=csv', {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data);
      }
    })
  }, [setData]);

  const traveledThroughStates = {};
  data != null && data.filter(row => row.traveled_through !== '').map(row => {
    return traveledThroughStates[row.abbreviation] = {
      fill: `rgba(${COLOR}, 0.2)`,
    }
  });

  const visitedStates = {};
  data != null && data.filter(row => row.have_been_to !== '').map(row => {
    return visitedStates[row.abbreviation] = {
      fill: `rgba(${COLOR}, 0.5)`,
    }
  });

  const livedInStates = {};
  data != null && data.filter(row => row.lived_in !== '').map(row => {
    return visitedStates[row.abbreviation] = {
      fill: `rgba(${COLOR}, 0.8)`,
    }
  });

  const mapCustomization = {
    ...traveledThroughStates,
    ...visitedStates,
    ...livedInStates
  };

  return (
    <div>
      <h1>Oh the Places You'll Go</h1>
      <USAMap
        customize={mapCustomization}
        defaultFill={DEFAULT_FILL}
        height={100 * vh}
      />
    </div>
  );
}

export default Places;
