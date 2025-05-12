
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchProfile } from './useProfile';
import { UserRole } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>('user'); // Always initialize with 'user'
  const [loading, setLoading] = useState<boolean>(true);

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
                if (profileData && profileData.role) {
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
          if (profileData && profileData.role) {
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

  return {
    user,
    profile,
    session,
    setProfile,
    setRole,
    role,
    loading
  };
};
