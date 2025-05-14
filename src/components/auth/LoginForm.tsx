
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended destination from location state, if any
  const from = location.state?.from?.pathname;

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      console.log(`LoginForm: Submitting login form for: ${loginForm.email}`);
      console.log("LoginForm: Before login call");
      
      const result = await login(loginForm.email, loginForm.password);
      
      console.log("LoginForm: Login successful", {
        user: result.user?.email,
        hasSession: !!result.session
      });
      
      toast({
        title: 'Success',
        description: 'You have successfully logged in!'
      });
      
      // Special handling for admin login
      if (loginForm.email === 'admin@klikjasa.com') {
        console.log('Admin login successful, redirecting to admin panel');
        // Add delay to ensure state is updated
        setTimeout(() => {
          navigate(from || '/admin', { replace: true });
          console.log("Navigation triggered to:", from || '/admin');
        }, 1000);
      } else {
        console.log('Regular user login successful, redirecting to home page');
        navigate(from || '/', { replace: true });
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      {authError && (
        <Alert variant="destructive">
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">
          Use <strong>admin@klikjasa.com</strong> with admin password for admin access
        </p>
      </div>
      
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
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
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
