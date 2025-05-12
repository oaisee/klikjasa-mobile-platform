
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProviderVerification, UseProviderVerificationsProps } from './types/verification';
import { parseAddressData } from './utils/addressParser';

export function useFetchVerifications({ status = 'pending', searchTerm = '' }: UseProviderVerificationsProps = {}) {
  const [verifications, setVerifications] = useState<ProviderVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all provider verifications
  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching verifications with status:", status, "search term:", searchTerm);
      
      let query = supabase
        .from('provider_verifications')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Filter by status if provided and not 'all'
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) {
        console.error("Error fetching verifications:", fetchError);
        throw fetchError;
      }
      
      console.log("Fetched verification data:", data?.length || 0, "records", data);
      
      // Process the data with filtering by search term
      let filteredData = data || [];
      
      if (searchTerm && searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase().trim();
        filteredData = filteredData.filter(v => 
          v.full_name?.toLowerCase().includes(term) || 
          v.whatsapp_number?.includes(term)
        );
      }
      
      // Transform the data with address parsing
      const transformedData = filteredData.map(item => {
        return {
          ...item,
          address: parseAddressData(item.address)
        };
      });
      
      setVerifications(transformedData as ProviderVerification[]);
    } catch (err) {
      console.error("Error fetching verifications:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch verification requests");
      toast({
        title: "Error",
        description: "Failed to load verification requests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch verifications on component mount and when dependencies change
  useEffect(() => {
    fetchVerifications();
  }, [status, searchTerm]);

  return {
    verifications,
    loading,
    error,
    refetch: fetchVerifications
  };
}
