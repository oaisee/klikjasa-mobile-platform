
import React from 'react';
import { Loader2 } from 'lucide-react';

const DetailPageLoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-16 bg-gray-50 border border-gray-100 rounded-md">
      <Loader2 className="h-12 w-12 text-klikjasa-purple animate-spin" />
      <p className="mt-6 text-gray-600 text-lg font-medium">Loading verification details...</p>
      <p className="text-gray-500 text-sm mt-2">This may take a moment</p>
    </div>
  );
};

export default DetailPageLoadingState;
