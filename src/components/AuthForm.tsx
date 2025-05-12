
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import Logo from './Logo';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

const AuthForm = () => {
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state, if any
  const from = location.state?.from?.pathname;

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    if (user?.email === 'admin@klikjasa.com' || role === 'admin') {
      console.log('Admin user detected, redirecting to admin panel');
      setTimeout(() => {
        navigate(from || '/admin');
      }, 500);
    } else if (user) {
      // If regular user, redirect to home
      console.log('Regular user detected, redirecting to home page');
      navigate(from || '/');
    }
  }, [user, role, navigate, from]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Logo className="mb-8" />
      <div className="w-full max-w-md">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthForm;
