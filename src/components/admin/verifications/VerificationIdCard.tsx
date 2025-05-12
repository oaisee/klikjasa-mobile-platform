
import React, { useState } from 'react';
import { FileText, ZoomIn } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface VerificationIdCardProps {
  idCardUrl: string;
}

const VerificationIdCard: React.FC<VerificationIdCardProps> = ({ idCardUrl }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  return (
    <>
      <h3 className="font-medium mb-4 flex items-center">
        <FileText size={18} className="mr-2 text-gray-500" /> 
        Identity Card Image
      </h3>
      
      {hasError ? (
        <div className="border rounded-md p-8 bg-gray-50 flex flex-col items-center justify-center">
          <FileText size={48} className="text-gray-400 mb-3" />
          <p className="text-gray-500 text-center">
            Unable to load the ID card image. The file may be corrupted or no longer exists.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preview card with aspect ratio */}
          <div className="border rounded-md overflow-hidden bg-gray-50 relative group">
            <AspectRatio ratio={16/9} className="bg-muted">
              <img 
                src={idCardUrl} 
                alt="Identity Card"
                className={`w-full h-full object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsImageLoaded(true)}
                onError={() => {
                  console.error("Failed to load ID card image:", idCardUrl);
                  setHasError(true);
                }}
              />
              {!isImageLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-klikjasa-purple border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Full-screen preview button overlay */}
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
                    src={idCardUrl} 
                    alt="Identity Card Full Preview" 
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </DialogContent>
              </Dialog>
            </AspectRatio>
          </div>
          
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
                  src={idCardUrl} 
                  alt="Identity Card Full Preview" 
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationIdCard;
