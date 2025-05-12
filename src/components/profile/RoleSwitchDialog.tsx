
import React from 'react';
import { UserRole } from '@/types/auth';
import { User as UserIcon, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RoleSwitchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRole: UserRole;
  onRoleSwitch: (role: UserRole) => void;
}

const RoleSwitchDialog: React.FC<RoleSwitchDialogProps> = ({
  open,
  onOpenChange,
  currentRole,
  onRoleSwitch
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Switch Mode</DialogTitle>
          <DialogDescription>
            You can switch between customer and service provider modes.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <Button
            className={`w-full justify-start ${currentRole === 'user' ? 'bg-klikjasa-cream text-klikjasa-deepPurple hover:bg-klikjasa-cream/80' : ''}`}
            variant={currentRole === 'user' ? 'default' : 'outline'}
            onClick={() => onRoleSwitch('user')}
          >
            <UserIcon className="mr-2 h-5 w-5" />
            Customer Mode
          </Button>
          
          <Button
            className={`w-full justify-start ${currentRole === 'provider' ? 'klikjasa-gradient hover:bg-klikjasa-purple/80' : ''}`}
            variant={currentRole === 'provider' ? 'default' : 'outline'}
            onClick={() => onRoleSwitch('provider')}
          >
            <Wallet className="mr-2 h-5 w-5" />
            Service Provider Mode
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSwitchDialog;
