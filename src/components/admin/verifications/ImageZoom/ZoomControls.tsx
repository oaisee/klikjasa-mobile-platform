
import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ZoomControlsProps {
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  zoomLevel,
  zoomIn,
  zoomOut,
  resetZoom
}) => {
  return (
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
  );
};
