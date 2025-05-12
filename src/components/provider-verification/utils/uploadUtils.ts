
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

export const uploadIdCard = async (
  userId: string, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  try {
    // Now the bucket exists, so we don't need to create it
    // Report initial progress
    if (onProgress) {
      onProgress(10);
    }
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString().substring(2)}.${fileExt}`;
    const filePath = `id_cards/${fileName}`;
    
    // Upload file to the existing 'verifications' bucket
    const { error: uploadError, data } = await supabase.storage
      .from('verifications')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading ID card:', uploadError);
      return { 
        success: false, 
        error: uploadError.message 
      };
    }
    
    if (onProgress) {
      onProgress(90);
    }
    
    // Get public URL
    const { data: publicURLData } = supabase
      .storage
      .from('verifications')
      .getPublicUrl(filePath);
    
    if (onProgress) {
      onProgress(100);
    }
    
    return {
      success: true,
      publicUrl: publicURLData.publicUrl
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error'
    };
  }
};
