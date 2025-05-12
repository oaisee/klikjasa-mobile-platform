
import { updateUserRole, fetchProfile } from './auth/useProfile';
import { login, logout, register } from './auth/useAuthFunctions';
import { useAuthState } from './auth/useAuthState';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';

export const useAuthProvider = () => {
  const { 
    user, 
    profile, 
    session, 
    setProfile, 
    role, 
    setRole, 
    loading 
  } = useAuthState();

  // Switch role function
  const switchRole = async (newRole: UserRole) => {
    if (!user || (newRole === 'provider' && profile && !profile.is_verified)) {
      return;
    }
    
    try {
      await updateUserRole(user.id, newRole);
      
      // Update the local state
      setRole(newRole);
      setProfile(prev => ({
        ...prev,
        role: newRole
      }));
      
      toast({
        title: 'Role Updated',
        description: `You are now using KlikJasa as a ${newRole === 'user' ? 'Customer' : 'Service Provider'}`
      });
    } catch (error) {
      console.error('Error switching role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update role. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Handle registration with profile creation
  const handleRegister = async (email: string, password: string, name: string) => {
    const data = await register(email, password, name);
    
    // Set local state if session exists
    if (data.session) {
      // Profile might not be available immediately due to trigger timing
      setTimeout(async () => {
        if (data.user) {
          const profileData = await fetchProfile(data.user.id);
          if (profileData) {
            setProfile(profileData);
            setRole(profileData.role as UserRole);
          }
        }
      }, 1000); // Give the trigger time to create the profile
    }
  };

  return {
    user,
    profile,
    session,
    isAuthenticated: !!user,
    role,
    loading,
    login,
    register: handleRegister,
    logout,
    switchRole
  };
};
