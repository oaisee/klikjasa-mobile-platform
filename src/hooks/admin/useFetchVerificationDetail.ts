
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProviderVerification } from './types/verification';
import { parseAddressData } from './utils/addressParser';

export function useFetchVerificationDetail() {
  const [verification, setVerification] = useState<ProviderVerification | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch a single verification by ID
  const fetchVerificationById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setVerification(null); // Clear existing verification data when fetching new one
      
      console.log("Fetching verification details with ID:", id);
      
      const { data, error: fetchError } = await supabase
        .from('provider_verifications')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .eq('id', id)
        .single();
        
      if (fetchError) {
        console.error("Error fetching verification details:", fetchError);
        setError(fetchError.message);
        setLoading(false);
        return null;
      }
      
      if (!data) {
        console.log("No verification data found for ID:", id);
        setError("Verification not found");
        setLoading(false);
        return null;
      }
      
      console.log("Fetched verification details:", data);
      
      // Transform address from JSON to the expected format
      const transformedData = {
        ...data,
        address: parseAddressData(data.address)
      } as ProviderVerification;
      
      setVerification(transformedData);
      setLoading(false);
      return transformedData;
    } catch (err) {
      console.error("Error fetching verification details:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch verification details";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load verification details. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
      return null;
    }
  };

  return {
    verification,
    loading,
    error,
    fetchVerificationById
  };
}
