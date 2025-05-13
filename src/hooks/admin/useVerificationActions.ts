
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VerificationStatus } from './types/verification';

export function useVerificationActions() {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle verification status update
  const updateVerificationStatus = async (id: string, status: VerificationStatus, adminNotes?: string) => {
    try {
      setLoading(status); // Set loading state to the action being performed
      
      // Begin transaction
      const { error: transactionError } = await supabase.rpc('begin_transaction');
      if (transactionError) throw new Error(`Transaction error: ${transactionError.message}`);
      
      // 1. First update the verification record
      const updates: { status: VerificationStatus; admin_notes?: string } = { status };
      
      if (adminNotes) {
        updates.admin_notes = adminNotes;
      }
      
      const { error: updateError } = await supabase
        .from('provider_verifications')
        .update(updates)
        .eq('id', id);
        
      if (updateError) throw new Error(`Update error: ${updateError.message}`);
      
      // 2. Get the user_id from the verification record
      const { data: verificationData, error: fetchError } = await supabase
        .from('provider_verifications')
        .select('user_id, full_name')
        .eq('id', id)
        .single();
          
      if (fetchError) throw new Error(`Fetch error: ${fetchError.message}`);
      
      if (!verificationData?.user_id) {
        throw new Error('User ID not found in verification record');
      }

      // 3. Update the user's profile based on verification status
      if (status === 'approved') {
        // Update user profile to mark them as verified provider
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ 
            is_verified: true, 
            role: 'provider',
            updated_at: new Date().toISOString()
          })
          .eq('id', verificationData.user_id);
            
        if (profileUpdateError) throw new Error(`Profile update error: ${profileUpdateError.message}`);
        
        // 4. Create notification for the user
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: verificationData.user_id,
            type: 'verification_approved',
            title: 'Verification Approved',
            content: 'Your provider verification has been approved. You can now offer services on KlikJasa.',
            data: { verification_id: id }
          });
        
        if (notificationError) throw new Error(`Notification error: ${notificationError.message}`);
      } else if (status === 'rejected') {
        // For rejected status, only update is_verified but don't change their role
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ 
            is_verified: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', verificationData.user_id);
            
        if (profileUpdateError) throw new Error(`Profile update error: ${profileUpdateError.message}`);
        
        // Create rejection notification for the user
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: verificationData.user_id,
            type: 'verification_rejected',
            title: 'Verification Rejected',
            content: 'Your provider verification request has been rejected. Please check the admin notes for details.',
            data: { verification_id: id, admin_notes: adminNotes }
          });
        
        if (notificationError) throw new Error(`Notification error: ${notificationError.message}`);
      }
      
      // Commit transaction
      const { error: commitError } = await supabase.rpc('commit_transaction');
      if (commitError) throw new Error(`Commit error: ${commitError.message}`);
      
      toast({
        title: `Verification ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `${verificationData.full_name}'s verification has been ${status}.`,
        variant: status === 'approved' ? 'default' : 'destructive',
      });
      
      return true;
    } catch (err) {
      // Rollback transaction on error
      await supabase.rpc('rollback_transaction').catch(console.error);
      
      console.error("Error updating verification status:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update verification status. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(null);
    }
  };

  return {
    loading,
    updateVerificationStatus
  };
}
