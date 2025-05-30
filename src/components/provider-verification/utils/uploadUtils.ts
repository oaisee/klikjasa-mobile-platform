
import { supabase } from '@/integrations/supabase/client';

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
    // Report initial progress
    if (onProgress) {
      onProgress(10);
    }
    
    // Check file size and type
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      };
    }

    // Verify file is an image
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Only image files are allowed.'
      };
    }
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `id_cards/${fileName}`;
    
    console.log('Attempting to upload file to path:', filePath);
    
    // Upload file to the 'verifications' bucket
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
    
    console.log('Upload successful, public URL:', publicURLData.publicUrl);
    
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
