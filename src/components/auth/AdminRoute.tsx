
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, role, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  
  // Check if user has admin access - either by role or specific email
  const isAdmin = user?.email === 'admin@klikjasa.com' || role === 'admin';
  
  useEffect(() => {
    const checkAccess = async () => {
      // Wait for auth to finish loading
      if (loading) {
        console.log("AdminRoute: Auth still loading, waiting...");
        return;
      }
      
      console.log("AdminRoute check:", { 
        isAuthenticated, 
        isAdmin, 
        email: user?.email, 
        role, 
        loading,
        pathname: location.pathname
      });
      
      // If authenticated but not admin, show access denied and redirect
      if (isAuthenticated && !isAdmin) {
        console.log("Access denied: Not admin", { email: user?.email, role });
        
        toast('Access Denied', {
          description: "You don't have permission to access the admin panel"
        });
        
        navigate('/', { replace: true });
      }
      
      // If not authenticated at all, redirect to main auth page
      if (!isAuthenticated && !loading) {
        console.log("Not authenticated, redirecting to auth page");
        navigate('/auth', { replace: true, state: { from: location } });
      }
      
      setIsCheckingAccess(false);
    };
    
    checkAccess();
  }, [loading, isAuthenticated, isAdmin, navigate, user, role, location]);

  // Show loading state while checking authentication or when auth is still loading
  if (loading || isCheckingAccess) {
    console.log("AdminRoute: Showing loading state", { loading, isCheckingAccess });
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-klikjasa-purple animate-spin" />
        <p className="mt-4 text-lg text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  // If authenticated as admin, render the children
  if (isAuthenticated && isAdmin) {
    console.log("Admin access granted", { email: user?.email, role });
    return <>{children}</>;
  }
  
  // For all other cases, render nothing while the useEffect redirects
  console.log("AdminRoute: No render condition met, returning null");
  return null;
};

export default AdminRoute;
