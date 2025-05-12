
import React from 'react';

const EmptyStateMessage: React.FC = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>No verification requests found matching your criteria</p>
    </div>
  );
};

export default EmptyStateMessage;
