import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, role, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      console.log("Admin logging out");
      const success = await logout();
      
      if (success) {
        navigate('/auth', { replace: true });
        toast("Logout successful", {
          description: 'You have been logged out of the admin panel',
        });
      } else {
        toast("Logout issue", {
          description: 'Session may already be expired. Redirecting to login.',
          variant: 'destructive',
        });
        navigate('/auth', { replace: true });
      }
    } catch (error) {
      console.error("Admin logout error:", error);
      toast("Error", {
        description: 'Failed to log out properly. Redirecting to login.',
        variant: 'destructive',
      });
      navigate('/auth', { replace: true });
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: ShieldCheck, label: 'Provider Verifications', path: '/admin/verifications' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: FileText, label: 'Transactions', path: '/admin/transactions' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Sidebar - Responsive */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transform transition-transform duration-200 ease-in-out lg:translate-x-0 fixed lg:static z-40 h-full w-64 bg-white shadow-md`}>
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-klikjasa-purple">KlikJasa Admin</h1>
          {user?.email && (
            <p className="text-sm text-gray-500 mt-1 truncate">
              {user.email}
            </p>
          )}
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <button 
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-klikjasa-purple ${
                    location.pathname === item.path ? 'bg-klikjasa-cream text-klikjasa-purple font-medium' : ''
                  }`}
                >
                  <item.icon size={20} className="mr-3" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-red-500"
          >
            <LogOut size={20} className="mr-3" />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
