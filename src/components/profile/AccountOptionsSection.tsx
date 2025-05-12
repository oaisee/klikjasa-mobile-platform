
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRightLeft, 
  Shield, 
  Wallet, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Clock
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface AccountOptionsSectionProps {
  isVerified: boolean;
  role: string;
  pendingVerification: boolean;
  onRoleSwitchClick: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

const AccountOptionsSection: React.FC<AccountOptionsSectionProps> = ({
  isVerified,
  role,
  pendingVerification,
  onRoleSwitchClick,
  onLogout,
  isLoggingOut
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  return (
    <div className="bg-white mt-3 p-5">
      <h3 className="font-semibold mb-3">Account</h3>
      
      {/* Role Switching Option */}
      {isVerified && (
        <>
          <button 
            className="w-full flex justify-between items-center py-3"
            onClick={onRoleSwitchClick}
          >
            <div className="flex items-center">
              <ArrowRightLeft className="h-5 w-5 text-gray-600" />
              <span className="ml-3">Switch to {role === 'user' ? 'Provider Mode' : 'Customer Mode'}</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
          <Separator />
        </>
      )}
      
      {/* Provider Verification Option */}
      {!isVerified && role === 'user' && !pendingVerification && (
        <>
          <button 
            className="w-full flex justify-between items-center py-3"
            onClick={() => navigate('/provider-verification')}
          >
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-600" />
              <span className="ml-3">Become a Service Provider</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
          <Separator />
        </>
      )}
      
      {/* Pending Verification Status */}
      {!isVerified && pendingVerification && (
        <>
          <div className="w-full flex justify-between items-center py-3">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="ml-3">Verification Status</span>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
          </div>
          <Separator />
        </>
      )}
      
      {/* Wallet/Transaction History */}
      <button 
        className="w-full flex justify-between items-center py-3"
        onClick={() => navigate('/transactions')}
      >
        <div className="flex items-center">
          <Wallet className="h-5 w-5 text-gray-600" />
          <span className="ml-3">Transaction History</span>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </button>
      
      <Separator />
      
      {/* Help & Support */}
      <button 
        className="w-full flex justify-between items-center py-3"
        onClick={() => toast({
          title: 'Help & Support',
          description: 'Support features will be available in the next update'
        })}
      >
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 text-gray-600" />
          <span className="ml-3">Help & Support</span>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </button>
      
      <Separator />
      
      {/* Logout */}
      <button 
        className="w-full flex items-center py-3 text-red-600"
        onClick={onLogout}
        disabled={isLoggingOut}
      >
        <LogOut className="h-5 w-5" />
        <span className="ml-3">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
      </button>
    </div>
  );
};

export default AccountOptionsSection;
