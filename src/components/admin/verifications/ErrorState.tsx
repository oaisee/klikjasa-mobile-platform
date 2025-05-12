
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string | null;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
  <div className="py-8 text-center">
    <p className="text-red-500">{error}</p>
    <Button 
      variant="outline" 
      className="mt-4"
      onClick={() => window.location.reload()}
    >
      Try Again
    </Button>
  </div>
);

export default ErrorState;
