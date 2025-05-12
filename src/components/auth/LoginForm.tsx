
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      console.log(`Submitting login form for: ${loginForm.email}`);
      const result = await login(loginForm.email, loginForm.password);
      
      toast({
        title: 'Success',
        description: 'You have successfully logged in!'
      });
      
      // Special handling for admin login
      if (loginForm.email === 'admin@klikjasa.com') {
        console.log('Admin login successful, redirecting to admin panel');
        // Add delay to ensure state is updated
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        console.log('Regular user login successful, redirecting to home page');
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to login. Please check your credentials and try again.';
      console.error('Login error in form:', errorMessage);
      setAuthError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      {authError && (
        <Alert variant="destructive">
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoComplete="email"
            required
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full klikjasa-gradient"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : 'Login'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
