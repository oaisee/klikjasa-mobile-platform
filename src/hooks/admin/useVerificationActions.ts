
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
      const updates: { status: VerificationStatus; admin_notes?: string } = { status };
      
      if (adminNotes) {
        updates.admin_notes = adminNotes;
      }
      
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
      
      return true;
    } catch (err) {
      console.error("Error updating verification status:", err);
      toast({
        title: "Error",
        description: "Failed to update verification status. Please try again.",
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
