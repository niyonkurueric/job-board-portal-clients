import { useState } from 'react';
import { signupSchema, type SignupForm } from '@/types/auth';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom';
import { loginSuccess } from '@/store/slices/authSlice';
import { register } from '@/api/registerApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User } from 'lucide-react';
import FormInput from '@/components/common/FormInput';
import FormButton from '@/components/common/FormButton';
import { useZodForm } from '@/components/common/useZodForm';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    values,
    errors,
    setErrors,
    validate,
    handleChange,
  } = useZodForm<SignupForm>(signupSchema, { name: '', email: '', password: '', confirmPassword: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  // Use RootState for better type safety
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const data = await register(values.name, values.email, values.password);
      // Store user and token in Redux and localStorage
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      toast({
        title: "Welcome to Job Board Portal!",
        description: "Your account has been created successfully.",
      });
      // If coming from an apply action, redirect to application form in dashboard
      const fromApply = location.state?.fromApply;
      const jobId = location.state?.jobId;
      if (fromApply && jobId) {
        navigate(`/dashboard/jobs/${jobId}/apply`, { replace: true });
      } else {
        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error?.message || 'An error occurred during registration.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-purple-100 overflow-hidden">
      {/* Left Hero/Brand Section */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 relative min-h-screen max-h-screen">
        <div className="z-10 flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight drop-shadow-lg">Join Job Board Portal</h1>
          <p className="text-base mb-4 max-w-md text-white/90 text-center">Create your free account and start applying to top jobs in seconds. Your next opportunity is just a click away!</p>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60">&copy; {new Date().getFullYear()} Job Board Portal. All rights reserved.</div>
      </div>
      {/* Signup Form Section */}
      <div className="flex flex-1 items-center justify-center py-4 px-2 min-h-screen max-h-screen">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border border-muted-foreground/10 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold text-blue-700 mb-1">Create Account</CardTitle>
              <CardDescription className="text-base text-muted-foreground mb-2">Join thousands of job seekers finding their dream careers</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormInput
                  id="name"
                  name="name"
                  type="text"
                  label="Full Name"
                  placeholder="John Doe"
                  value={values.name}
                  onChange={handleChange}
                  icon={<User className="h-4 w-4" />}
                  error={errors.name}
                  autoComplete="name"
                />
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="your.email@example.com"
                  value={values.email}
                  onChange={handleChange}
                  icon={<Mail className="h-4 w-4" />}
                  error={errors.email}
                  autoComplete="email"
                />
                <FormInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Create a strong password"
                  value={values.password}
                  onChange={handleChange}
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password}
                  autoComplete="new-password"
                />
                <FormInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
                <FormButton type="submit" loading={isLoading} className="mt-2">
                  Create Account
                </FormButton>
              </form>
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;