import { useState } from 'react';
import { signupSchema, type SignupForm } from '@/types/auth';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useNavigate, Link, Navigate, useLocation } from 'react-router-dom';
import { loginSuccess } from '@/store/slices/authSlice';
import { register } from '@/api/registerApi';
import { useToast } from '@/hooks/use-toast';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useZodForm } from '@/components/common/useZodForm';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { values, errors, setErrors, validate, handleChange } =
    useZodForm<SignupForm>(signupSchema, {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const data = await register(values.name, values.email, values.password);

      // Save user and token
      dispatch(loginSuccess({ user: data.user, token: data.token }));

      toast({
        title: 'Welcome to Job Board Portal!',
        description: 'Your account has been created successfully.'
      });

      // Redirect
      const fromApply = location.state?.fromApply;
      const jobId = location.state?.jobId;
      if (fromApply && jobId) {
        navigate(`/dashboard/jobs/${jobId}/apply`, { replace: true });
      } else {
        navigate('/login');
      }
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error?.message || 'An error occurred during registration.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Side - Illustration / Info */}
        <div className="hidden md:flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-3xl top-10 left-10 animate-pulse"></div>
            <div className="absolute w-60 h-60 bg-purple-200 rounded-full opacity-30 blur-3xl bottom-10 right-10 animate-pulse"></div>
          </div>
          <div className="max-w-md text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Unlock Your Career Opportunities 🚀
            </h2>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Sign up today and{' '}
              <span className="font-bold text-[#3aafef]">
                discover jobs made for you
              </span>
              . Connect with companies, explore opportunities, and grow towards
              your dreams.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#222a5f] mb-1">
              Join Our Platform
            </h1>
            <p className="text-gray-600 text-sm">
              Create your account and start your journey
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500 mb-1" />
              <span className="text-xs font-medium text-gray-700">
                Free to Join
              </span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
              <Shield className="h-6 w-6 text-blue-500 mb-1" />
              <span className="text-xs font-medium text-gray-700">Secure</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
              <Clock className="h-6 w-6 text-purple-500 mb-1" />
              <span className="text-xs font-medium text-gray-700">
                Quick Setup
              </span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3aafef] ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3aafef] ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3aafef] ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3aafef] ${
                    errors.confirmPassword
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 text-[#3aafef] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-[#3aafef] hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#3aafef] hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#3aafef] hover:bg-[#0a7fbd] text-white font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <Link to="/login" className="mt-4 text-center text-xs text-gray-600">
            Already have an account?{' '}
            <span className="text-[#3aafef] hover:underline font-medium">
              Log in
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
