
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DetailPageErrorStateProps {
  error: string | null;
  message?: string;
}

const DetailPageErrorState: React.FC<DetailPageErrorStateProps> = ({ 
  error, 
  message = "Verification not found" 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-center">
      <p className="text-red-600 mb-4">{error || message}</p>
      <Button variant="outline" onClick={() => navigate('/admin/verifications')}>
        Back to Verifications
      </Button>
    </div>
  );
};

export default DetailPageErrorState;
