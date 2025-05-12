
import { useFetchVerifications } from './useFetchVerifications';
import { useFetchVerificationDetail } from './useFetchVerificationDetail';
import { useVerificationActions } from './useVerificationActions';
import { 
  VerificationStatus, 
  ProviderVerification, 
  UseProviderVerificationsProps 
} from './types/verification';

// Re-export the types
export type { VerificationStatus, ProviderVerification };

// Main hook that combines all verification-related functionality
export function useProviderVerifications(props: UseProviderVerificationsProps = {}) {
  // Get fetch functionality
  const { 
    verifications, 
    loading: fetchLoading, 
    error: fetchError, 
    refetch 
  } = useFetchVerifications(props);
  
  // Get detail fetch functionality
  const { 
    fetchVerificationById,
    verification,
    loading: detailLoading,
    error: detailError
  } = useFetchVerificationDetail();
  
  // Get actions functionality
  const { 
    updateVerificationStatus, 
    loading: actionLoading 
  } = useVerificationActions();

  // Combine loading and error states
  const loading = fetchLoading || detailLoading || (actionLoading !== null);
  const error = fetchError || detailError;

  return {
    // Verification list data & operations
    verifications,
    loading: fetchLoading,
    error: fetchError,
    refetch,
    
    // Single verification operations
    fetchVerificationById,
    verification,
    verificationLoading: detailLoading,
    verificationError: detailError,
    
    // Actions
    updateVerificationStatus,
    actionInProgress: actionLoading
  };
}
