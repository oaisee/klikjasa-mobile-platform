
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DetailPageErrorStateProps {
  error: string | null;
  message?: string;
  onRetry?: () => void;
}

const DetailPageErrorState: React.FC<DetailPageErrorStateProps> = ({ 
  error, 
  message = "Verification not found",
  onRetry
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-8 bg-red-50 rounded-lg border border-red-200 text-center">
      <div className="flex justify-center mb-4">
        <AlertTriangle size={48} className="text-red-500" />
      </div>
      <h3 className="text-xl font-medium text-red-800 mb-2">Error Loading Verification</h3>
      <p className="text-red-600 mb-6">{error || message}</p>
      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={() => navigate('/admin/verifications')}>
          Back to Verifications
        </Button>
        
        {onRetry && (
          <Button variant="default" onClick={onRetry} className="flex items-center gap-2">
            <RefreshCw size={16} /> Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default DetailPageErrorState;
