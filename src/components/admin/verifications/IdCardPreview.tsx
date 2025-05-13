
import React, { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface IdCardPreviewProps {
  imageUrl: string;
  isImageLoaded: boolean;
  retryCount: number;
  onImageLoad: () => void;
  onImageError: () => void;
}

export const IdCardPreview: React.FC<IdCardPreviewProps> = ({
  imageUrl,
  isImageLoaded,
  retryCount,
  onImageLoad,
  onImageError
}) => {
  // State for zoom functionality
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
    <div className="space-y-3">
      {/* Preview card with aspect ratio */}
      <div className="border rounded-md overflow-hidden bg-gray-50 relative group">
        <AspectRatio ratio={16/9} className="bg-muted">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Skeleton className="h-32 w-40" />
              <p className="text-sm text-gray-500">Loading ID card...</p>
            </div>
          )}
          
          <img 
            key={retryCount} // Force re-render on retry
            src={imageUrl} 
            alt="Identity Card"
            className={`w-full h-full object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={onImageLoad}
            onError={onImageError}
            loading="eager" // Prioritize image loading
          />
          
          {/* Full-screen preview button overlay */}
          {isImageLoaded && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white rounded-full p-2 shadow-md flex items-center gap-1">
                    <ZoomIn size={16} className="text-gray-700" />
                    <span className="text-sm font-medium text-gray-700 pr-1">View Full Size</span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl p-4 bg-black/95">
                <div className="relative w-full h-[80vh] overflow-hidden">
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
                      alt="Identity Card Full Preview" 
                      className="max-h-[70vh] object-contain transition-transform duration-200"
                      style={{ 
                        transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                      }}
                    />
                  </div>
                  
                  {/* Zoom controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={zoomOut} 
                      disabled={zoomLevel <= 1}
                      className="bg-white/80 hover:bg-white"
                    >
                      <ZoomOut size={18} />
                    </Button>
                    
                    <div className="bg-white/80 px-3 py-1 rounded text-xs font-medium">
                      {Math.round(zoomLevel * 100)}%
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={zoomIn} 
                      disabled={zoomLevel >= 3}
                      className="bg-white/80 hover:bg-white"
                    >
                      <ZoomIn size={18} />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={resetZoom} 
                      disabled={zoomLevel === 1}
                      className="bg-white/80 hover:bg-white text-xs ml-2"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </AspectRatio>
      </div>
      
      {isImageLoaded && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Verify that the ID card photo is clear and matches the information provided.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-sm text-klikjasa-purple flex items-center gap-1 hover:underline">
                <ZoomIn size={14} />
                <span>Full Preview</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-4 bg-black/95">
              <div className="relative w-full h-[80vh] overflow-hidden">
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
                    alt="Identity Card Full Preview" 
                    className="max-h-[70vh] object-contain transition-transform duration-200"
                    style={{ 
                      transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
                    }}
                  />
                </div>
                
                {/* Zoom controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={zoomOut} 
                    disabled={zoomLevel <= 1}
                    className="bg-white/80 hover:bg-white"
                  >
                    <ZoomOut size={18} />
                  </Button>
                  
                  <div className="bg-white/80 px-3 py-1 rounded text-xs font-medium">
                    {Math.round(zoomLevel * 100)}%
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={zoomIn} 
                    disabled={zoomLevel >= 3}
                    className="bg-white/80 hover:bg-white"
                  >
                    <ZoomIn size={18} />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={resetZoom} 
                    disabled={zoomLevel === 1}
                    className="bg-white/80 hover:bg-white text-xs ml-2"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
