import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle, user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userProfile = await login(email, password);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      navigate(userProfile.role === "admin" ? "/admin" : "/menu");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { user } = await loginWithGoogle();
      toast({
        title: "Success",
        description: "Logged in successfully with Google!",
      });
      navigate(user.role === "admin" ? "/admin/dashboard" : "/menu");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Google login failed.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome to ACE Canteen</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <div className='flex justify-center'>
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="rounded-full flex items-center justify-center w-10 h-10 p-0"
      >
        <FaGoogle className="text-xl" />
      </Button>
      </div>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Demo accounts:</p>
            <p>Admin: admin@acecanteen.com / password</p>
            <p>Student: student@acecanteen.com / password</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Button type="button" variant="ghost" onClick={onToggleMode}>
            Don't have an account? Register
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
