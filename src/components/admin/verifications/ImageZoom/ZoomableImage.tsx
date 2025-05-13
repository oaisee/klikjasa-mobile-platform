
import React, { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ZoomControls } from './ZoomControls';

interface ZoomableImageProps {
  imageUrl: string;
  altText: string;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  imageUrl,
  altText
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  
  // Reset position when fully zoomed out
  const resetPositionIfNeeded = useCallback((newZoom: number) => {
    if (newZoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, []);
  
  // Zoom functions
  const zoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
    // Reset position when zooming in to prevent image from going off-screen
    if (zoomLevel === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoomLevel]);
  
  const zoomOut = useCallback(() => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.25, 1);
      resetPositionIfNeeded(newZoom);
      return newZoom;
    });
  }, [resetPositionIfNeeded]);
  
  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, []);
  
  // Mouse-based panning handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      setInitialPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning && zoomLevel > 1) {
      setPosition({
        x: e.clientX - initialPosition.x,
        y: e.clientY - initialPosition.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch-based panning handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (zoomLevel > 1 && e.touches.length === 1) {
      setIsPanning(true);
      const touch = e.touches[0];
      setInitialPosition({ 
        x: touch.clientX - position.x, 
        y: touch.clientY - position.y 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isPanning && zoomLevel > 1 && e.touches.length === 1) {
      e.preventDefault(); // Prevent scrolling while panning
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - initialPosition.x,
        y: touch.clientY - initialPosition.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };
  
  // Double tap to zoom on mobile
  const [lastTapTime, setLastTapTime] = useState(0);
  
  const handleTap = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    
    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      e.preventDefault();
      if (zoomLevel > 1) {
        resetZoom();
      } else {
        setZoomLevel(2); // Zoom to 200%
      }
    }
    
    setLastTapTime(currentTime);
  }, [lastTapTime, zoomLevel, resetZoom]);

  // Prevent unwanted behavior on touch devices
  useEffect(() => {
    const imageContainer = document.querySelector('.zoomable-image-container');
    
    const preventDefaultTouchActions = (e: TouchEvent) => {
      if (zoomLevel > 1) {
        e.preventDefault();
      }
    };
    
    if (imageContainer && isMobile) {
      imageContainer.addEventListener('touchmove', preventDefaultTouchActions, { passive: false });
    }
    
    return () => {
      if (imageContainer && isMobile) {
        imageContainer.removeEventListener('touchmove', preventDefaultTouchActions);
      }
    };
  }, [zoomLevel, isMobile]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        className="zoomable-image-container relative w-full h-full flex items-center justify-center"
        style={{ 
          cursor: zoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
          touchAction: zoomLevel > 1 ? 'none' : 'pan-y pinch-zoom',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onTouchEndCapture={handleTap}
      >
        <img 
          src={imageUrl} 
          alt={altText} 
          className="max-h-[70vh] object-contain transition-transform duration-200"
          style={{ 
            transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
          }}
          draggable={false}
        />
      </div>
      
      {/* Zoom controls */}
      <ZoomControls
        zoomLevel={zoomLevel}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
      />
    </div>
  );
};
