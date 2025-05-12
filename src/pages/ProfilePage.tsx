
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Wallet, 
  LogOut, 
  ArrowRightLeft, 
  Edit3, 
  Shield, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

const ProfilePage = () => {
  const { user, logout, role, switchRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      navigate('/');
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully'
      });
    }, 500);
  };

  const handleRoleSwitch = (newRole: 'user' | 'provider') => {
    if (newRole === 'provider' && !user.isVerified) {
      toast({
        title: 'Verification Required',
        description: 'You need to complete verification to access provider features',
        variant: 'destructive'
      });
      navigate('/provider-verification');
      return;
    }
    
    switchRole(newRole);
    setShowRoleDialog(false);
    toast({
      title: 'Role Switched',
      description: `You are now using KlikJasa as a ${newRole === 'user' ? 'Customer' : 'Service Provider'}`
    });
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>
      
      {/* User Info Section */}
      <div className="bg-white mt-3 p-5">
        <div className="flex items-center">
          <div className="h-16 w-16 rounded-full bg-klikjasa-cream flex items-center justify-center">
            <User className="h-8 w-8 text-klikjasa-deepPurple" />
          </div>
          <div className="ml-4">
            <h2 className="font-semibold text-lg">{user.name}</h2>
            <p className="text-gray-600 text-sm">{user.email}</p>
            <div className="flex items-center mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${
                role === 'user' ? 'bg-klikjasa-cream text-klikjasa-deepPurple' : 
                role === 'provider' ? 'bg-klikjasa-purple text-white' :
                'bg-red-100 text-red-800'
              }`}>
                {role === 'user' ? 'Customer' : role === 'provider' ? 'Service Provider' : 'Admin'}
              </span>
              {user.isVerified && (
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-5 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Balance</p>
              <p className="text-xl font-semibold">{formatCurrency(user.balance)}</p>
            </div>
            <Button 
              variant="outline" 
              className="text-klikjasa-purple border-klikjasa-purple"
              onClick={() => toast({
                title: 'Top Up',
                description: 'Top up feature will be available in the next update'
              })}
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
      
      {/* Account Section */}
      <div className="bg-white mt-3 p-5">
        <h3 className="font-semibold mb-3">Account</h3>
        
        {/* Role Switching Option */}
        {user.isVerified && (
          <>
            <button 
              className="w-full flex justify-between items-center py-3"
              onClick={() => setShowRoleDialog(true)}
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
        {!user.isVerified && role === 'user' && (
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
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
        </button>
      </div>
      
      {/* Role Switch Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Mode</DialogTitle>
            <DialogDescription>
              You can switch between customer and service provider modes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <Button
              className={`w-full justify-start ${role === 'user' ? 'bg-klikjasa-cream text-klikjasa-deepPurple hover:bg-klikjasa-cream/80' : ''}`}
              variant={role === 'user' ? 'default' : 'outline'}
              onClick={() => handleRoleSwitch('user')}
            >
              <User className="mr-2 h-5 w-5" />
              Customer Mode
            </Button>
            
            <Button
              className={`w-full justify-start ${role === 'provider' ? 'klikjasa-gradient hover:bg-klikjasa-purple/80' : ''}`}
              variant={role === 'provider' ? 'default' : 'outline'}
              onClick={() => handleRoleSwitch('provider')}
            >
              <Wallet className="mr-2 h-5 w-5" />
              Service Provider Mode
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
