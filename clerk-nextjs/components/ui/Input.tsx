"use client";

import React, { forwardRef } from "react";
import { Eye, EyeOff, Search, Mail, Phone, User, Lock, Calendar, MapPin, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export type InputType = 
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "time"
  | "datetime-local"
  | "month"
  | "week";

export type InputSize = "sm" | "md" | "lg";

export type InputVariant = "default" | "filled" | "flushed" | "unstyled";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: InputType;
  size?: InputSize;
  variant?: InputVariant;
  error?: boolean;
  helperText?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      size = "md",
      variant = "default",
      error = false,
      helperText,
      label,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      fullWidth = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;
    const hasError = error || !!helperText;

    // خريطة الأنماط حسب النوع
    const variantClasses = {
      default: cn(
        "border border-gray-300 bg-white",
        "focus:border-emerald-500 focus:ring-emerald-500",
        "hover:border-gray-400",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500",
        disabled && "bg-gray-50 cursor-not-allowed"
      ),
      filled: cn(
        "border-0 bg-gray-100",
        "focus:bg-white focus:ring-2 focus:ring-emerald-500",
        error && "bg-red-50 focus:ring-red-500",
        disabled && "bg-gray-50 cursor-not-allowed"
      ),
      flushed: cn(
        "border-0 border-b-2 border-gray-300 bg-transparent rounded-none px-0",
        "focus:border-emerald-500",
        error && "border-red-500 focus:border-red-500",
        disabled && "cursor-not-allowed"
      ),
      unstyled: cn(
        "border-0 bg-transparent p-0",
        "focus:outline-none focus:ring-0",
        disabled && "cursor-not-allowed"
      ),
    };

    // خريطة الأنماط حسب الحجم
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const baseClasses = cn(
      "flex w-full rounded-md transition-all duration-200",
      "placeholder:text-gray-400",
      "disabled:opacity-50",
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      className
    );

    const renderLeftIcon = () => {
      if (leftIcon) {
        return (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-400 h-4 w-4">{leftIcon}</span>
          </div>
        );
      }
      return null;
    };

    const renderRightIcon = () => {
      if (showPasswordToggle && type === "password") {
        return (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        );
      }
      if (rightIcon) {
        return (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-400 h-4 w-4">{rightIcon}</span>
          </div>
        );
      }
      return null;
    };

    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        {label && (
          <label className={cn(
            "block text-sm font-medium mb-2",
            error ? "text-red-600" : "text-gray-700",
            disabled && "text-gray-400"
          )}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {renderLeftIcon()}
          <input
            type={inputType}
            className={cn(
              baseClasses,
              leftIcon && "pr-10",
              (rightIcon || showPasswordToggle) && "pl-10"
            )}
            ref={ref}
            disabled={disabled}
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
          {renderRightIcon()}
        </div>

        {helperText && (
          <p className={cn(
            "mt-1 text-xs",
            error ? "text-red-600" : "text-gray-500"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// مكونات متخصصة
export const SearchInput: React.FC<Omit<InputProps, "leftIcon">> = (props) => (
  <Input
    type="search"
    leftIcon={<Search />}
    placeholder="ابحث..."
    {...props}
  />
);

export const EmailInput: React.FC<Omit<InputProps, "leftIcon" | "type">> = (props) => (
  <Input
    type="email"
    leftIcon={<Mail />}
    placeholder="example@email.com"
    {...props}
  />
);

export const PhoneInput: React.FC<Omit<InputProps, "leftIcon" | "type">> = (props) => (
  <Input
    type="tel"
    leftIcon={<Phone />}
    placeholder="+212 6XX-XXXXXX"
    {...props}
  />
);

export const PasswordInput: React.FC<Omit<InputProps, "showPasswordToggle">> = (props) => (
  <Input
    type="password"
    leftIcon={<Lock />}
    showPasswordToggle
    {...props}
  />
);

export const NameInput: React.FC<Omit<InputProps, "leftIcon">> = (props) => (
  <Input
    type="text"
    leftIcon={<User />}
    placeholder="الاسم الكامل"
    {...props}
  />
);

export const DateInput: React.FC<Omit<InputProps, "leftIcon" | "type">> = (props) => (
  <Input
    type="date"
    leftIcon={<Calendar />}
    {...props}
  />
);

export const AddressInput: React.FC<Omit<InputProps, "leftIcon">> = (props) => (
  <Input
    type="text"
    leftIcon={<MapPin />}
    placeholder="العنوان"
    {...props}
  />
);

export const CardInput: React.FC<Omit<InputProps, "leftIcon">> = (props) => (
  <Input
    type="text"
    leftIcon={<CreditCard />}
    placeholder="1234 5678 9012 3456"
    {...props}
  />
);

// مكونات الأرقام
export const QuantityInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: InputSize;
  className?: string;
}> = ({ value, onChange, min = 1, max = 99, size = "sm", className }) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className={cn("flex items-center border border-gray-300 rounded-md", className)}>
      <button
        type="button"
        onClick={decrement}
        className={cn(
          "p-1 text-gray-600 hover:bg-gray-100 transition-colors",
          size === "sm" ? "px-2 py-1" : "px-3 py-2"
        )}
        disabled={value <= min}
      >
        -
      </button>
      <Input
        type="number"
        value={value}
        onChange={(e) => {
          const newValue = parseInt(e.target.value) || min;
          onChange(Math.min(Math.max(newValue, min), max));
        }}
        min={min}
        max={max}
        className="border-0 text-center w-16"
        size={size}
      />
      <button
        type="button"
        onClick={increment}
        className={cn(
          "p-1 text-gray-600 hover:bg-gray-100 transition-colors",
          size === "sm" ? "px-2 py-1" : "px-3 py-2"
        )}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
};

// مكونات المدخلات المتقدمة
export const PriceRangeInput: React.FC<{
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  className?: string;
}> = ({ min, max, onChange, className }) => {
  const [localMin, setLocalMin] = React.useState(min);
  const [localMax, setLocalMax] = React.useState(max);

  React.useEffect(() => {
    setLocalMin(min);
    setLocalMax(max);
  }, [min, max]);

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, localMax - 1);
    setLocalMin(newMin);
    onChange(newMin, localMax);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, localMin + 1);
    setLocalMax(newMax);
    onChange(localMin, newMax);
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Input
        type="number"
        value={localMin}
        onChange={(e) => handleMinChange(parseInt(e.target.value) || 0)}
        placeholder="الحد الأدنى"
        size="sm"
        className="w-32"
      />
      <span className="text-gray-500">-</span>
      <Input
        type="number"
        value={localMax}
        onChange={(e) => handleMaxChange(parseInt(e.target.value) || 0)}
        placeholder="الحد الأقصى"
        size="sm"
        className="w-32"
      />
    </div>
  );
};

export default Input;
