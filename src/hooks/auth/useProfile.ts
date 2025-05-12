
import { supabase } from '@/integrations/supabase/client';

// Fetch profile data from Supabase
export const fetchProfile = async (userId: string) => {
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
export const updateUserRole = async (userId: string, newRole: 'user' | 'provider' | 'admin') => {
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
