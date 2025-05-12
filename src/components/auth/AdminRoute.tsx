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
  
  useEffect(() => {
    // Only show toast if authentication is complete (not loading) and we know the user isn't an admin
    if (!loading && 
        isAuthenticated && 
        role !== 'admin' && 
        user?.email !== 'admin@klikjasa.com') {
      
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [loading, isAuthenticated, role, toast, user, navigate]);

  // While loading, show a spinner
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-klikjasa-purple animate-spin" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Special case for admin@klikjasa.com - always allow access
  if (user?.email === 'admin@klikjasa.com') {
    return <>{children}</>;
  }
  
  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  // If authenticated but not admin role, this will be handled by the useEffect above
  if (role !== 'admin') {
    return <></>;  // This is temporary while redirect happens in useEffect
  }

  // Otherwise, render the admin content
  return <>{children}</>;
};

export default AdminRoute;
