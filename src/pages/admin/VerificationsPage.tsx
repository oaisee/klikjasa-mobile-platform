
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { 
  VerificationStatus,
  useProviderVerifications
} from '@/hooks/admin/useProviderVerifications';
import VerificationsContainer from '@/components/admin/verifications/VerificationsContainer';
import { usePagination } from '@/hooks/admin/usePagination';

const VerificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<VerificationStatus | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const { toast } = useToast();

  const { 
    verifications, 
    loading, 
    error, 
    refetch,
    updateVerificationStatus
  } = useProviderVerifications({ status: filter, searchTerm });

  // Use the pagination hook
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedVerifications
  } = usePagination({
    items: verifications,
    itemsPerPage
  });

  // Add effect to log when verification data changes
  useEffect(() => {
    console.log("Verification data updated:", {
      total: verifications?.length || 0,
      filter,
      searchTerm,
      hasError: !!error,
      isLoading: loading
    });
  }, [verifications, filter, searchTerm, error, loading]);

  const handleQuickApprove = async (id: string, name: string) => {
    const success = await updateVerificationStatus(id, 'approved');
    
    if (success) {
      toast({
        title: 'Verification Approved',
        description: `${name}'s verification request has been approved successfully.`,
      });
      refetch();
    }
  };

  const handleQuickReject = async (id: string, name: string) => {
    const success = await updateVerificationStatus(id, 'rejected');
    
    if (success) {
      toast({
        title: 'Verification Rejected',
        description: `${name}'s verification request has been rejected.`,
      });
      refetch();
    }
  };

  return (
    <AdminLayout title="Provider Verifications">
      <VerificationsContainer
        filter={filter}
        setFilter={setFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        verifications={paginatedVerifications}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        onQuickApprove={handleQuickApprove}
        onQuickReject={handleQuickReject}
      />
    </AdminLayout>
  );
};

export default VerificationsPage;
