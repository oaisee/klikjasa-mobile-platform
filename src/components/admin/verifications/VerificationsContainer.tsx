
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import VerificationFilter from '@/components/admin/verifications/VerificationFilter';
import VerificationsList from '@/components/admin/verifications/VerificationsList';
import VerificationPagination from '@/components/admin/verifications/VerificationPagination';
import LoadingState from '@/components/admin/verifications/LoadingState';
import ErrorState from '@/components/admin/verifications/ErrorState';
import EmptyStateMessage from '@/components/admin/verifications/EmptyStateMessage';
import { VerificationStatus, ProviderVerification } from '@/hooks/admin/types/verification';

interface VerificationsContainerProps {
  filter: VerificationStatus | 'all';
  setFilter: (filter: VerificationStatus | 'all') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  verifications: ProviderVerification[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  onQuickApprove: (id: string, name: string) => Promise<void>;
  onQuickReject: (id: string, name: string) => Promise<void>;
}

const VerificationsContainer: React.FC<VerificationsContainerProps> = ({
  filter,
  setFilter,
  searchTerm,
  setSearchTerm,
  verifications,
  loading,
  error,
  currentPage,
  totalPages,
  setCurrentPage,
  onQuickApprove,
  onQuickReject
}) => {
  // Determine if filters are active
  const isFilterActive = filter !== 'all' || searchTerm.trim() !== '';

  return (
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
        ) : verifications.length > 0 ? (
          <>
            <VerificationsList
              verifications={verifications}
              onQuickApprove={onQuickApprove}
              onQuickReject={onQuickReject}
            />

            <VerificationPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </>
        ) : (
          <EmptyStateMessage 
            filterActive={isFilterActive} 
            message={isFilterActive ? "No verification requests match your filters" : "No verification requests found"}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationsContainer;
