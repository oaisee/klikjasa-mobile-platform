
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
            console.log("Auth state changed:", event, "User:", session?.user?.email);
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user) {
              // Special handling for admin user
              if (session.user.email === 'admin@klikjasa.com') {
                console.log("Setting role to admin for admin@klikjasa.com");
                setRole('admin');
              }
              
              // Defer fetching profile to avoid potential deadlock
              setTimeout(async () => {
                try {
                  const profileData = await fetchProfile(session.user.id);
                  console.log("Fetched profile data:", profileData);
                  setProfile(profileData);
                  
                  if (profileData && profileData.role) {
                    console.log("Setting role from profile:", profileData.role);
                    setRole(profileData.role as UserRole);
                  } else if (session.user.email === 'admin@klikjasa.com') {
                    // Ensure admin user always has admin role
                    console.log("Ensuring admin role for admin@klikjasa.com");
                    setRole('admin');
                  }
                } catch (err) {
                  console.error("Error fetching profile:", err);
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
        console.log("Initial session check:", session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Special handling for admin user
          if (session.user.email === 'admin@klikjasa.com') {
            console.log("Setting initial role to admin for admin@klikjasa.com");
            setRole('admin');
          }
          
          const profileData = await fetchProfile(session.user.id);
          console.log("Initial profile data:", profileData);
          setProfile(profileData);
          
          if (profileData && profileData.role) {
            console.log("Setting initial role from profile:", profileData.role);
            setRole(profileData.role as UserRole);
          } else if (session.user.email === 'admin@klikjasa.com') {
            // Ensure admin user always has admin role
            console.log("Ensuring initial admin role for admin@klikjasa.com");
            setRole('admin');
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
