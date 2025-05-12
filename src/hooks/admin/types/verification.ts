
export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface AddressDetails {
  province: string;
  city: string;
  district: string;
  village: string;
  full_address: string;
}

export interface ProviderVerification {
  id: string;
  user_id: string;
  full_name: string;
  whatsapp_number: string;
  address: AddressDetails;
  id_card_url: string;
  status: VerificationStatus;
  created_at: string;
  admin_notes?: string;
  profiles?: {
    name: string;
    email: string;
  };
}

export interface UseProviderVerificationsProps {
  status?: VerificationStatus | 'all';
  searchTerm?: string;
}
