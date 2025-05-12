
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
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `id_cards/${fileName}`;

    // If progress callback is provided, set up progress monitoring
    if (onProgress) {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          onProgress(percent);
        }
      });
    }
    
    // Standard upload without progress callback
    const { error: uploadError } = await supabase.storage
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
    
    // Get public URL
    const { data: publicURLData } = supabase
      .storage
      .from('verifications')
      .getPublicUrl(filePath);
    
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
