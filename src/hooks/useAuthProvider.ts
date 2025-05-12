
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

  // Wrap the login function to match our type definition
  const handleLogin = async (email: string, password: string) => {
    try {
      console.log("Attempting login with email:", email);
      const data = await login(email, password);
      console.log("Login successful, user:", data.user?.id);
      
      // Special case for admin@klikjasa.com - set role to admin explicitly
      if (email === 'admin@klikjasa.com' && data.user) {
        console.log("Admin login detected, setting role to admin");
        // Update role in database and local state
        await updateUserRole(data.user.id, 'admin');
        setRole('admin');
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

  return {
    user,
    profile,
    session,
    isAuthenticated: !!user,
    role,
    loading,
    login: handleLogin,
    register: handleRegister,
    logout,
    switchRole
  };
};
