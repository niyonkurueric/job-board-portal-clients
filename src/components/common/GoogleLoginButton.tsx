import React from 'react';
import { Button } from '@/components/ui/button';

interface GoogleLoginButtonProps {
  onClick: () => void;
  loading?: boolean;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M44.5 20H24V28.5H36.5C35.1 33.1 30.9 36.5 25.5 36.5C19.2 36.5 14 31.3 14 25C14 18.7 19.2 13.5 25.5 13.5C28.2 13.5 30.7 14.5 32.6 16.2L38.1 10.7C34.7 7.7 30.3 5.5 25.5 5.5C14.8 5.5 6 14.3 6 25C6 35.7 14.8 44.5 25.5 44.5C36.2 44.5 45 35.7 45 25C45 23.7 44.8 22.3 44.5 20Z" fill="#FFC107"/>
      <path d="M6 14.3L13.7 19.8C15.9 15.2 20.3 12 25.5 12C28.2 12 30.7 13 32.6 14.7L38.1 9.2C34.7 6.2 30.3 4 25.5 4C16.1 4 8.1 10.9 6 19.3V14.3Z" fill="#FF3D00"/>
      <path d="M25.5 44.5C30.2 44.5 34.5 42.7 37.7 39.8L31.5 34.7C29.7 36.1 27.7 37 25.5 37C20.9 37 16.9 33.7 15.5 29.5H6V34.7C8.1 43.1 16.1 50 25.5 50C30.3 50 34.7 47.8 38.1 44.8L32.6 39.3C30.7 41 28.2 42 25.5 42C20.3 42 15.9 38.8 13.7 34.2L6 39.7V44.7C8.1 53.1 16.1 60 25.5 60C34.9 60 42.9 53.1 45 44.7V39.7L37.7 34.2C35.5 38.8 31.1 42 25.5 42Z" fill="#4CAF50"/>
      <path d="M44.5 20H24V28.5H36.5C35.1 33.1 30.9 36.5 25.5 36.5C19.2 36.5 14 31.3 14 25C14 18.7 19.2 13.5 25.5 13.5C28.2 13.5 30.7 14.5 32.6 16.2L38.1 10.7C34.7 7.7 30.3 5.5 25.5 5.5C14.8 5.5 6 14.3 6 25C6 35.7 14.8 44.5 25.5 44.5C36.2 44.5 45 35.7 45 25C45 23.7 44.8 22.3 44.5 20Z" fill="#1976D2"/>
    </g>
  </svg>
);

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick, loading }) => (
  <Button
    type="button"
    variant="outline"
    className="w-full flex items-center justify-center gap-2 border border-gray-300"
    onClick={onClick}
    disabled={loading}
  >
    <GoogleIcon />
    {loading ? 'Signing in...' : 'Sign in with Google'}
  </Button>
);

export default GoogleLoginButton;
