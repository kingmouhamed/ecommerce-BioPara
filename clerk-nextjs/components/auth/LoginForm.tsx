"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  error,
  className = "",
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<LoginFormData>>({});

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<LoginFormData> = {};

    if (!formData.email) {
      errors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.password) {
      errors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 6) {
      errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || loading) return;

    try {
      await onSubmit(formData);
    } catch (err) {
      // Error is handled by parent component
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        {/* Email Input */}
        <div>
          <Input
            type="email"
            label="البريد الإلكتروني"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            required
            placeholder="example@email.com"
            className="text-right"
            leftIcon={<Mail className="w-4 h-4" />}
          />
        </div>

        {/* Password Input */}
        <div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="كلمة المرور"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              required
              placeholder="••••••••"
              className="text-right"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              }
            />
          </div>
          
          {/* Forgot Password Link */}
          <div className="text-left mt-2">
            <a
              href="/auth/forgot-password"
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              نسيت كلمة المرور؟
            </a>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember-me"
            checked={formData.rememberMe}
            onChange={(e) => handleInputChange("rememberMe", e.target.checked)}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="mr-2 text-sm text-gray-700 cursor-pointer"
          >
            تذكرني
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          fullWidth
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>

        {/* Sign Up Link */}
        <div className="text-center text-sm text-gray-600">
          ليس لديك حساب؟{" "}
          <a
            href="/auth/signup"
            className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            إنشاء حساب جديد
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
