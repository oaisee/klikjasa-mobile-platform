
import React from 'react';
import { FileImage, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IdCardErrorViewProps {
  idCardUrl: string;
  onRetry: () => void;
  onRefresh: () => void;
}

export const IdCardErrorView: React.FC<IdCardErrorViewProps> = ({ 
  idCardUrl, 
  onRetry, 
  onRefresh 
}) => {
  return (
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
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className="mr-1" /> Try Again
        </Button>
        <Button 
          variant="default" 
          onClick={onRefresh}
          className="flex items-center gap-2 klikjasa-gradient"
        >
          Refresh Page
        </Button>
      </div>
    </div>
  );
};
