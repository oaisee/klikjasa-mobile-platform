
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    if (registerForm.password !== registerForm.confirmPassword) {
      setAuthError('Passwords do not match');
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log(`Submitting registration form for: ${registerForm.email}`);
      await register(registerForm.email, registerForm.password, registerForm.name);
      toast({
        title: 'Success',
        description: 'Account created successfully!'
      });
      console.log('Registration successful, redirecting to home page');
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to register. Please try again later.';
      
      console.error('Registration error in form:', errorMessage);
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
      
      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            required
            value={registerForm.name}
            onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            placeholder="name@example.com"
            type="email"
            autoComplete="email"
            required
            value={registerForm.email}
            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            required
            value={registerForm.password}
            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={registerForm.confirmPassword}
            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
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
              Creating Account...
            </>
          ) : 'Register'}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
