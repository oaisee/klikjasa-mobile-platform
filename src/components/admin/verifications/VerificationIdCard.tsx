
import React from 'react';
import { FileImage } from 'lucide-react';
import { useIdCardImage } from '@/hooks/admin/useIdCardImage';
import { IdCardErrorView } from './IdCardErrorView';
import { IdCardPreview } from './IdCardPreview';

interface VerificationIdCardProps {
  idCardUrl: string;
}

const VerificationIdCard: React.FC<VerificationIdCardProps> = ({ idCardUrl }) => {
  const {
    isImageLoaded,
    setIsImageLoaded,
    hasError,
    setHasError,
    retryCount,
    imageUrlWithCache,
    handleRetry,
    handleForceRefresh
  } = useIdCardImage(idCardUrl);
  
  return (
    <>
      <h3 className="font-medium mb-4 flex items-center">
        <FileImage size={18} className="mr-2 text-gray-500" /> 
        Identity Card Image
      </h3>
      
      {hasError ? (
        <IdCardErrorView
          idCardUrl={idCardUrl}
          onRetry={handleRetry}
          onRefresh={handleForceRefresh}
        />
      ) : (
        <IdCardPreview
          imageUrl={imageUrlWithCache}
          isImageLoaded={isImageLoaded}
          retryCount={retryCount}
          onImageLoad={() => {
            console.log("ID card image loaded successfully:", imageUrlWithCache);
            setIsImageLoaded(true);
            setHasError(false);
          }}
          onImageError={() => {
            console.error("Failed to load ID card image:", imageUrlWithCache);
            setHasError(true);
            setIsImageLoaded(false);
          }}
        />
      )}
    </>
  );
};

export default VerificationIdCard;
