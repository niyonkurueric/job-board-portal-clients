
declare global {
  interface Window {
    google?: any;
  }
}
import React, { useEffect, useRef } from 'react';
import { loginWithGoogle } from '@/api/googleAuthApi';
import { useDispatch } from 'react-redux';
import { loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

const GoogleOAuth: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google && !document.getElementById('google-client-script')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = 'google-client-script';
      document.body.appendChild(script);
    }
    const interval = setInterval(() => {
      if (window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            try {
              const data = await loginWithGoogle(response.credential);
              dispatch(loginSuccess(data.user || data));
              toast({
                title: 'Welcome back!',
                description: 'You have been successfully logged in with Google.',
              });
              navigate('/dashboard');
            } catch (error: any) {
              dispatch(loginFailure());
              toast({
                title: 'Google Login failed',
                description: error?.message || 'Please try again.',
                variant: 'destructive',
              });
            }
          },
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 340,
        });
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [dispatch, navigate, toast]);

  return <div ref={buttonRef} className="w-full flex justify-center mb-2" />;
};

export default GoogleOAuth;
