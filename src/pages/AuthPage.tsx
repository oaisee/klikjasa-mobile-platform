
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';

const AuthPage = () => {
  const { isAuthenticated, role, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state, if any
  const from = location.state?.from?.pathname;
  
  // Check if user is already authenticated and redirect accordingly
  useEffect(() => {
    console.log("AuthPage: Checking auth status", { 
      loading, 
      isAuthenticated, 
      role,
      email: user?.email,
      from
    });
    
    if (!loading && isAuthenticated) {
      console.log("User already authenticated:", { role, email: user?.email });
      
      // If admin, redirect to admin panel
      if (role === 'admin' || user?.email === 'admin@klikjasa.com') {
        console.log("Redirecting authenticated admin to admin panel");
        navigate(from || '/admin', { replace: true });
      } else {
        // Otherwise redirect to home
        console.log("Redirecting regular user to home page");
        navigate(from || '/', { replace: true });
      }
    }
  }, [isAuthenticated, role, user, loading, navigate, from]);
  
  // Only render the auth form if not authenticated or still loading
  return !isAuthenticated ? <AuthForm /> : null;
};

export default AuthPage;
