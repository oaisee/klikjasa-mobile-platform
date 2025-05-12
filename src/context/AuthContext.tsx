
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  session: Session | null;
  isAuthenticated: boolean;
  role: UserRole;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch profile data from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };
  
  // Update user's role in the database
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('Error updating role:', error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Defer fetching profile to avoid potential deadlock
              setTimeout(async () => {
                const profileData = await fetchProfile(session.user.id);
                setProfile(profileData);
                if (profileData) {
                  setRole(profileData.role as UserRole);
                }
              }, 0);
            } else {
              setProfile(null);
              setRole('user');
            }
          }
        );

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          if (profileData) {
            setRole(profileData.role as UserRole);
          }
        }

        setLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      return;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function - modified to rely on database trigger for profile creation
  const register = async (email: string, password: string, name: string) => {
    try {
      // Step 1: Sign up the user with metadata for the database trigger
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('User creation failed');
      }
      
      // The profile will be created automatically via a database trigger
      // No need to manually create it here which was causing permission errors
      
      // Set local state if session exists
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        
        // Profile might not be available immediately due to trigger timing
        setTimeout(async () => {
          const profileData = await fetchProfile(data.user!.id);
          if (profileData) {
            setProfile(profileData);
            setRole(profileData.role as UserRole);
          }
        }, 1000); // Give the trigger time to create the profile
      }

      return;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      setUser(null);
      setProfile(null);
      setSession(null);
      setRole('user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

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

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAuthenticated: !!user,
        role,
        loading,
        login,
        register,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
