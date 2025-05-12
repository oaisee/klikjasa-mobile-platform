
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProviderVerification } from '@/hooks/admin/types/verification';

interface VerificationHeaderProps {
  verification: ProviderVerification;
}

const VerificationHeader: React.FC<VerificationHeaderProps> = ({ verification }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold">{verification.full_name}</h2>
        <p className="text-gray-500">{(verification as any).profiles?.email || "No email available"}</p>
      </div>
      {getStatusBadge(verification.status)}
    </div>
  );
};

export default VerificationHeader;
