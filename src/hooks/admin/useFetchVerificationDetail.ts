
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
      
      console.log("Fetching single verification with ID:", id);
      
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
        console.error("Error fetching verification:", fetchError);
        throw fetchError;
      }
      
      if (!data) {
        console.log("No verification data found for ID:", id);
        setVerification(null);
        setLoading(false);
        return null;
      }
      
      console.log("Fetched single verification:", data);
      
      // Transform address from JSON to the expected format
      const transformedData = {
        ...data,
        address: parseAddressData(data.address)
      } as ProviderVerification;
      
      setVerification(transformedData);
      return transformedData;
    } catch (err) {
      console.error("Error fetching verification:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch verification details";
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to load verification details. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    verification,
    loading,
    error,
    fetchVerificationById
  };
}
