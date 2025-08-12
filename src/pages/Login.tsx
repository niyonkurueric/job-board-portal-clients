import { useState } from 'react';
import { loginSchema, type LoginForm } from '@/types/auth';
import { useZodForm } from '@/components/common/useZodForm';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom';
import { loginSuccess } from '@/store/slices/authSlice';
import { login as loginApi } from '@/api/authApi';
import FormInput from '@/components/common/FormInput';
import FormButton from '@/components/common/FormButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock } from 'lucide-react';
import GoogleOAuth from '@/components/common/GoogleOAuth';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    values,
    errors,
    setErrors,
    validate,
    handleChange,
  } = useZodForm<LoginForm>(loginSchema, { email: '', password: '' });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  // Redirect if already authenticated
  if (isAuthenticated && user) {
    const fromApply = location.state?.fromApply;
    const jobId = location.state?.jobId;
    if (fromApply && jobId) {
      return <Navigate to={`/dashboard/jobs/${jobId}/apply`} replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await loginApi(values.email, values.password);
      if (response && response.user && response.token) {
        dispatch(loginSuccess({ user: response.user, token: response.token }));
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
        // If coming from an apply action, redirect to application form in dashboard
        const fromApply = location.state?.fromApply;
        const jobId = location.state?.jobId;
        if (fromApply && jobId) {
          navigate(`/dashboard/jobs/${jobId}/apply`, { replace: true });
        } else {
          navigate('/dashboard');
        }
      } else {
        toast({
          title: "Login failed",
          description: response?.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-purple-100 overflow-hidden">
      {/* Left Hero/Brand Section */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 relative h-full">
        <div className="z-10 flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight drop-shadow-lg">Welcome to Job Board Portal</h1>
          <p className="text-base mb-4 max-w-md text-white/90 text-center">Find your dream job, connect with top companies, and take the next step in your career journey.</p>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60">&copy; {new Date().getFullYear()} Job Board Portal. All rights reserved.</div>
      </div>
      {/* Login Form Section */}
      <div className="flex flex-1 items-center justify-center py-4 px-2 h-full overflow-hidden">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border border-muted-foreground/10 bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold text-blue-700 mb-1">Sign In</CardTitle>
              <CardDescription className="text-base text-muted-foreground mb-2">Sign in to your account to apply for jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <GoogleOAuth />
              </div>
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-muted-foreground/20" />
                <span className="mx-2 text-xs text-muted-foreground">or sign in with email</span>
                <div className="flex-grow border-t border-muted-foreground/20" />
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
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
                  autoComplete="username"
                />
                <FormInput
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChange={handleChange}
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password}
                  autoComplete="current-password"
                />
                <FormButton type="submit" loading={isLoading} className="mt-2">
                  Sign In
                </FormButton>
              </form>
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary font-semibold hover:underline">
                    Sign up
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

export default Login;