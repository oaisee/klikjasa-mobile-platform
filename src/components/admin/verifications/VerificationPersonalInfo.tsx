
import React from 'react';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { ProviderVerification } from '@/hooks/admin/types/verification';

interface VerificationPersonalInfoProps {
  verification: ProviderVerification;
}

const VerificationPersonalInfo: React.FC<VerificationPersonalInfoProps> = ({ verification }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <Phone size={18} className="mr-3 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">WhatsApp Number</p>
            <p>{verification.whatsapp_number}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Mail size={18} className="mr-3 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p>{(verification as any).profiles?.email || "No email available"}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Clock size={18} className="mr-3 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Submitted Date</p>
            <p>{new Date(verification.created_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-start">
          <MapPin size={18} className="mr-3 mt-1 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p>{verification.address?.full_address || "Address not provided"}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-xs text-gray-500">Province</p>
                <p className="text-sm">{verification.address?.province || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">City</p>
                <p className="text-sm">{verification.address?.city || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">District</p>
                <p className="text-sm">{verification.address?.district || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Village</p>
                <p className="text-sm">{verification.address?.village || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPersonalInfo;
