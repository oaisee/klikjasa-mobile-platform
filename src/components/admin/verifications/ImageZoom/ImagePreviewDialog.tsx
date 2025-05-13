
import React from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { ZoomableImage } from './ZoomableImage';

interface ImagePreviewDialogProps {
  imageUrl: string;
}

export const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({ 
  imageUrl 
}) => {
  return (
    <DialogContent className="max-w-4xl p-4 bg-black/95">
      <ZoomableImage 
        imageUrl={imageUrl} 
        altText="Identity Card Full Preview" 
      />
    </DialogContent>
  );
};
