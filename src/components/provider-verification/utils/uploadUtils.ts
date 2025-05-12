
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
    // Report initial progress
    if (onProgress) {
      onProgress(10);
    }
    
    // Check if the bucket exists first
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    if (bucketsError) {
      console.error('Error checking buckets:', bucketsError);
      return {
        success: false,
        error: bucketsError.message
      };
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'verifications');
    
    if (!bucketExists) {
      console.error('Verifications bucket does not exist');
      return {
        success: false,
        error: 'Storage bucket not configured. Please contact an administrator.'
      };
    }
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString().substring(2)}.${fileExt}`;
    const filePath = `id_cards/${fileName}`;
    
    console.log('Uploading file to:', filePath);
    
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
