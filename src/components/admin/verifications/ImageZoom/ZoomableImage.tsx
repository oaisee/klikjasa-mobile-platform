
import React, { useState } from 'react';
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
  
  // Zoom functions
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
    // Reset position when zooming in to prevent image from going off-screen
    if (zoomLevel === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };
  
  const zoomOut = () => {
    setZoomLevel(prev => {
      const newZoom = Math.max(prev - 0.25, 1);
      // Reset position when fully zoomed out
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newZoom;
    });
  };
  
  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };
  
  // Pan functionality for zoomed image
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

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ 
          cursor: zoomLevel > 1 ? 'grab' : 'default',
          touchAction: 'none'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img 
          src={imageUrl} 
          alt={altText} 
          className="max-h-[70vh] object-contain transition-transform duration-200"
          style={{ 
            transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
          }}
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
