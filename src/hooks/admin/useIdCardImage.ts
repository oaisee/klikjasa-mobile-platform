
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useIdCardImage(initialIdCardUrl: string) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageUrl, setImageUrl] = useState(initialIdCardUrl);
  const { toast } = useToast();
  
  // Try to load the image when the component mounts or URL changes
  useEffect(() => {
    if (initialIdCardUrl) {
      setHasError(false);
      setIsImageLoaded(false);
      setImageUrl(initialIdCardUrl);
      
      // Pre-fetch the image to check if it loads
      const img = new Image();
      img.onload = () => {
        setIsImageLoaded(true);
        setHasError(false);
      };
      img.onerror = () => {
        console.error("Failed to pre-load ID card image:", initialIdCardUrl);
        setHasError(true);
        handleRetry(); // Automatically try once
      };
      img.src = initialIdCardUrl;
    }
  }, [initialIdCardUrl]);
  
  // Function to handle retry logic
  const handleRetry = async () => {
    setHasError(false);
    setIsImageLoaded(false);
    setRetryCount(prev => prev + 1);
    
    try {
      // Extract the file path from the URL
      let storagePath = '';
      
      if (initialIdCardUrl.includes('/public/verifications/')) {
        storagePath = initialIdCardUrl.split('/public/verifications/')[1];
      } else if (initialIdCardUrl.includes('id_cards/')) {
        storagePath = initialIdCardUrl;
      } else {
        storagePath = `id_cards/${initialIdCardUrl}`;
      }
      
      console.log("Attempting to regenerate URL with path:", storagePath);
      
      const { data } = await supabase
        .storage
        .from('verifications')
        .getPublicUrl(storagePath);
        
      if (data) {
        console.log("Successfully regenerated public URL:", data.publicUrl);
        setImageUrl(data.publicUrl);
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
  
  // Use a modified URL to prevent caching issues
  const imageUrlWithCache = hasError ? '' : `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}cache=${retryCount}`;
  
  // Function to force refresh the page to apply new storage policies
  const handleForceRefresh = () => {
    window.location.reload();
  };

  return {
    isImageLoaded,
    setIsImageLoaded,
    hasError,
    setHasError,
    retryCount,
    imageUrlWithCache,
    handleRetry,
    handleForceRefresh
  };
}
