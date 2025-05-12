
import React from 'react';
import { FileX } from 'lucide-react';

interface EmptyStateMessageProps {
  message?: string;
  filterActive?: boolean;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ 
  message = "No verification requests found",
  filterActive = false 
}) => {
  return (
    <div className="text-center py-12 px-4">
      <div className="flex justify-center mb-4">
        <FileX size={48} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {filterActive 
          ? "Try changing your search criteria or removing filters to see more results." 
          : "When providers submit verification requests, they'll appear here for review."}
      </p>
    </div>
  );
};

export default EmptyStateMessage;
