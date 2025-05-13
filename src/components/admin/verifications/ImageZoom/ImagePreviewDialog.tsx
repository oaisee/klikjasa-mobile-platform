
import React from 'react';
import { DialogContent } from '@/components/ui/dialog';
import { ZoomableImage } from './ZoomableImage';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImagePreviewDialogProps {
  imageUrl: string;
}

export const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({ 
  imageUrl 
}) => {
  const isMobile = useIsMobile();

  return (
    <DialogContent className={`${isMobile ? 'max-w-full h-[90vh] p-2' : 'max-w-4xl p-4'} bg-black/95`}>
      <ZoomableImage 
        imageUrl={imageUrl} 
        altText="Identity Card Full Preview" 
      />
    </DialogContent>
  );
};
