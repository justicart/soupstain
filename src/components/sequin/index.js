import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

import './style.css';

const BG_IMAGE = '/images/rick.jpg';
const FRONT_IMAGE = '/images/smiley.png';

function Sequin() {
  const [active, setActive] = useState(false);
  const [size, setSize] = useState({width: undefined, height: undefined})
  const [sequinFlipAmounts, setSequinFlipAmounts] = useState(new Map());
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastMouseY, setLastMouseY] = useState(0);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [sequinColors, setSequinColors] = useState(new Map());
  const [brushSize, setBrushSize] = useState(2.2);
  const [featherAmount, setFeatherAmount] = useState(0.5);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showBrushPreview, setShowBrushPreview] = useState(false);
  const [isOverControls, setIsOverControls] = useState(false);
  const [controlsPosition, setControlsPosition] = useState({ x: 20, y: 20 });
  const [isDraggingControls, setIsDraggingControls] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [controlsVisible, setControlsVisible] = useState(false);
  const [bgImageDimensions, setBgImageDimensions] = useState({ width: 0, height: 0 });
  const controlsTimeoutRef = useRef(null);
  const randomnessRef = useRef(new Map());
  const ref = useRef();
  const canvasRef = useRef();

  const sequinSize = 20;
  const cols = Math.floor((size.width || 0) / sequinSize);
  const rows = Math.floor((size.height || 0) / sequinSize);
  const sequins = parseInt(cols * rows, 10);
  const sequinArray = (new Array(sequins)).fill();

  const getSize = () => {
    const rect = ref.current.getBoundingClientRect();
    const {width, height} = rect;
    return setSize({
      width: width,
      height: height,
    });
  }

  useEffect(() => {
    setTimeout(() => setActive(true), 500);
    setTimeout(() => setControlsVisible(true), 800); // Show controls after sequins fade in
    window.addEventListener('resize', getSize);
    return () => {
      window.removeEventListener('resize', getSize);
    }
  }, []);

  // Load front image and sample colors
  useEffect(() => {
    if (!active || !size.width || !size.height) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size.width;
      canvas.height = size.height;
      
      // Calculate aspect ratios
      const imgAspect = img.width / img.height;
      const canvasAspect = size.width / size.height;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (imgAspect > canvasAspect) {
        // Image is wider - fit by width
        drawWidth = size.width;
        drawHeight = size.width / imgAspect;
        offsetX = 0;
        offsetY = (size.height - drawHeight) / 2;
      } else {
        // Image is taller - fit by height
        drawHeight = size.height;
        drawWidth = size.height * imgAspect;
        offsetX = (size.width - drawWidth) / 2;
        offsetY = 0;
      }
      
      // Draw the front image with contain behavior (centered, maintains aspect ratio)
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      
      // Sample colors for each sequin position
      const colorMap = new Map();
      for (let i = 0; i < sequins; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = Math.floor(col * sequinSize + sequinSize / 2);
        const y = Math.floor(row * sequinSize + sequinSize / 2);
        
        if (x < size.width && y < size.height) {
          const imageData = ctx.getImageData(x, y, 1, 1);
          const [r, g, b, a] = imageData.data;
          
          // If pixel is transparent, don't set a color (use default CSS background)
          if (a > 0) {
            const color = `rgb(${r}, ${g}, ${b})`;
            colorMap.set(i, color);
          }
        }
      }
      
      setSequinColors(colorMap);
      canvasRef.current = canvas;
    };
    
    img.src = FRONT_IMAGE;
  }, [active, size.width, size.height, cols, rows, sequins, sequinSize]);

  // Load background image dimensions for proper cover sizing
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setBgImageDimensions({ width: img.width, height: img.height });
    };
    img.src = BG_IMAGE;
  }, []);

  useEffect(() => {
    if (active === true) {
      getSize();
    }
  }, [active]);

  const getSequinIndex = (x, y) => {
    const rect = ref.current.getBoundingClientRect();
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;
    const col = Math.floor(relativeX / sequinSize);
    const row = Math.floor(relativeY / sequinSize);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {
      return row * cols + col;
    }
    return -1;
  };

  const getNeighboringSequins = (centerIndex) => {
    const centerRow = Math.floor(centerIndex / cols);
    const centerCol = centerIndex % cols;
    const affected = [];
    
    const maxRadius = Math.ceil(brushSize);
    
    for (let rowOffset = -maxRadius; rowOffset <= maxRadius; rowOffset++) {
      for (let colOffset = -maxRadius; colOffset <= maxRadius; colOffset++) {
        const newRow = centerRow + rowOffset;
        const newCol = centerCol + colOffset;
        
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          const index = newRow * cols + newCol;
          const distance = Math.sqrt(rowOffset * rowOffset + colOffset * colOffset);
          
          if (distance <= brushSize) {
            let flipAmount;
            const featherStart = brushSize * (1 - featherAmount);
            
            if (distance <= featherStart) {
              flipAmount = 1; // Full strength in center
            } else {
              // Feathered edge - extremely dramatic falloff
              const featherProgress = (distance - featherStart) / (brushSize - featherStart);
              // Use exponential falloff - avoid the 90-degree edge-on zone (around 0.5 flip)
              const baseAmount = Math.pow(1 - featherProgress, 3) * 0.7;
              // Snap very low values to 0 to avoid the edge-on appearance
              flipAmount = baseAmount < 0.15 ? 0 : baseAmount + 0.15; // Either 0% or 15%+ to avoid 90-degree zone
            }
            
            affected.push({ index, flipAmount });
          }
        }
      }
    }
    return affected;
  };

  const calculateNeighborInfluence = (currentIndex, currentRow, currentCol) => {
    let totalInfluence = 0;
    
    // Check all sequins in a 3x3 radius for influence
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        if (rowOffset === 0 && colOffset === 0) continue; // Skip self
        
        const neighborRow = currentRow + rowOffset;
        const neighborCol = currentCol + colOffset;
        
        if (neighborRow >= 0 && neighborRow < rows && neighborCol >= 0 && neighborCol < cols) {
          const neighborIndex = neighborRow * cols + neighborCol;
          const neighborFlip = sequinFlipAmounts.get(neighborIndex) || 0;
          
          if (neighborFlip > 0) {
            const distance = Math.sqrt(rowOffset * rowOffset + colOffset * colOffset);
            const influence = (neighborFlip * 15) / (distance + 1); // Max 15 degrees influence, diminishes with distance
            totalInfluence += influence;
          }
        }
      }
    }
    
    return Math.min(totalInfluence, 30); // Cap at 30 degrees
  };

  const getEventPos = (e) => {
    // Handle both mouse and touch events
    if (e.touches && e.touches[0]) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = useCallback((e) => {
    const pos = getEventPos(e);
    // Update mouse position for brush preview
    setMousePos({ x: pos.x, y: pos.y });
    
    if (!isMouseDown || isOverControls) return;
    
    const centerIndex = getSequinIndex(pos.x, pos.y);
    if (centerIndex === -1) return;
    
    // Determine drag direction
    const deltaY = pos.y - lastMouseY;
    const deltaX = pos.x - lastMouseX;
    const isDraggingUp = deltaY < -2; // Small threshold to avoid jitter
    const isDraggingDown = deltaY > 2;
    
    if (!isDraggingUp && !isDraggingDown) return; // No significant movement
    
    // Calculate speed multiplier based on drag velocity
    const dragSpeedY = Math.abs(deltaY);
    const dragSpeedX = Math.abs(deltaX);
    const speedMultiplier = Math.min(3, Math.max(0.5, dragSpeedY / 10)); // Cap between 0.5x and 3x
    
    const affectedSequins = getNeighboringSequins(centerIndex);
    setSequinFlipAmounts(prev => {
      const newMap = new Map(prev);
      affectedSequins.forEach(({ index, flipAmount }) => {
        const currentFlip = newMap.get(index) || 0;
        const increment = flipAmount * 0.4 * speedMultiplier;
        
        let newFlip;
        if (isDraggingUp) {
          // Flip forward
          newFlip = Math.min(1, currentFlip + increment);
        } else {
          // Flip backward (un-flip)
          newFlip = Math.max(0, currentFlip - increment);
        }
        
        // Store both flip amount and horizontal drag for diagonal rotation
        const horizontalDrag = Math.min(30, dragSpeedX * (deltaX > 0 ? 1 : -1)); // Cap at 30 degrees
        newMap.set(index, newFlip);
        newMap.set(`${index}-horizontal`, horizontalDrag);
      });
      return newMap;
    });
    
    setLastMouseY(pos.y);
    setLastMouseX(pos.x);
  }, [isMouseDown, lastMouseY, cols, rows]);

  const handleMouseDown = useCallback((e) => {
    if (isOverControls) return;
    e.preventDefault(); // Prevent scrolling on touch
    const pos = getEventPos(e);
    setIsMouseDown(true);
    setLastMouseY(pos.y);
    setLastMouseX(pos.x);
    handleMouseMove(e);
  }, [handleMouseMove, isOverControls]);
  
  const resetSequins = useCallback(() => {
    setSequinFlipAmounts(new Map());
    randomnessRef.current.clear();
  }, []);

  const handleControlsMouseDown = useCallback((e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
    if (e.type === 'touchstart') {
      e.preventDefault(); // Only prevent default for touch events when dragging
    }
    const pos = getEventPos(e);
    setIsDraggingControls(true);
    setDragOffset({
      x: pos.x - controlsPosition.x,
      y: pos.y - controlsPosition.y
    });
  }, [controlsPosition]);

  const handleControlsDrag = useCallback((e) => {
    if (!isDraggingControls) return;
    const pos = getEventPos(e);
    setControlsPosition({
      x: pos.x - dragOffset.x,
      y: pos.y - dragOffset.y
    });
  }, [isDraggingControls, dragOffset]);

  const handleControlsMouseUp = useCallback(() => {
    setIsDraggingControls(false);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  useEffect(() => {
    if (active) {
      // Mouse events
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mousemove', handleControlsDrag);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseup', handleControlsMouseUp);
      
      // Touch events
      document.addEventListener('touchmove', handleMouseMove, { passive: false });
      document.addEventListener('touchmove', handleControlsDrag, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
      document.addEventListener('touchend', handleControlsMouseUp);
      
      const resetControlsOnTouchEnd = () => {
        setTimeout(() => {
          if (!isDraggingControls) {
            setIsOverControls(false);
            setShowBrushPreview(false);
          }
        }, 50);
      };
      
      document.addEventListener('touchend', resetControlsOnTouchEnd);
      
      return () => {
        // Mouse events
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousemove', handleControlsDrag);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseup', handleControlsMouseUp);
        
        // Touch events
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchmove', handleControlsDrag);
        document.removeEventListener('touchend', handleMouseUp);
        document.removeEventListener('touchend', handleControlsMouseUp);
        document.removeEventListener('touchend', resetControlsOnTouchEnd);
      };
    }
  }, [active, handleMouseMove, handleMouseUp, handleControlsDrag, handleControlsMouseUp]);
  
  const handleMouseEnter = useCallback(() => {
    setShowBrushPreview(true);
  }, []);
  
  const handleMouseLeave = useCallback(() => {
    if (!isOverControls) {
      setShowBrushPreview(false);
    }
  }, [isOverControls]);
  
  const sequinSizeInPixels = sequinSize;

  return (
    <div style={{ height: '100%', width: '100%', userSelect: 'none', position: 'relative' }} ref={ref}>
      {/* Controls Panel */}
      <div 
        className="sequin-controls"
        style={{
          position: 'fixed',
          top: `${controlsPosition.y}px`,
          left: `${controlsPosition.x}px`,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px',
          borderRadius: '6px',
          zIndex: 10000,
          fontFamily: 'Arial, sans-serif',
          fontSize: '12px',
          minWidth: '160px',
          cursor: isDraggingControls ? 'grabbing' : 'grab',
          userSelect: 'none',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'scale(1)' : 'scale(0.8)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          transformOrigin: 'top left'
        }}
        onMouseDown={handleControlsMouseDown}
        onTouchStart={(e) => {
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
          }
          // Only set controls state if not touching an input or button
          if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
            setIsOverControls(true);
            setShowBrushPreview(true);
            handleControlsMouseDown(e);
          }
        }}
        onTouchEnd={() => {
          // Use timeout to allow for any child touch events to complete
          controlsTimeoutRef.current = setTimeout(() => {
            setIsOverControls(false);
            setShowBrushPreview(false);
          }, 100);
        }}
        onMouseEnter={() => {
          setIsOverControls(true);
          setShowBrushPreview(true);
        }}
        onMouseLeave={() => {
          setIsOverControls(false);
          setShowBrushPreview(false);
        }}
      >
        <div style={{ marginBottom: '6px' }}>
          <label style={{ display: 'block', marginBottom: '3px' }}>Size: {brushSize.toFixed(1)}</label>
          <input
            type="range"
            min="1"
            max="5"
            step="0.1"
            value={brushSize}
            onChange={(e) => setBrushSize(parseFloat(e.target.value))}
            onTouchStart={() => {
              setIsOverControls(true);
              setShowBrushPreview(true);
            }}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '6px' }}>
          <label style={{ display: 'block', marginBottom: '3px' }}>Feather: {(featherAmount * 100).toFixed(0)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={featherAmount}
            onChange={(e) => setFeatherAmount(parseFloat(e.target.value))}
            onTouchStart={() => {
              setIsOverControls(true);
              setShowBrushPreview(true);
            }}
            style={{ width: '100%' }}
          />
        </div>
        <button
          onClick={resetSequins}
          style={{
            width: '100%',
            padding: '6px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Reset
        </button>
      </div>
      
      {/* Brush Preview */}
      {showBrushPreview && ref.current && (
        <div style={{
          position: 'fixed',
          left: mousePos.x - (brushSize * sequinSizeInPixels),
          top: mousePos.y - (brushSize * sequinSizeInPixels),
          width: brushSize * sequinSizeInPixels * 2,
          height: brushSize * sequinSizeInPixels * 2,
          border: '2px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 10001
        }}>
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: (brushSize * (1 - featherAmount) * sequinSizeInPixels * 2),
            height: (brushSize * (1 - featherAmount) * sequinSizeInPixels * 2),
            marginLeft: -(brushSize * (1 - featherAmount) * sequinSizeInPixels),
            marginTop: -(brushSize * (1 - featherAmount) * sequinSizeInPixels),
            border: '1px dotted rgba(255, 255, 255, 0.6)',
            borderRadius: '50%'
          }} />
        </div>
      )}
      <div 
        className={`flexWrap fade ${active ? 'active' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {sequinArray.map((_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          const flipAmount = sequinFlipAmounts.get(index) || 0;
          const horizontalDrag = sequinFlipAmounts.get(`${index}-horizontal`) || 0;
          const isFlipped = flipAmount > 0;
          
          // Calculate distance from center top for directional rotation
          const centerCol = Math.floor(cols / 2);
          const distanceFromCenter = col - centerCol;
          const rotationDirection = distanceFromCenter >= 0 ? 1 : -1;
          
          // Add stable randomness when not fully flipped
          let randomness = 0;
          if (flipAmount < 1 && flipAmount > 0) {
            if (!randomnessRef.current.has(index)) {
              randomnessRef.current.set(index, (Math.random() - 0.5) * 10);
            }
            randomness = randomnessRef.current.get(index);
          } else if (flipAmount === 0) {
            randomnessRef.current.delete(index);
          }
          
          // Calculate neighbor influence for push effect
          const neighborPush = calculateNeighborInfluence(index, row, col);
          
          // Get sequin color from front image
          const sequinColor = sequinColors.get(index);
          
          // Calculate cover sizing for background image
          let bgBackgroundSize = `${size.width}px ${size.height}px`;
          let bgBackgroundPosition = `-${col * sequinSize}px -${row * sequinSize}px`;
          
          if (bgImageDimensions.width && bgImageDimensions.height && size.width && size.height) {
            const containerAspect = size.width / size.height;
            const imageAspect = bgImageDimensions.width / bgImageDimensions.height;
            
            let coverWidth, coverHeight, offsetX = 0, offsetY = 0;
            
            if (imageAspect > containerAspect) {
              // Image is wider - fit by height
              coverHeight = size.height;
              coverWidth = size.height * imageAspect;
              offsetX = (size.width - coverWidth) / 2;
            } else {
              // Image is taller - fit by width
              coverWidth = size.width;
              coverHeight = size.width / imageAspect;
              offsetY = (size.height - coverHeight) / 2;
            }
            
            bgBackgroundSize = `${coverWidth}px ${coverHeight}px`;
            bgBackgroundPosition = `-${col * sequinSize - offsetX}px -${row * sequinSize - offsetY}px`;
          }
          
          // Calculate glint effect at specific rotation angles
          const isNearGlintAngle = (
            (flipAmount >= 0.25 && flipAmount <= 0.35) || 
            (flipAmount >= 0.65 && flipAmount <= 0.75)
          );
          const glintIntensity = isNearGlintAngle ? 
            Math.sin((flipAmount - 0.3) * Math.PI * 10) * 0.8 + 0.2 : 0;
          
          return <div
            className="sequinBox"
            key={index}
            style={{
              height: `${sequinSize}px`,
              width: `${sequinSize}px`,
              zIndex: sequins - index,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div
              className={`sequin ${isFlipped ? 'flipped' : ''}`}
              style={{
                transform: `rotateX(${flipAmount * 180 * rotationDirection + randomness}deg) rotateY(${horizontalDrag}deg) translateZ(${neighborPush * 0.5}px) rotateZ(${neighborPush * 0.3}deg)`,
                filter: glintIntensity > 0 ? `brightness(${1 + glintIntensity * 2})` : 'none',
                ...(flipAmount === 0 && sequinColor && {
                  backgroundColor: sequinColor,
                  backgroundImage: `linear-gradient(135deg, 
                    rgba(255,255,255,0.3) 0%, 
                    rgba(255,255,255,0.1) 25%, 
                    rgba(0,0,0,0.1) 50%, 
                    rgba(0,0,0,0.2) 75%, 
                    rgba(0,0,0,0.3) 100%)`
                }),
                ...(flipAmount > 0.2 && flipAmount <= 0.5 && {
                  backgroundColor: `hsl(${200 + flipAmount * 60}, 15%, ${75 + flipAmount * 15}%)`
                }),
                ...(glintIntensity > 0 && {
                  boxShadow: `0 0 ${glintIntensity * 20}px rgba(255,255,255,${glintIntensity}), inset 0 0 ${glintIntensity * 15}px rgba(255,255,255,${glintIntensity * 0.8})`
                }),
              }}
            >
              {flipAmount > 0.5 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url('${BG_IMAGE}')`,
                    backgroundPosition: bgBackgroundPosition,
                    backgroundSize: bgBackgroundSize,
                    transform: `rotateX(180deg)`,
                    borderRadius: '50%',
                  }}
                />
              )}
            </div>
          </div>
        })}
      </div>
    </div>
  );
}

export default Sequin;
