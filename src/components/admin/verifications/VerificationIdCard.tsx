
import React from 'react';
import { FileText } from 'lucide-react';

interface VerificationIdCardProps {
  idCardUrl: string;
}

const VerificationIdCard: React.FC<VerificationIdCardProps> = ({ idCardUrl }) => {
  return (
    <>
      <h3 className="font-medium mb-4 flex items-center">
        <FileText size={18} className="mr-2 text-gray-500" /> 
        Identity Card Image
      </h3>
      <div className="border rounded-md overflow-hidden">
        <img 
          src={idCardUrl} 
          alt="Identity Card" 
          className="w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; 
            target.src = 'https://via.placeholder.com/800x500?text=Image+Not+Found';
          }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Verify that the ID card photo is clear and matches the information provided.
      </p>
    </>
  );
};

export default VerificationIdCard;
