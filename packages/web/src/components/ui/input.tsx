import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', fullWidth = false, ...props }, ref) => {
    const baseStyles = 'px-4 py-2 bg-background-secondary border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary';
    const errorStyles = error ? 'border-accent-error' : 'border-background-secondary';
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${errorStyles} ${widthClass} text-text-primary`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-accent-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
