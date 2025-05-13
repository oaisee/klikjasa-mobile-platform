
import { useState, useCallback } from 'react';
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
  const fetchVerificationById = useCallback(async (id: string) => {
    if (!id) {
      setError("Missing verification ID");
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
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
      
      // Ensure the ID card URL is properly formatted
      if (data.id_card_url) {
        try {
          // Check if the URL already contains the full storage URL
          if (!data.id_card_url.includes('storage/v1/object/public/verifications')) {
            const idCardPath = data.id_card_url.startsWith('id_cards/') 
              ? data.id_card_url 
              : `id_cards/${data.id_card_url}`;
              
            // Get public URL for the file
            const { data: urlData } = await supabase
              .storage
              .from('verifications')
              .getPublicUrl(idCardPath);
              
            if (urlData) {
              console.log("Generated public URL for ID card:", urlData.publicUrl);
              data.id_card_url = urlData.publicUrl;
            }
          }
          
          // Log the final URL for debugging
          console.log("Final ID card URL:", data.id_card_url);
        } catch (urlErr) {
          console.error("Error processing ID card URL:", urlErr);
          // Continue with the process even if URL verification fails
        }
      } else {
        console.warn("No ID card URL found in verification data");
      }
      
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
  }, [toast]);

  return {
    verification,
    loading,
    error,
    fetchVerificationById
  };
}
