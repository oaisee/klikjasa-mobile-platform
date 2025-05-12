
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  VerificationStatus,
  ProviderVerification
} from '@/hooks/admin/useProviderVerifications';

// Import our components
import VerificationFilter from '@/components/admin/verifications/VerificationFilter';
import VerificationsList from '@/components/admin/verifications/VerificationsList';
import VerificationPagination from '@/components/admin/verifications/VerificationPagination';
import LoadingState from '@/components/admin/verifications/LoadingState';
import ErrorState from '@/components/admin/verifications/ErrorState';

const VerificationsPage: React.FC = () => {
  const [verifications, setVerifications] = useState<ProviderVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<VerificationStatus | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching verifications with status:", filter, "search term:", searchTerm);
      
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
      if (filter && filter !== 'all') {
        query = query.eq('status', filter);
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
          (v.full_name && v.full_name.toLowerCase().includes(term)) || 
          (v.whatsapp_number && v.whatsapp_number.includes(term))
        );
      }
      
      // Transform JSON address to TypeScript interface
      const transformedData = filteredData.map(item => {
        try {
          const addressData = typeof item.address === 'string' 
            ? JSON.parse(item.address) 
            : item.address;
          
          return {
            ...item,
            address: addressData
          };
        } catch (parseError) {
          console.error("Error parsing address data for item:", item.id, parseError);
          // Provide fallback address structure
          return {
            ...item,
            address: {
              province: "Error parsing address",
              city: "Error parsing address",
              district: "Error parsing address",
              village: "Error parsing address",
              full_address: "Error parsing address data"
            }
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

  const updateVerificationStatus = async (id: string, status: VerificationStatus) => {
    try {
      const updates = { status };
      
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

  // Effect to load initial data and reset pagination
  useEffect(() => {
    console.log("VerificationsPage filter/search changed:", filter, "searchTerm:", searchTerm);
    // Reset to page 1 when filter or search changes
    setCurrentPage(1);
    fetchVerifications();
  }, [filter, searchTerm]);

  // Force a re-fetch of data when component mounts
  useEffect(() => {
    console.log("VerificationsPage mounted, fetching initial data...");
    fetchVerifications();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil((verifications?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVerifications = verifications?.slice(startIndex, startIndex + itemsPerPage) || [];

  console.log("Verification data in page:", {
    total: verifications?.length || 0,
    currentPage,
    totalPages,
    paginatedItems: paginatedVerifications.length,
    hasError: !!error,
    isLoading: loading
  });

  const handleQuickApprove = async (id: string, name: string) => {
    const success = await updateVerificationStatus(id, 'approved');
    
    if (success) {
      toast({
        title: 'Verification Approved',
        description: `${name}'s verification request has been approved successfully.`,
      });
    }
  };

  const handleQuickReject = async (id: string, name: string) => {
    const success = await updateVerificationStatus(id, 'rejected');
    
    if (success) {
      toast({
        title: 'Verification Rejected',
        description: `${name}'s verification request has been rejected.`,
      });
    }
  };

  return (
    <AdminLayout title="Provider Verifications">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-sm text-gray-500 mb-6">
            <p>Review and manage provider verification requests. Approve or reject applications after reviewing their credentials and identification documents.</p>
          </div>
          <Separator className="mb-6" />
          
          <VerificationFilter
            filter={filter}
            setFilter={setFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} />
          ) : (
            <>
              <VerificationsList
                verifications={paginatedVerifications}
                onQuickApprove={handleQuickApprove}
                onQuickReject={handleQuickReject}
              />

              <VerificationPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default VerificationsPage;
