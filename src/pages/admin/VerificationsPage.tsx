
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  useProviderVerifications, 
  VerificationStatus 
} from '@/hooks/admin/useProviderVerifications';

// Import our components
import VerificationFilter from '@/components/admin/verifications/VerificationFilter';
import VerificationsList from '@/components/admin/verifications/VerificationsList';
import VerificationPagination from '@/components/admin/verifications/VerificationPagination';
import LoadingState from '@/components/admin/verifications/LoadingState';
import ErrorState from '@/components/admin/verifications/ErrorState';

const VerificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<VerificationStatus | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Use our custom hook to fetch verifications
  const { 
    verifications, 
    loading, 
    error, 
    updateVerificationStatus,
    refetch
  } = useProviderVerifications({ status: filter, searchTerm });

  // Effect to load initial data
  useEffect(() => {
    console.log("VerificationsPage mounted, filter:", filter, "searchTerm:", searchTerm);
    // Reset to page 1 when filter or search changes
    setCurrentPage(1);
  }, [filter, searchTerm]);

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
