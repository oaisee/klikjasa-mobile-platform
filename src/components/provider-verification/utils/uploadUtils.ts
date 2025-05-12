
import { supabase } from '@/integrations/supabase/client';

interface UploadResult {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

// Function to create the verifications bucket if it doesn't exist
const ensureVerificationsBucketExists = async (): Promise<boolean> => {
  try {
    // First check if bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    const verificationsBucketExists = buckets?.some(bucket => bucket.name === 'verifications');
    
    if (!verificationsBucketExists) {
      // Create the bucket if it doesn't exist
      const { error: createError } = await supabase
        .storage
        .createBucket('verifications', { 
          public: true // Make the bucket public so we can access the images
        });
        
      if (createError) {
        console.error('Error creating verifications bucket:', createError);
        return false;
      }
      
      console.log('Created verifications bucket successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring verifications bucket exists:', error);
    return false;
  }
};

export const uploadIdCard = async (
  userId: string, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  try {
    // Ensure the bucket exists before uploading
    const bucketExists = await ensureVerificationsBucketExists();
    if (!bucketExists) {
      return {
        success: false,
        error: 'Failed to ensure verifications bucket exists'
      };
    }
    
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
