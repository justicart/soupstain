import React from 'react';
import Papa from 'papaparse';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import {useEffect, useState} from 'react';

import './style.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const DEFAULT_FILL = "rgba(0,0,0,.5)";
const COLOR = "36, 211, 253";
const OTHER_COLOR = "213, 76, 139";

function Places() {
  const [data, setData] = useState([]);
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  useEffect(() => {
    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vS6z77YCTPUTgVlOl31fsujkeVDYNMknQ6HtEmAkPkRZftWH76dCpNIsU9RfKhIHlMaeptYbrG5eZ6W/pub?output=csv', {
      download: true,
      header: true,
      complete: (results) => {
        setData(results.data);
      }
    })
  }, [setData]);

  // Create state mappings using state names
  const traveledThroughStates = {};
  data != null && data.filter(row => row.traveled_through !== '').forEach(row => {
    let fill = `rgba(${COLOR}, 0.2)`;
    if (row.with_mindy !== '') {
      fill = `rgba(${OTHER_COLOR}, 0.2)`;
    }
    traveledThroughStates[row.state] = { fill };
  });

  const visitedStates = {};
  data != null && data.filter(row => row.have_been_to !== '').forEach(row => {
    let fill = `rgba(${COLOR}, 0.35)`;
    if (row.with_mindy !== '') {
      fill = `rgba(${OTHER_COLOR}, 0.5)`;
    }
    visitedStates[row.state] = { fill };
  });

  const livedInStates = {};
  data != null && data.filter(row => row.lived_in !== '').forEach(row => {
    let fill = `rgba(${COLOR}, 0.8)`;
    if (row.with_mindy !== '') {
      fill = `rgba(${OTHER_COLOR}, 0.8)`;
    }
    livedInStates[row.state] = { fill };
  });

  const stateCustomization = {
    ...traveledThroughStates,
    ...visitedStates,
    ...livedInStates,
  };

  function handleMoveEnd(position) {
    setPosition(position);
  }

  function getStateFill(geo) {
    const stateName = geo.properties.name;
    if (!stateName) return DEFAULT_FILL;
    
    const customization = stateCustomization[stateName];
    return customization ? customization.fill : DEFAULT_FILL;
  }

  return (
    <div className="places-container">
      <h1>Oh the Places You'll Go</h1>
      <div className="map-wrapper">
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{
            scale: 1000
          }}
          width={800}
          height={500}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getStateFill(geo)}
                    stroke="#000000"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: "none",
                      },
                      hover: {
                        outline: "none",
                        opacity: 0.8,
                      },
                      pressed: {
                        outline: "none",
                      },
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
}

export default Places;
