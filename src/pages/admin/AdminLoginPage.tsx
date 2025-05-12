
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const AdminLoginPage: React.FC = () => {
  const { login, role, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('admin@klikjasa.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Monitor role and authentication state for redirection
  useEffect(() => {
    console.log("AdminLoginPage - Current auth state:", { 
      isAuthenticated, 
      role, 
      userEmail: user?.email 
    });
    
    // Only redirect if the user is authenticated AND has admin role
    if (isAuthenticated && role === 'admin') {
      console.log("AdminLoginPage - Redirecting to admin panel");
      navigate('/admin');
    }
  }, [isAuthenticated, role, navigate, user]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if the entered credentials match the admin credentials from the design spec
    if (email !== 'admin@klikjasa.com') {
      toast({
        title: 'Error',
        description: 'Invalid admin email address',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting admin login with email:', email);
      const { user } = await login(email, password);
      
      if (user) {
        toast({
          title: 'Login Successful',
          description: 'Welcome to KlikJasa Admin Panel',
        });
        
        console.log('Successful admin login, user:', user);
        // The redirection will be handled by the useEffect above
      } else {
        toast({
          title: 'Error',
          description: 'Failed to log in. Please check your credentials.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log in. Please check your credentials.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <div className="bg-klikjasa-purple p-3 rounded-full">
              <Shield size={32} className="text-white" />
            </div>
          </div>
          <h1 className="mt-4 text-2xl font-bold">KlikJasa Admin</h1>
          <p className="text-gray-500">Sign in to access the admin panel</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@klikjasa.com"
                    disabled={true}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-klikjasa-purple hover:bg-klikjasa-deepPurple"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In to Admin Panel'}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500">
                    <a href="/" className="text-klikjasa-purple hover:underline">
                      Return to KlikJasa
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;
