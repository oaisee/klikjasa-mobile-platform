
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface AddressDetails {
  province: string;
  city: string;
  district: string;
  village: string;
  full_address: string;
}

export interface ProviderVerification {
  id: string;
  user_id: string;
  full_name: string;
  whatsapp_number: string;
  address: AddressDetails;
  id_card_url: string;
  status: VerificationStatus;
  created_at: string;
  admin_notes?: string;
  profiles?: {
    name: string;
    email: string;
  };
}

interface UseProviderVerificationsProps {
  status?: VerificationStatus | 'all';
  searchTerm?: string;
}

export function useProviderVerifications({ status, searchTerm }: UseProviderVerificationsProps = {}) {
  const [verifications, setVerifications] = useState<ProviderVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch all provider verifications
  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
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

      // Filter by status if provided
      if (status && status !== 'all') {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process the data with filtering by search term
      let filteredData = data || [];
      
      if (searchTerm && searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase().trim();
        filteredData = filteredData.filter(v => 
          v.full_name.toLowerCase().includes(term) || 
          v.whatsapp_number.includes(term)
        );
      }
      
      // Transform JSON address to TypeScript interface
      const transformedData = filteredData.map(item => ({
        ...item,
        address: item.address as unknown as AddressDetails
      }));
      
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

  // Handle verification status update
  const updateVerificationStatus = async (id: string, status: VerificationStatus, adminNotes?: string) => {
    try {
      const updates: { status: VerificationStatus; admin_notes?: string } = { status };
      
      if (adminNotes) {
        updates.admin_notes = adminNotes;
      }
      
      const { error } = await supabase
        .from('provider_verifications')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      // If approved, update the user's profile to mark them as verified
      if (status === 'approved') {
        // First get the user_id from the verification record
        const { data: verificationData, error: fetchError } = await supabase
          .from('provider_verifications')
          .select('user_id')
          .eq('id', id)
          .single();
          
        if (fetchError) throw fetchError;
        
        // Then update the user's profile
        if (verificationData?.user_id) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_verified: true })
            .eq('id', verificationData.user_id);
            
          if (updateError) throw updateError;
        }
      }
      
      // Refresh the data
      await fetchVerifications();
      
      return true;
    } catch (err) {
      console.error("Error updating verification status:", err);
      toast({
        title: "Error",
        description: "Failed to update verification status. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Fetch a single verification by ID
  const fetchVerificationById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
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
        
      if (error) throw error;
      
      // Transform address from JSON to the expected format
      const transformedData = {
        ...data,
        address: data.address as unknown as AddressDetails
      } as ProviderVerification;
      
      return transformedData;
    } catch (err) {
      console.error("Error fetching verification:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch verification details");
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

  // Fetch verifications on component mount and when dependencies change
  useEffect(() => {
    fetchVerifications();
  }, [status, searchTerm]);

  return {
    verifications,
    loading,
    error,
    updateVerificationStatus,
    fetchVerificationById,
    refetch: fetchVerifications
  };
}
