import React from 'react';

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

const FormButton: React.FC<FormButtonProps> = ({ loading, children, ...props }) => (
  <button
    {...props}
    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-60 ${props.className || ''}`}
    disabled={props.disabled || loading}
  >
    {loading ? 'Loading...' : children}
  </button>
);

export default FormButton;
