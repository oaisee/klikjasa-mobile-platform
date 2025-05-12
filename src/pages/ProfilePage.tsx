
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';

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
  
  // Use the new verification status hook
  const { pendingVerification, verificationLoading } = useVerificationStatus({
    userId: user?.id
  });

  // Redirect to auth page if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading || verificationLoading) {
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
