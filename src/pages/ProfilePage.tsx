
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';

// Import the refactored components
import UserInfoSection from '@/components/profile/UserInfoSection';
import AccountOptionsSection from '@/components/profile/AccountOptionsSection';
import RoleSwitchDialog from '@/components/profile/RoleSwitchDialog';

const ProfilePage = () => {
  const { user, profile, isAuthenticated, logout, role, switchRole, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(true);

  // Redirect to auth page if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  // Check if the user has a pending verification request
  useEffect(() => {
    const checkPendingVerification = async () => {
      if (!user) return;
      
      try {
        setVerificationLoading(true);
        const { data, error } = await supabase
          .from('provider_verifications')
          .select('status')
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .maybeSingle();
          
        if (error) {
          console.error('Error checking verification status:', error);
        } else {
          setPendingVerification(!!data);
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      } finally {
        setVerificationLoading(false);
      }
    };
    
    checkPendingVerification();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-klikjasa-purple animate-spin" />
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return null; // Will redirect due to useEffect
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRoleSwitch = async (newRole: UserRole) => {
    if (newRole === 'provider' && !profile.is_verified) {
      toast({
        title: 'Verification Required',
        description: 'You need to complete verification to access provider features',
        variant: 'destructive'
      });
      navigate('/provider-verification');
      return;
    }
    
    try {
      await switchRole(newRole);
      setShowRoleDialog(false);
    } catch (error) {
      console.error('Role switch error:', error);
      toast({
        title: 'Error',
        description: 'Failed to switch role. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>
      
      {/* User Info Section */}
      <UserInfoSection 
        profile={profile}
        role={role}
        isVerified={profile.is_verified}
        balance={profile.balance}
        pendingVerification={pendingVerification}
      />
      
      {/* Account Options Section */}
      <AccountOptionsSection 
        isVerified={profile.is_verified}
        role={role}
        pendingVerification={pendingVerification}
        onRoleSwitchClick={() => setShowRoleDialog(true)}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
      
      {/* Role Switch Dialog */}
      <RoleSwitchDialog 
        open={showRoleDialog}
        onOpenChange={setShowRoleDialog}
        currentRole={role}
        onRoleSwitch={handleRoleSwitch}
      />
    </div>
  );
};

export default ProfilePage;
