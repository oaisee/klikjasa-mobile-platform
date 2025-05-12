
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchProfile } from './useProfile';
import { UserRole } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state");
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log("Auth state changed:", event, "User:", newSession?.user?.email);
            
            if (event === 'SIGNED_OUT') {
              console.log("User signed out, clearing state");
              setUser(null);
              setSession(null);
              setProfile(null);
              setRole('user');
              return;
            }
            
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            if (newSession?.user) {
              // Special handling for admin user - IMMEDIATELY set role to admin
              if (newSession.user.email === 'admin@klikjasa.com') {
                console.log("Setting role to admin for admin@klikjasa.com");
                setRole('admin' as UserRole);
              }
              
              // Defer profile fetching to avoid potential deadlock
              setTimeout(async () => {
                try {
                  const profileData = await fetchProfile(newSession.user.id);
                  console.log("Fetched profile data:", profileData);
                  
                  if (profileData) {
                    setProfile(profileData);
                    
                    if (newSession.user.email === 'admin@klikjasa.com') {
                      // Ensure admin user always has admin role
                      setRole('admin' as UserRole);
                      
                      // Update database role for admin if needed
                      try {
                        await updateAdminRoleIfNeeded(newSession.user.id);
                      } catch (err) {
                        console.error("Error updating admin role:", err);
                      }
                    } else if (profileData && profileData.role) {
                      console.log("Setting role from profile:", profileData.role);
                      setRole(profileData.role as UserRole);
                    } else {
                      // Ensure default role is set if profile has no role
                      console.log("No role in profile, setting default user role");
                      setRole('user' as UserRole);
                    }
                  } else {
                    // If no profile exists yet, set default role
                    console.log("No profile found, setting default user role");
                    setRole('user' as UserRole);
                  }
                } catch (err) {
                  console.error("Error fetching profile:", err);
                  // Default to user role on error
                  setRole('user' as UserRole);
                }
              }, 0);
            } else {
              setProfile(null);
              setRole('user');
            }
          }
        );

        // Check for existing session
        const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
        }
        
        console.log("Initial session check:", existingSession?.user?.email);
        
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        
        if (existingSession?.user) {
          // Special handling for admin user - IMMEDIATELY set role to admin
          if (existingSession.user.email === 'admin@klikjasa.com') {
            console.log("Setting initial role to admin for admin@klikjasa.com");
            setRole('admin' as UserRole);
          }
          
          try {
            const profileData = await fetchProfile(existingSession.user.id);
            console.log("Initial profile data:", profileData);
            
            if (profileData) {
              setProfile(profileData);
              
              if (existingSession.user.email === 'admin@klikjasa.com') {
                // Ensure admin user always has admin role
                setRole('admin' as UserRole);
                
                // Update database role for admin if needed
                try {
                  await updateAdminRoleIfNeeded(existingSession.user.id);
                } catch (err) {
                  console.error("Error updating admin role:", err);
                }
              } else if (profileData && profileData.role) {
                console.log("Setting initial role from profile:", profileData.role);
                setRole(profileData.role as UserRole);
              } else {
                // Ensure default role is set if profile has no role
                console.log("No role in profile, setting default user role");
                setRole('user' as UserRole);
              }
            } else {
              // If no profile exists yet, set default role
              console.log("No profile found, setting default user role");
              setRole('user' as UserRole);
            }
          } catch (err) {
            console.error("Error fetching initial profile:", err);
            // Default to user role on error
            setRole('user' as UserRole);
          }
        }

        // Auth initialization is complete
        setInitialized(true);
        setLoading(false);
        
        return () => {
          console.log("Unsubscribing from auth state changes");
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);
  
  // Helper function to update admin role if needed
  const updateAdminRoleIfNeeded = async (userId: string) => {
    console.log("Ensuring admin role in database for:", userId);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error("Error checking admin role:", profileError);
        return;
      }
      
      if (!profileData || profileData.role !== 'admin') {
        console.log("Updating admin role in database");
        const { error } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', userId);
          
        if (error) {
          console.error("Error updating admin role:", error);
        } else {
          console.log("Admin role updated successfully");
        }
      } else {
        console.log("User already has admin role in database");
      }
    } catch (err) {
      console.error("Error in role update transaction:", err);
    }
  };

  return {
    user,
    profile,
    session,
    setProfile,
    setRole,
    role,
    loading,
    initialized
  };
};
