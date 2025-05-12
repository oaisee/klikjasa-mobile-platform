
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProviderVerification } from '@/hooks/admin/types/verification';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VerificationsListProps {
  verifications: ProviderVerification[];
  onQuickApprove: (id: string, name: string) => Promise<void>;
  onQuickReject: (id: string, name: string) => Promise<void>;
}

const VerificationsList: React.FC<VerificationsListProps> = ({
  verifications,
  onQuickApprove,
  onQuickReject
}) => {
  const navigate = useNavigate();

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

  console.log("Rendering verification list with items:", verifications?.length, verifications);

  // Ensure verifications is an array before rendering
  const safeVerifications = Array.isArray(verifications) ? verifications : [];

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Provider Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {safeVerifications.map((verification) => (
            <TableRow key={verification.id}>
              <TableCell>{verification.full_name || 'Unknown'}</TableCell>
              <TableCell>{verification.whatsapp_number || 'Not provided'}</TableCell>
              <TableCell>{verification.created_at ? new Date(verification.created_at).toLocaleDateString() : 'Unknown'}</TableCell>
              <TableCell>{getStatusBadge(verification.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex space-x-2 justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/admin/verifications/${verification.id}`)}
                    className="h-8"
                  >
                    <Eye size={16} className="mr-1" /> View
                  </Button>
                  
                  {verification.status === 'pending' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8"
                        onClick={() => onQuickApprove(verification.id, verification.full_name || 'Unknown')}
                      >
                        <Check size={16} className="mr-1" /> Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                        onClick={() => onQuickReject(verification.id, verification.full_name || 'Unknown')}
                      >
                        <X size={16} className="mr-1" /> Reject
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VerificationsList;
