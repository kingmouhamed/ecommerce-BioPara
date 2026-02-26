"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Mail, Phone, MapPin, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  className = '',
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasError = error || !!helperText;

  return (
    <div className="space-y-2">
      {label && (
        <label className={cn(
          'block text-sm font-medium',
          error ? 'text-red-600' : 'text-gray-700'
        )}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          type={inputType}
          className={cn(
            'w-full px-4 py-2 border rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
            'placeholder:text-gray-400',
            leftIcon && 'pr-10',
            (rightIcon || showPasswordToggle) && 'pl-10',
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
            isFocused && 'shadow-sm',
            className
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {(showPasswordToggle || rightIcon) && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {showPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={cn(
          'flex items-center space-x-2 space-x-reverse text-xs',
          error ? 'text-red-600' : 'text-gray-500'
        )}>
          {error && <AlertCircle className="w-3 h-3" />}
          {error || helperText}
        </div>
      )}
    </div>
  );
};

// Specialized input components
export const EmailInput: React.FC<Omit<InputProps, 'type' | 'leftIcon'>> = (props) => (
  <Input
    type="email"
    leftIcon={<Mail className="w-4 h-4" />}
    placeholder="example@email.com"
    {...props}
  />
);

export const PasswordInput: React.FC<Omit<InputProps, 'type' | 'leftIcon' | 'showPasswordToggle'>> = (props) => (
  <Input
    type="password"
    leftIcon={<Lock className="w-4 h-4" />}
    showPasswordToggle
    {...props}
  />
);

export const PhoneInput: React.FC<Omit<InputProps, 'type' | 'leftIcon'>> = (props) => (
  <Input
    type="tel"
    leftIcon={<Phone className="w-4 h-4" />}
    placeholder="+212 6XX-XXXXXX"
    {...props}
  />
);

export const NameInput: React.FC<Omit<InputProps, 'type' | 'leftIcon'>> = (props) => (
  <Input
    type="text"
    leftIcon={<User className="w-4 h-4" />}
    placeholder="الاسم الكامل"
    {...props}
  />
);

export const AddressInput: React.FC<Omit<InputProps, 'type' | 'leftIcon'>> = (props) => (
  <Input
    type="text"
    leftIcon={<MapPin className="w-4 h-4" />}
    placeholder="العنوان"
    {...props}
  />
);

export const CardInput: React.FC<Omit<InputProps, 'type' | 'leftIcon'>> = (props) => (
  <Input
    type="text"
    leftIcon={<CreditCard className="w-4 h-4" />}
    placeholder="1234 5678 9012 3456"
    {...props}
  />
);

// Form validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, '');
  const cardRegex = /^\d{13,19}$/;
  return cardRegex.test(cleaned);
};

export const validateCardExpiry = (expiry: string): boolean => {
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiry)) return false;
  
  const [month, year] = expiry.split('/');
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  
  const expiryYear = parseInt(year);
  const expiryMonth = parseInt(month);
  
  if (expiryYear < currentYear) return false;
  if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
  
  return true;
};

export const validateCardCVV = (cvv: string): boolean => {
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
};

// Form component with validation
interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'number';
  required?: boolean;
  validation?: (value: string) => string | null;
  placeholder?: string;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  loading?: boolean;
  error?: string;
  submitText?: string;
  className?: string;
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  loading = false,
  error,
  submitText = 'إرسال',
  className = ''
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (field: FormField, value: string): string | null => {
    if (field.required && !value.trim()) {
      return `${field.label} مطلوب`;
    }
    
    if (field.validation) {
      return field.validation(value);
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    // Validate all fields
    fields.forEach(field => {
      const error = validateField(field, formData[field.name] || '');
      if (error) {
        newErrors[field.name] = error;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(formData);
  };

  const getInputComponent = (field: FormField) => {
    const commonProps = {
      name: field.name,
      label: field.label,
      value: formData[field.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(field.name, e.target.value),
      error: errors[field.name],
      placeholder: field.placeholder,
      required: field.required
    };

    switch (field.type) {
      case 'email':
        return <EmailInput {...commonProps} />;
      case 'password':
        return <PasswordInput {...commonProps} />;
      case 'tel':
        return <PhoneInput {...commonProps} />;
      case 'number':
        return <Input type="number" {...commonProps} />;
      default:
        return <Input type="text" {...commonProps} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {fields.map(field => (
        <div key={field.name}>
          {getInputComponent(field)}
        </div>
      ))}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 space-x-reverse text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 space-x-reverse"
      >
        {loading && (
          <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
        )}
        <span>{submitText}</span>
      </button>
    </form>
  );
};

export default Input;
