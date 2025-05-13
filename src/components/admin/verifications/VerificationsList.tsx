
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Eye, AlertTriangle } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  
  // State for confirmation dialogs
  const [confirmAction, setConfirmAction] = useState<null | {
    id: string;
    name: string;
    type: 'approve' | 'reject';
  }>(null);

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

  // Safe check for verifications array
  const safeVerifications = Array.isArray(verifications) ? verifications : [];

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    
    try {
      if (confirmAction.type === 'approve') {
        await onQuickApprove(confirmAction.id, confirmAction.name);
      } else {
        await onQuickReject(confirmAction.id, confirmAction.name);
      }
    } finally {
      setConfirmAction(null);
    }
  };

  return (
    <>
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
            {safeVerifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  No verification requests found
                </TableCell>
              </TableRow>
            ) : (
              safeVerifications.map((verification) => (
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
                            onClick={() => setConfirmAction({
                              id: verification.id,
                              name: verification.full_name || 'Unknown',
                              type: 'approve'
                            })}
                          >
                            <Check size={16} className="mr-1" /> Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                            onClick={() => setConfirmAction({
                              id: verification.id,
                              name: verification.full_name || 'Unknown',
                              type: 'reject'
                            })}
                          >
                            <X size={16} className="mr-1" /> Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {confirmAction?.type === 'reject' && <AlertTriangle className="h-5 w-5 text-red-500" />}
              {confirmAction?.type === 'approve' ? 'Approve' : 'Reject'} Verification
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmAction?.type === 'approve' ? 'approve' : 'reject'} the verification request for{' '}
              <span className="font-medium">{confirmAction?.name}</span>?
              
              {confirmAction?.type === 'reject' && (
                <p className="mt-2 text-red-500">
                  Note: Quick rejections don't include admin notes. For detailed rejection with notes, please use the view details page.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={confirmAction?.type === 'approve' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              Yes, {confirmAction?.type === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VerificationsList;
