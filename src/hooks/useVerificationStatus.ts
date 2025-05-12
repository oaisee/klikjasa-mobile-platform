
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseVerificationStatusProps {
  userId: string | undefined;
}

interface VerificationStatusResult {
  pendingVerification: boolean;
  verificationLoading: boolean;
}

export const useVerificationStatus = ({ userId }: UseVerificationStatusProps): VerificationStatusResult => {
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(true);

  // Check if the user has a pending verification request
  useEffect(() => {
    const checkPendingVerification = async () => {
      if (!userId) {
        setVerificationLoading(false);
        return;
      }
      
      try {
        setVerificationLoading(true);
        const { data, error } = await supabase
          .from('provider_verifications')
          .select('status')
          .eq('user_id', userId)
          .eq('status', 'pending')
          .maybeSingle();
          
        if (error) {
          console.error('Error checking verification status:', error);
        } else {
          setPendingVerification(!!data);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      } finally {
        setVerificationLoading(false);
      }
    };
    
    checkPendingVerification();
  }, [userId]);

  return {
    pendingVerification,
    verificationLoading
  };
};
