
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminLoginPage: React.FC = () => {
  const { login, logout, role, isAuthenticated, user, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('admin@klikjasa.com');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Debug auth state
  useEffect(() => {
    console.log("AdminLoginPage - Auth state:", { 
      isAuthenticated, 
      role, 
      email: user?.email,
      loading
    });
  }, [isAuthenticated, role, user, loading]);
  
  // Log out any current user when visiting the admin login page
  useEffect(() => {
    const performLogout = async () => {
      if (isAuthenticated && user?.email !== 'admin@klikjasa.com') {
        console.log("Logging out non-admin user on admin login page");
        await logout();
      }
    };
    
    if (!loading) {
      performLogout();
    }
  }, [isAuthenticated, user, logout, loading]);
  
  // Redirect if already authenticated as admin
  useEffect(() => {
    if (loading) return; // Skip while loading
    
    // Only redirect if properly authenticated as admin
    if (isAuthenticated && (user?.email === 'admin@klikjasa.com' || role === 'admin')) {
      console.log("Already authenticated as admin, redirecting to admin panel");
      
      // Use timeout to ensure state is fully processed
      setTimeout(() => {
        const from = location.state?.from?.pathname || "/admin";
        navigate(from, { replace: true });
      }, 500);
    }
  }, [isAuthenticated, role, user, navigate, loading, location]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }
    
    if (email !== 'admin@klikjasa.com') {
      setErrorMessage('Only admin@klikjasa.com can access the admin panel');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Attempting admin login...');
      const result = await login(email, password);
      
      if (result.user) {
        toast({
          title: 'Login Successful',
          description: 'Welcome to KlikJasa Admin Panel',
        });
        
        console.log("Admin login successful, redirecting to admin panel");
        
        // Use longer timeout to ensure auth state is fully processed
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setErrorMessage('Invalid credentials. Please try again.');
      
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
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
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
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
