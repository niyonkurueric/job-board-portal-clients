import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="space-y-1">
    {label && <label htmlFor={props.id} className="block font-medium mb-1">{label}</label>}
    <textarea
      ref={ref}
      className={`w-full border rounded px-3 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} ${error ? 'border-red-500' : 'border-input'}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
  </div>
));

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
