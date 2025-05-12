
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Edit3, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

interface UserInfoSectionProps {
  profile: any;
  role: string;
  isVerified: boolean;
  balance: number;
  pendingVerification: boolean;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  profile,
  role,
  isVerified,
  balance,
  pendingVerification,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white mt-3 p-5">
      <div className="flex items-center">
        <div className="h-16 w-16 rounded-full bg-klikjasa-cream flex items-center justify-center">
          <UserIcon className="h-8 w-8 text-klikjasa-deepPurple" />
        </div>
        <div className="ml-4">
          <h2 className="font-semibold text-lg">{profile.name}</h2>
          <p className="text-gray-600 text-sm">{profile.email}</p>
          <div className="flex items-center mt-1 flex-wrap gap-1">
            <span className={`text-xs px-2 py-1 rounded-full ${
              role === 'user' ? 'bg-klikjasa-cream text-klikjasa-deepPurple' : 
              role === 'provider' ? 'bg-klikjasa-purple text-white' :
              'bg-red-100 text-red-800'
            }`}>
              {role === 'user' ? 'Customer' : role === 'provider' ? 'Service Provider' : 'Admin'}
            </span>
            {isVerified && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </span>
            )}
            {pendingVerification && !isVerified && (
              <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Verification Pending
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-5 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Balance</p>
            <p className="text-xl font-semibold">{formatCurrency(balance || 0)}</p>
          </div>
          <Button 
            variant="outline" 
            className="text-klikjasa-purple border-klikjasa-purple"
            onClick={() => navigate('/topup')}
          >
            Top Up
          </Button>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full mt-4 flex justify-center items-center"
        onClick={() => navigate('/edit-profile')}
      >
        <Edit3 className="h-4 w-4 mr-2" />
        Edit Profile
      </Button>
    </div>
  );
};

export default UserInfoSection;
