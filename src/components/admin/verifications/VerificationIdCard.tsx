
import React, { useState, useEffect } from 'react';
import { FileImage, ZoomIn, RefreshCw } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VerificationIdCardProps {
  idCardUrl: string;
}

const VerificationIdCard: React.FC<VerificationIdCardProps> = ({ idCardUrl }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  
  // Try to load the image when the component mounts or URL changes
  useEffect(() => {
    if (idCardUrl) {
      setHasError(false);
      setIsImageLoaded(false);
    }
  }, [idCardUrl]);
  
  // Function to handle retry logic
  const handleRetry = async () => {
    setHasError(false);
    setIsImageLoaded(false);
    setRetryCount(prev => prev + 1);
    
    try {
      // Extract the file path from the URL
      let storagePath = '';
      
      if (idCardUrl.includes('/public/verifications/')) {
        storagePath = idCardUrl.split('/public/verifications/')[1];
      } else if (idCardUrl.includes('id_cards/')) {
        storagePath = idCardUrl;
      } else {
        storagePath = `id_cards/${idCardUrl}`;
      }
      
      console.log("Attempting to regenerate URL with path:", storagePath);
      
      const { data, error } = await supabase
        .storage
        .from('verifications')
        .getPublicUrl(storagePath);
        
      if (error) {
        console.error("Error getting public URL:", error);
        throw error;
      }
        
      if (data) {
        console.log("Successfully regenerated public URL:", data.publicUrl);
        toast({
          title: "Retrying image load",
          description: "Attempting to load image with fresh URL"
        });
      }
    } catch (err) {
      console.error("Error during retry:", err);
      toast({
        title: "Retry failed",
        description: "Could not regenerate image URL. Please check storage permissions.",
        variant: "destructive"
      });
    }
  };
  
  // Force refresh the page to apply new storage policies
  const handleForceRefresh = () => {
    window.location.reload();
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
            <p className="text-sm break-all overflow-hidden text-ellipsis max-w-full">URL: {idCardUrl}</p>
            
            <p className="text-xs text-klikjasa-purple mt-2">
              Storage policies have been updated. Please try the actions below.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className="mr-1" /> Try Again
            </Button>
            <Button 
              variant="default" 
              onClick={handleForceRefresh}
              className="flex items-center gap-2 klikjasa-gradient"
            >
              Refresh Page
            </Button>
          </div>
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
                  toast({
                    title: "Image loaded successfully",
                    description: "ID card is now visible"
                  });
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
