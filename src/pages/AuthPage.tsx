import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/context/AuthContext';

const AuthPage = () => {
  const { isAuthenticated, role, user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is already authenticated and redirect accordingly
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log("User already authenticated:", { role, email: user?.email });
      
      // If admin, redirect to admin panel
      if (role === 'admin' || user?.email === 'admin@klikjasa.com') {
        console.log("Redirecting authenticated admin to admin panel");
        navigate('/admin');
      } else {
        // Otherwise redirect to home
        navigate('/');
      }
    }
  }, [isAuthenticated, role, user, loading, navigate]);
  
  // Only render the auth form if not authenticated or still loading
  return !isAuthenticated ? <AuthForm /> : null;
};

export default AuthPage;
