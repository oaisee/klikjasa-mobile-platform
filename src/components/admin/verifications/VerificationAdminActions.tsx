
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { VerificationStatus } from '@/hooks/admin/types/verification';

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
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>(initialNotes || '');

  const handleApprove = async () => {
    setLoading('approving');
    
    try {
      const success = await onUpdateStatus(id, 'approved', adminNotes);
      
      if (success) {
        toast({
          title: 'Verification Approved',
          description: `${fullName}'s account has been approved successfully.`,
        });
        
        navigate('/admin/verifications');
      }
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async () => {
    setLoading('rejecting');
    
    try {
      const success = await onUpdateStatus(id, 'rejected', adminNotes);
      
      if (success) {
        toast({
          title: 'Verification Rejected',
          description: `${fullName}'s verification request has been rejected.`,
        });
        
        navigate('/admin/verifications');
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <h3 className="font-medium mb-4">Admin Notes</h3>
      <Textarea 
        placeholder="Add notes about this verification (optional)"
        className="resize-none mb-4"
        value={adminNotes}
        onChange={(e) => setAdminNotes(e.target.value)}
        rows={4}
      />
      
      {status === 'pending' ? (
        <div className="space-y-3">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
            disabled={loading !== null}
          >
            <Check size={18} className="mr-2" /> 
            {loading === 'approving' ? 'Processing...' : 'Approve Verification'}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleReject}
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
    </>
  );
};

export default VerificationAdminActions;
