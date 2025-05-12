
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

export function useProviderVerifications({ status = 'pending', searchTerm = '' }: UseProviderVerificationsProps = {}) {
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
          v.full_name.toLowerCase().includes(term) || 
          v.whatsapp_number.includes(term)
        );
      }
      
      // Transform JSON address to TypeScript interface
      const transformedData = filteredData.map(item => {
        try {
          let addressData;
          
          if (!item.address) {
            addressData = {
              province: "No data",
              city: "No data",
              district: "No data",
              village: "No data", 
              full_address: "Address data not available"
            };
          } else if (typeof item.address === 'string') {
            try {
              addressData = JSON.parse(item.address);
            } catch (parseError) {
              console.error("Error parsing address JSON string for item:", item.id, parseError);
              addressData = {
                province: "Error parsing",
                city: "Error parsing",
                district: "Error parsing",
                village: "Error parsing",
                full_address: "Error parsing address data"
              };
            }
          } else {
            // Address is already an object
            addressData = item.address as AddressDetails;
          }
          
          return {
            ...item,
            address: addressData as AddressDetails
          };
        } catch (parseError) {
          console.error("Error processing address data for item:", item.id, parseError);
          // Provide fallback address structure
          return {
            ...item,
            address: {
              province: "Error parsing address",
              city: "Error parsing address",
              district: "Error parsing address",
              village: "Error parsing address",
              full_address: "Error parsing address data"
            } as AddressDetails
          };
        }
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

  // Handle verification status update
  const updateVerificationStatus = async (id: string, status: VerificationStatus, adminNotes?: string) => {
    try {
      const updates: { status: VerificationStatus; admin_notes?: string } = { status };
      
      if (adminNotes) {
        updates.admin_notes = adminNotes;
      }
      
      const { error: updateError } = await supabase
        .from('provider_verifications')
        .update(updates)
        .eq('id', id);
        
      if (updateError) throw updateError;
      
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
          const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({ is_verified: true, role: 'provider' })
            .eq('id', verificationData.user_id);
            
          if (profileUpdateError) throw profileUpdateError;
        }
      } else if (status === 'rejected') {
        // If rejected, ensure user is not verified
        const { data: verificationData, error: fetchError } = await supabase
          .from('provider_verifications')
          .select('user_id')
          .eq('id', id)
          .single();
          
        if (fetchError) throw fetchError;
        
        // Don't change the user's role, just set is_verified to false
        if (verificationData?.user_id) {
          const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({ is_verified: false })
            .eq('id', verificationData.user_id);
            
          if (profileUpdateError) throw profileUpdateError;
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
        return null;
      }
      
      console.log("Fetched single verification:", data);
      
      // Transform address from JSON to the expected format
      let transformedAddress;
      try {
        if (!data.address) {
          transformedAddress = {
            province: "No data",
            city: "No data",
            district: "No data",
            village: "No data",
            full_address: "Address data not available"
          };
        } else if (typeof data.address === 'string') {
          transformedAddress = JSON.parse(data.address) as AddressDetails;
        } else {
          transformedAddress = data.address as unknown as AddressDetails;
        }
      } catch (parseError) {
        console.error("Error parsing address for verification detail:", parseError);
        transformedAddress = {
          province: "Error parsing",
          city: "Error parsing",
          district: "Error parsing",
          village: "Error parsing",
          full_address: "Error parsing address data"
        } as AddressDetails;
      }
      
      const transformedData = {
        ...data,
        address: transformedAddress
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
