
import { updateUserRole, fetchProfile } from './auth/useProfile';
import { login as authLogin, logout as authLogout, register } from './auth/useAuthFunctions';
import { useAuthState } from './auth/useAuthState';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

export const useAuthProvider = () => {
  const { 
    user, 
    profile, 
    session, 
    setProfile, 
    setRole, 
    role,
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
        description: `You are now using KlikJasa as a ${newRole === 'user' ? 'Customer' : newRole === 'provider' ? 'Service Provider' : 'Admin'}`
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
    await register(email, password, name);
  };

  // Enhanced login function with improved admin handling
  const handleLogin = async (email: string, password: string) => {
    try {
      console.log("Attempting login with email:", email);
      const data = await authLogin(email, password);
      console.log("Login successful, user:", data.user?.id);
      
      // Special handling for admin@klikjasa.com
      if (email === 'admin@klikjasa.com' && data.user) {
        console.log("Admin login detected, setting role to admin immediately");
        
        // Set role in the local state immediately - FIX: Use the UserRole type explicitly 
        setRole('admin' as UserRole);
        
        // Update profile in memory immediately
        setProfile(prev => ({
          ...prev,
          role: 'admin'
        }));
        
        // Update role in database immediately to ensure consistent state
        try {
          await updateUserRole(data.user.id, 'admin');
          console.log("Admin role updated in database");
        } catch (err) {
          console.error("Error updating admin role:", err);
        }
      } else if (data.user) {
        // For non-admin users, fetch the profile to get the role
        try {
          const profileData = await fetchProfile(data.user.id);
          if (profileData) {
            setProfile(profileData);
            // Fix: Cast the role string to UserRole type
            setRole((profileData.role || 'user') as UserRole);
          }
        } catch (err) {
          console.error("Error fetching profile after login:", err);
          // Default to user role if profile fetch fails
          setRole('user' as UserRole);
        }
      }
      
      return { 
        user: data.user, 
        session: data.session 
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  // Enhanced logout function
  const handleLogout = async () => {
    try {
      console.log("Attempting logout");
      const success = await authLogout();
      
      if (success) {
        // Clear local state regardless of logout result
        setRole('user' as UserRole);
        setProfile(null);
      }
      
      return success;
    } catch (error) {
      console.error("Logout error in provider:", error);
      // Clear local state on error anyway
      setRole('user' as UserRole);
      setProfile(null);
      return false;
    }
  };

  return {
    user,
    profile,
    session,
    isAuthenticated: !!user,
    role,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    switchRole
  };
};
