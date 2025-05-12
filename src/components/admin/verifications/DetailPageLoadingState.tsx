
import React from 'react';
import { Loader2 } from 'lucide-react';

const DetailPageLoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <Loader2 className="h-12 w-12 text-klikjasa-purple animate-spin" />
      <p className="mt-4 text-gray-600">Loading verification details...</p>
    </div>
  );
};

export default DetailPageLoadingState;
