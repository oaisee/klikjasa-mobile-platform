
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  FileText, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, role, user } = useAuth();
  const { toast } = useToast();

  console.log("AdminLayout - Current state:", {
    role,
    userEmail: user?.email,
    currentPath: location.pathname
  });

  const handleLogout = async () => {
    try {
      console.log("Admin logging out");
      const success = await logout();
      
      if (success) {
        navigate('/auth', { replace: true });
        toast({
          title: 'Logout successful',
          description: 'You have been logged out of the admin panel',
        });
      } else {
        toast({
          title: 'Logout issue',
          description: 'Session may already be expired. Redirecting to login.',
          variant: 'destructive',
        });
        navigate('/auth', { replace: true });
      }
    } catch (error) {
      console.error("Admin logout error:", error);
      toast({
        title: 'Error',
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
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
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
                  onClick={() => navigate(item.path)}
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
    </div>
  );
};

export default AdminLayout;
