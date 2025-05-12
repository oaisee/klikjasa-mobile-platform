
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center py-12">
    <Loader2 className="h-8 w-8 text-klikjasa-purple animate-spin" />
    <p className="ml-2 text-gray-500">Loading verification requests...</p>
  </div>
);

export default LoadingState;
