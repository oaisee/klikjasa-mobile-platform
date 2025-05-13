
import React from 'react';
import { ZoomIn } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

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
              <DialogContent className="max-w-4xl p-1 bg-black/95">
                <img 
                  src={imageUrl} 
                  alt="Identity Card Full Preview" 
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
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
            <DialogContent className="max-w-4xl p-1 bg-black/95">
              <img 
                src={imageUrl} 
                alt="Identity Card Full Preview" 
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};
