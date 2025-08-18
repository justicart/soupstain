import React, { useEffect, useRef } from 'react';

const D3Map = ({ currentMap, usaData, canadaData, usaCustomization, canadaCustomization }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!window.d3 || !window.topojson) return;

    const svg = window.d3.select(svgRef.current);
    
    const width = 800;
    const height = 500;

    svg.attr("width", width).attr("height", height);
    
    // Only load data if not already loaded
    if (svg.node().dataLoaded) return;
    
    // Clear previous content
    svg.selectAll("*").remove();

    // Load both datasets and combine them
    const dataUrls = {
      usa: "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json",
      canada: "https://gist.githubusercontent.com/Saw-mon-and-Natalie/a11f058fc0dcce9343b02498a46b3d44/raw/e8afc74f791169a64d6e8df033d7e88ff85ba673/canada.json"
    };

    // Unified projection starting with US-centered view
    let projection = window.d3.geoConicEqualArea()
      .center([-96, 39])
      .rotate([96, 0, 0])
      .parallels([29.5, 45.5])
      .scale(1000)
      .translate([width / 2, height / 2]);

    let path = window.d3.geoPath().projection(projection);

    // Load both datasets and combine them
    Promise.all([
      window.d3.json(dataUrls.usa),
      window.d3.json(dataUrls.canada)
    ]).then(([usaData, canadaData]) => {
      console.log('USA data:', usaData);
      console.log('Canada data:', canadaData);
      
      // Extract features from both datasets
      const usaFeatures = window.topojson.feature(usaData, usaData.objects.states).features;
      const canadaFeatures = window.topojson.feature(canadaData, canadaData.objects.provinces).features;
      
      // Tag features with their type for easier styling
      usaFeatures.forEach(f => f.country = 'usa');
      canadaFeatures.forEach(f => f.country = 'canada');
      
      // Combine all features
      const allFeatures = [...usaFeatures, ...canadaFeatures];
      
      // Function to update colors without reloading
      const updateColors = (usaCustom, canadaCustom, selectedMap) => {
        const isMobile = window.innerWidth <= 768;
        
        svg.selectAll("path")
          .attr("fill", d => {
            const customization = d.country === 'canada' ? canadaCustom : usaCustom;
            const locationName = d.country === 'canada' ? d.properties.NAME : d.properties.name;
            const custom = customization[locationName];
            const baseColor = custom ? custom.fill : "rgba(0,0,0,.5)";
            
            // On desktop, fade out unselected country
            if (!isMobile && selectedMap && selectedMap !== 'northamerica') {
              const isSelectedCountry = (selectedMap === 'usa' && d.country === 'usa') ||
                                       (selectedMap === 'canada' && d.country === 'canada');
              if (!isSelectedCountry) {
                return baseColor.replace(/,\s*[\d.]+\)/, ', 0.1)'); // Set opacity to 0.1
              }
            }
            
            return baseColor;
          });
      };

      // Add zoom and drag behavior (define before updateView)
      const zoom = window.d3.zoom()
        .scaleExtent([0.5, 8])
        .on("zoom", (event) => {
          svg.selectAll("path").attr("transform", event.transform);
          // Log transform values for debugging with offset adjustment
          const currentWidth = window.innerWidth;
          const currentHeight = window.innerHeight;
          const widthOffset = (currentWidth - 800) / 2;
          const heightOffset = (currentHeight - 500) / 2;
          const adjustedX = event.transform.x - widthOffset;
          const adjustedY = event.transform.y - heightOffset;
          console.log(`Transform: x=${adjustedX.toFixed(1)}, y=${adjustedY.toFixed(1)}, scale=${event.transform.k.toFixed(2)} (offset-adjusted)`);
        });
      
      // Function to update view with smooth panning/zooming
      const updateView = (targetMap) => {
        const isMobile = window.innerWidth <= 768;
        const currentWidth = window.innerWidth;
        const currentHeight = window.innerHeight;
        
        // Calculate offset from standard size (800x500) to current size
        const widthOffset = (currentWidth - 800) / 2;
        const heightOffset = (currentHeight - 500) / 2;
        
        const viewConfig = isMobile ? {
          // Mobile: single North America view for all
          usa: { 
            x: -348.3 + widthOffset,
            y: -192.4 + heightOffset, 
            scale: 0.50
          },
          canada: { 
            x: -348.3 + widthOffset,
            y: -192.4 + heightOffset, 
            scale: 0.50
          },
          northamerica: { 
            x: -348.3 + widthOffset,
            y: -192.4 + heightOffset, 
            scale: 0.50
          }
        } : {
          // Desktop: separate USA and Canada views
          usa: { 
            x: -1696.7 + widthOffset,
            y: -1097.4 + heightOffset, 
            scale: 1.41
          },
          canada: { 
            x: -1535.0 + widthOffset,
            y: -588.5 + heightOffset,
            scale: 1.29
          }
        };
        
        const config = viewConfig[targetMap];
        
        // Create transform for the target view
        const transform = window.d3.zoomIdentity
          .translate(config.x, config.y)
          .scale(config.scale);
        
        // Smoothly transition to the new view
        svg.transition()
          .duration(1000)
          .call(zoom.transform, transform);
      };
      
      // Initial render
      const paths = svg.selectAll("path")
        .data(allFeatures)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => {
          const customization = d.country === 'canada' ? canadaCustomization : usaCustomization;
          const locationName = d.country === 'canada' ? d.properties.NAME : d.properties.name;
          const custom = customization[locationName];
          return custom ? custom.fill : "rgba(0,0,0,.5)";
        })
        .attr("stroke", "#000000")
        .attr("stroke-width", 0.5)
        .style("cursor", "pointer")
        .style("opacity", 0);

      // Fade in
      paths.transition()
        .duration(500)
        .style("opacity", 1);

      // Update view and colors based on currentMap
      updateView(currentMap);
      updateColors(usaCustomization, canadaCustomization, currentMap);

      // Store functions and mark data as loaded
      svg.node().updateView = updateView;
      svg.node().updateColors = updateColors;
      svg.node().dataLoaded = true;

      // Apply zoom behavior to svg
      svg.call(zoom);
      
    }).catch(error => {
      console.error('Error loading map data:', error);
    });

  }, []); // Only run once

  // Handle currentMap changes separately to avoid reloading data
  useEffect(() => {
    const svg = window.d3.select(svgRef.current);
    if (svg.node().updateView) {
      svg.node().updateView(currentMap);
    }
  }, [currentMap]);

  // Handle color changes when customization data updates
  useEffect(() => {
    const svg = window.d3.select(svgRef.current);
    if (svg.node().updateColors) {
      svg.node().updateColors(usaCustomization, canadaCustomization, currentMap);
    }
  }, [usaCustomization, canadaCustomization, currentMap]);

  return <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>;
};

export default D3Map;