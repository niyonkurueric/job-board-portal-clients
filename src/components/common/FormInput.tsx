import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(({ label, error, icon, className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && <label htmlFor={props.id} className="block font-medium mb-1">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
      <input
        ref={ref}
        className={`pl-10 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-300 ${className} ${error ? 'border-red-500' : 'border-input'}`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
  </div>
));

FormInput.displayName = 'FormInput';

export default FormInput;
