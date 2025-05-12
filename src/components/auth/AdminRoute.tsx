
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, role, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user has admin access - either by role or specific email
  const isAdmin = user?.email === 'admin@klikjasa.com' || role === 'admin';
  
  useEffect(() => {
    if (loading) return; // Don't do anything while loading
    
    console.log("AdminRoute check:", { 
      isAuthenticated, 
      isAdmin, 
      email: user?.email, 
      role, 
      loading 
    });
    
    // If authenticated but not admin, show access denied and redirect
    if (isAuthenticated && !isAdmin) {
      console.log("Access denied: Not admin", { email: user?.email, role });
      
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive",
      });
      
      navigate('/', { replace: true });
    }
    
    // If not authenticated at all, redirect to admin login
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to admin login");
      navigate('/admin/login', { replace: true, state: { from: location } });
    }
  }, [loading, isAuthenticated, isAdmin, toast, navigate, user, role, location]);

  // While loading, show a spinner
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-klikjasa-purple animate-spin" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // If authenticated as admin, render the children
  if (isAuthenticated && isAdmin) {
    console.log("Admin access granted", { email: user?.email, role });
    return <>{children}</>;
  }
  
  // For all other cases, render nothing while the useEffect redirects
  return null;
};

export default AdminRoute;
