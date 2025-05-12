
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 bg-klikjasa-cream rounded-full opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-klikjasa-deepPurple to-klikjasa-purple rounded-full opacity-70"></div>
        <img 
          src="/lovable-uploads/04aa7a30-0daa-473f-8a76-f75048131c95.png" 
          alt="KlikJasa Logo" 
          className="absolute inset-0 h-full w-full object-contain p-1" 
        />
      </div>
      <span className="ml-2 font-bold text-xl text-klikjasa-darkBlue">
        KlikJasa
      </span>
    </div>
  );
};

export default Logo;
