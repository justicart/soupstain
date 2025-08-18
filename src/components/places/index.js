import React, {useEffect, useState} from 'react';
import Papa from 'papaparse';
import D3Map from './D3Map';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

    // Handle window resize for mobile detection
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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


  return (
    <div className="places-container">
      <h1>Oh the Places You'll Go</h1>
      <div className="map-wrapper">
        
          {isMobile ? (
            <div className="map-overlay-controls">
              <button 
                onClick={() => setCurrentMap('northamerica')} 
                className="active-map-btn"
              >
                🌎 North America
              </button>
            </div>
          ) : (
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
          )}
        <D3Map 
          currentMap={currentMap}
          usaData={usaData}
          canadaData={canadaData}
          usaCustomization={usaCustomization}
          canadaCustomization={canadaCustomization}
        />
      </div>
    </div>
  );
}

export default Places;
