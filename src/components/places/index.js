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

const geoUrls = {
  usa: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
  canada: "https://gist.githubusercontent.com/Saw-mon-and-Natalie/a11f058fc0dcce9343b02498a46b3d44/raw/e8afc74f791169a64d6e8df033d7e88ff85ba673/canada.json",
  northAmerica: "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
};

const csvUrls = {
  usa: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS6z77YCTPUTgVlOl31fsujkeVDYNMknQ6HtEmAkPkRZftWH76dCpNIsU9RfKhIHlMaeptYbrG5eZ6W/pub?output=csv',
  canada: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS6z77YCTPUTgVlOl31fsujkeVDYNMknQ6HtEmAkPkRZftWH76dCpNIsU9RfKhIHlMaeptYbrG5eZ6W/pub?gid=1777047172&output=csv'
};

const DEFAULT_FILL = "rgba(0,0,0,.5)";
const COLOR = "36, 211, 253";
const OTHER_COLOR = "213, 76, 139";

function Places() {
  const [usaData, setUsaData] = useState([]);
  const [canadaData, setCanadaData] = useState([]);
  const [currentMap, setCurrentMap] = useState('usa');
  const [usaPosition, setUsaPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [canadaPosition, setCanadaPosition] = useState({ coordinates: [-92.74, 57.82], zoom: 1 });

  useEffect(() => {
    // Load USA data
    Papa.parse(csvUrls.usa, {
      download: true,
      header: true,
      complete: (results) => {
        setUsaData(results.data);
      }
    });
    
    // Load Canada data
    Papa.parse(csvUrls.canada, {
      download: true,
      header: true,
      complete: (results) => {
        setCanadaData(results.data);
      }
    });
  }, []);

  // Create state mappings for USA
  function createStateCustomization(data, locationKey) {
    const traveledThroughStates = {};
    data != null && data.filter(row => row.traveled_through !== '').forEach(row => {
      let fill = `rgba(${COLOR}, 0.2)`;
      if (row.with_mindy !== '') {
        fill = `rgba(${OTHER_COLOR}, 0.2)`;
      }
      traveledThroughStates[row[locationKey]] = { fill };
    });

    const visitedStates = {};
    data != null && data.filter(row => row.have_been_to !== '').forEach(row => {
      let fill = `rgba(${COLOR}, 0.35)`;
      if (row.with_mindy !== '') {
        fill = `rgba(${OTHER_COLOR}, 0.5)`;
      }
      visitedStates[row[locationKey]] = { fill };
    });

    const livedInStates = {};
    data != null && data.filter(row => row.lived_in !== '').forEach(row => {
      let fill = `rgba(${COLOR}, 0.8)`;
      if (row.with_mindy !== '') {
        fill = `rgba(${OTHER_COLOR}, 0.8)`;
      }
      livedInStates[row[locationKey]] = { fill };
    });

    return {
      ...traveledThroughStates,
      ...visitedStates,
      ...livedInStates,
    };
  }

  const usaCustomization = createStateCustomization(usaData, 'state');
  const canadaCustomization = createStateCustomization(canadaData, 'province');

  function handleUsaMoveEnd(position) {
    console.log('USA position:', position);
    setUsaPosition(position);
  }

  function handleCanadaMoveEnd(position) {
    console.log('Canada position:', position);
    setCanadaPosition(position);
  }

  function getStateFill(geo, isCanada) {
    let locationName;
    
    if (isCanada) {
      // Canadian provinces use NAME property
      locationName = geo.properties.NAME;
    } else {
      // USA states
      locationName = geo.properties.name;
    }
    
    if (!locationName) return DEFAULT_FILL;
    
    const customization = isCanada ? canadaCustomization[locationName] : usaCustomization[locationName];
    return customization ? customization.fill : DEFAULT_FILL;
  }


  return (
    <div className="places-container">
      <h1>Oh the Places You'll Go</h1>
      <div className="map-wrapper">
        <div className="map-overlay-controls">
          <button 
            onClick={() => setCurrentMap('usa')} 
            className={currentMap === 'usa' ? 'active-map-btn' : 'map-btn'}
          >
            🇺🇸 USA
          </button>
          <button 
            onClick={() => setCurrentMap('canada')} 
            className={currentMap === 'canada' ? 'active-map-btn' : 'map-btn'}
          >
            🇨🇦 Canada
          </button>
        </div>
        {/* USA Map */}
        <div style={{ display: currentMap === 'usa' ? 'block' : 'none', width: "100%", height: "100%" }}>
          <ComposableMap
            projection="geoAlbersUsa"
            projectionConfig={{ scale: 1000 }}
            width={800}
            height={500}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup
              zoom={usaPosition.zoom}
              center={usaPosition.coordinates}
              onMoveEnd={handleUsaMoveEnd}
            >
              <Geographies geography={geoUrls.usa}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getStateFill(geo, false)}
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

        {/* Canada Map */}
        <div style={{ display: currentMap === 'canada' ? 'block' : 'none', width: "100%", height: "100%" }}>
          <ComposableMap
            projection="geoConicEqualArea"
            projectionConfig={{ center: [-106, 60], scale: 800, rotate: [96, 0, 0] }}
            width={800}
            height={500}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup
              zoom={canadaPosition.zoom}
              center={canadaPosition.coordinates}
              onMoveEnd={handleCanadaMoveEnd}
            >
              <Geographies geography={geoUrls.canada}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getStateFill(geo, true)}
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
    </div>
  );
}

export default Places;
