
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
    // Log current authentication state for debugging
    console.log("AdminRoute - Auth state:", {
      isAuthenticated,
      role,
      loading,
      userEmail: user?.email
    });
    
    // If authentication is complete and user is not an admin, show an error toast
    if (!loading && isAuthenticated && role !== 'admin') {
      console.log("Access denied: User is not an admin");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin panel",
        variant: "destructive",
      });
    }
  }, [loading, isAuthenticated, role, toast, user]);

  if (loading) {
    console.log("AdminRoute - Loading state");
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-klikjasa-purple animate-spin" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("AdminRoute - Not authenticated, redirecting to admin login");
    // Redirect to admin login page if not authenticated
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  // Special case for admin@klikjasa.com - always allow access
  if (user?.email === 'admin@klikjasa.com') {
    console.log("AdminRoute - Admin email detected, allowing access");
    return <>{children}</>;
  }
  
  if (role !== 'admin') {
    console.log("AdminRoute - Not admin role, redirecting to home");
    // Redirect to home page if authenticated but not admin
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log("AdminRoute - Access granted to admin panel");
  return <>{children}</>;
};

export default AdminRoute;
