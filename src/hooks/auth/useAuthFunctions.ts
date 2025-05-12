
import { supabase } from '@/integrations/supabase/client';
import { fetchProfile } from './useProfile';

// Login function
export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

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
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
