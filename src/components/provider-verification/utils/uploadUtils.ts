
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
    // Skip bucket creation as it requires admin privileges
    // Instead, directly try to upload to the bucket
    // The bucket should be created via SQL migrations by the project admin
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString().substring(2)}.${fileExt}`;
    const filePath = `id_cards/${fileName}`;

    // If progress callback is provided, set up progress monitoring
    if (onProgress) {
      onProgress(10); // Initial progress indication
    }
    
    // Standard upload
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
      onProgress(90); // Almost complete
    }
    
    // Get public URL
    const { data: publicURLData } = supabase
      .storage
      .from('verifications')
      .getPublicUrl(filePath);
    
    if (onProgress) {
      onProgress(100); // Complete
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
