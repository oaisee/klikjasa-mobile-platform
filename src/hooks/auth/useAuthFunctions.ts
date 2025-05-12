
import { supabase } from '@/integrations/supabase/client';
import { fetchProfile } from './useProfile';

// Login function
export const login = async (email: string, password: string) => {
  try {
    console.log(`Attempting login for: ${email}`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }

    console.log('Login successful for:', email);
    
    return {
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register function - modified to rely on database trigger for profile creation
export const register = async (email: string, password: string, name: string) => {
  try {
    console.log(`Attempting to register: ${email} with name: ${name}`);
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
      console.error('Registration error:', error);
      throw new Error(error.message);
    }

    if (!data.user) {
      console.error('User creation failed');
      throw new Error('User creation failed');
    }
    
    console.log('Registration successful for:', email);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout function - Improved to handle missing sessions better
export const logout = async () => {
  try {
    console.log('Attempting to log out user');
    
    // Check if we have a valid session before attempting to sign out
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return false;
    }
    
    if (!session) {
      console.log('No active session found, clearing local state only');
      return true; 
    }
    
    console.log('Active session found, logging out from Supabase');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error during logout:', error);
      throw new Error(error.message);
    }
    
    console.log('Logout successful');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    // Don't throw here, just return false to prevent UI crashes
    return false;
  }
};
