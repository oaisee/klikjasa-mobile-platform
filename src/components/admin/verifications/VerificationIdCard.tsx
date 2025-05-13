
import React, { useState } from 'react';
import { FileImage, ZoomIn, RefreshCw } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface VerificationIdCardProps {
  idCardUrl: string;
}

const VerificationIdCard: React.FC<VerificationIdCardProps> = ({ idCardUrl }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Function to handle retry logic
  const handleRetry = async () => {
    setHasError(false);
    setIsImageLoaded(false);
    setRetryCount(prev => prev + 1);
    
    try {
      // Try to regenerate the URL by extracting the path
      const storagePath = idCardUrl.includes('/public/verifications/') ? 
        idCardUrl.split('/public/verifications/')[1] : 
        idCardUrl.includes('id_cards/') ? idCardUrl : `id_cards/${idCardUrl}`;
      
      if (storagePath) {
        console.log("Retrying with path:", storagePath);
        const { data } = await supabase
          .storage
          .from('verifications')
          .getPublicUrl(storagePath);
          
        if (data) {
          console.log("Regenerated public URL:", data.publicUrl);
        }
      }
    } catch (err) {
      console.error("Error during retry:", err);
    }
  };
  
  // Use a modified URL to prevent caching issues
  const imageUrlWithCache = hasError ? '' : `${idCardUrl}${idCardUrl.includes('?') ? '&' : '?'}cache=${retryCount}`;
  
  return (
    <>
      <h3 className="font-medium mb-4 flex items-center">
        <FileImage size={18} className="mr-2 text-gray-500" /> 
        Identity Card Image
      </h3>
      
      {hasError ? (
        <div className="border rounded-md p-8 bg-gray-50 flex flex-col items-center justify-center space-y-4">
          <FileImage size={48} className="text-gray-400" />
          <div className="text-gray-500 text-center space-y-2">
            <p>Unable to load the ID card image. The file may be corrupted or no longer exists.</p>
            <p className="text-sm break-all">URL: {idCardUrl}</p>
            
            {/* Display more detailed error information */}
            <p className="text-xs text-red-500 mt-2">
              Storage policies have been updated. Please try refreshing the page or clicking the retry button below.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRetry}
            className="flex items-center gap-2 mt-2"
          >
            <RefreshCw size={16} className="mr-1" /> Try Again
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preview card with aspect ratio */}
          <div className="border rounded-md overflow-hidden bg-gray-50 relative group">
            <AspectRatio ratio={16/9} className="bg-muted">
              <img 
                key={retryCount} // Force re-render on retry
                src={imageUrlWithCache} 
                alt="Identity Card"
                className={`w-full h-full object-contain transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => {
                  console.log("ID card image loaded successfully:", imageUrlWithCache);
                  setIsImageLoaded(true);
                  setHasError(false);
                }}
                onError={(e) => {
                  console.error("Failed to load ID card image:", imageUrlWithCache);
                  setHasError(true);
                  setIsImageLoaded(false);
                }}
              />
              {!isImageLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 border-4 border-klikjasa-purple border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
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
                      src={imageUrlWithCache} 
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
                    src={imageUrlWithCache} 
                    alt="Identity Card Full Preview" 
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VerificationIdCard;
