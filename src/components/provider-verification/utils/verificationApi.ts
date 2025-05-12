
import { supabase } from '@/integrations/supabase/client';

interface AddressData {
  province: string;
  city: string;
  district: string;
  village: string;
  full_address: string;
}

interface VerificationRequestData {
  userId: string;
  fullName: string;
  whatsappNumber: string;
  address: AddressData;
  idCardUrl: string;
}

interface VerificationResult {
  success: boolean;
  error?: string;
}

export const submitVerificationRequest = async (
  data: VerificationRequestData
): Promise<VerificationResult> => {
  try {
    const { error } = await supabase
      .from('provider_verifications')
      .insert({
        user_id: data.userId,
        full_name: data.fullName,
        whatsapp_number: data.whatsappNumber,
        address: data.address,
        id_card_url: data.idCardUrl
      });

    if (error) {
      console.error('Error submitting verification:', error);
      return {
        success: false,
        error: error.message
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Verification API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
