
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft } from 'lucide-react';
import { VerificationForm } from '@/components/provider-verification/VerificationForm';

const ProviderVerificationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is authenticated
  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white p-5 shadow-sm flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ChevronLeft />
        </button>
        <h1 className="text-xl font-semibold">Provider Verification</h1>
      </div>
      
      <div className="p-5">
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold mb-4">Complete Your Verification</h2>
          <p className="text-gray-600 mb-6">
            To become a verified service provider on KlikJasa, please provide the information below. 
            Our admin team will review your application within 1-3 business days.
          </p>
          
          <VerificationForm />
        </div>
      </div>
    </div>
  );
};

export default ProviderVerificationPage;
