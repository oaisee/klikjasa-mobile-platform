import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { VerificationStatus } from '@/hooks/admin/types/verification';
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

interface VerificationAdminActionsProps {
  id: string;
  fullName: string;
  status: VerificationStatus;
  initialNotes: string;
  onUpdateStatus: (id: string, status: VerificationStatus, notes?: string) => Promise<boolean>;
}

const VerificationAdminActions: React.FC<VerificationAdminActionsProps> = ({ 
  id, 
  fullName,
  status,
  initialNotes,
  onUpdateStatus
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>(initialNotes || '');
  
  // State for confirmation dialogs
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleApprove = async () => {
    setLoading('approving');
    
    try {
      const success = await onUpdateStatus(id, 'approved', adminNotes);
      
      if (success) {
        toast("Success", {
          description: `${fullName}'s account has been approved successfully.`,
        });
        
        navigate('/admin/verifications');
      }
    } finally {
      setLoading(null);
      setShowApproveDialog(false);
    }
  };

  const handleReject = async () => {
    setLoading('rejecting');
    
    try {
      if (!adminNotes.trim()) {
        toast("Notes Required", {
          description: 'Please provide notes explaining why the verification is being rejected.',
          variant: 'destructive',
        });
        setLoading(null);
        setShowRejectDialog(false);
        return;
      }
      
      const success = await onUpdateStatus(id, 'rejected', adminNotes);
      
      if (success) {
        toast("Verification Rejected", {
          description: `${fullName}'s verification request has been rejected.`,
        });
        
        navigate('/admin/verifications');
      }
    } finally {
      setLoading(null);
      setShowRejectDialog(false);
    }
  };

  return (
    <>
      <h3 className="font-medium mb-4">Admin Notes</h3>
      <Textarea 
        placeholder="Add notes about this verification (required for rejection)"
        className="resize-none mb-4"
        value={adminNotes}
        onChange={(e) => setAdminNotes(e.target.value)}
        rows={4}
      />
      
      {status === 'pending' ? (
        <div className="space-y-3">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => setShowApproveDialog(true)}
            disabled={loading !== null}
          >
            <Check size={18} className="mr-2" /> 
            {loading === 'approving' ? 'Processing...' : 'Approve Verification'}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setShowRejectDialog(true)}
            disabled={loading !== null}
          >
            <X size={18} className="mr-2" /> 
            {loading === 'rejecting' ? 'Processing...' : 'Reject Verification'}
          </Button>
        </div>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-md">
          <p className="text-gray-500 mb-1">
            This verification has already been {status}.
          </p>
          <p className="text-sm text-gray-400">
            No further actions can be taken
          </p>
        </div>
      )}
      
      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Provider Verification</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve {fullName}'s verification request?
              This will grant them provider privileges on the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading === 'approving'}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleApprove();
              }}
              className="bg-green-600 hover:bg-green-700"
              disabled={loading === 'approving'}
            >
              {loading === 'approving' ? 'Processing...' : 'Yes, Approve'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Reject Provider Verification
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject {fullName}'s verification request?
              {!adminNotes.trim() && (
                <p className="mt-2 text-red-500 font-medium">
                  Please provide notes explaining the reason for rejection.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading === 'rejecting'}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleReject();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading === 'rejecting' || !adminNotes.trim()}
            >
              {loading === 'rejecting' ? 'Processing...' : 'Yes, Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VerificationAdminActions;
