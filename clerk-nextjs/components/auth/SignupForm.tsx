"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, User } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  loading?: boolean;
  error?: string;
  className?: string;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  loading = false,
  error,
  className = "",
}) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<SignupFormData>>({});

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<SignupFormData> = {};

    if (!formData.name.trim()) {
      errors.name = "الاسم الكامل مطلوب";
    } else if (formData.name.trim().length < 2) {
      errors.name = "الاسم يجب أن يكون حرفين على الأقل";
    }

    if (!formData.email) {
      errors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.password) {
      errors.password = "كلمة المرور مطلوبة";
    } else if (formData.password.length < 8) {
      errors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = "كلمة المرور يجب أن تحتوي على حرف كبير، حرف صغير، ورقم";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "كلمات المرور غير متطابقة";
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = true;
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
        {/* Name Input */}
        <div>
          <Input
            type="text"
            label="الاسم الكامل"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            error={!!fieldErrors.name}
            helperText={fieldErrors.name}
            required
            placeholder="أدخل اسمك الكامل"
            className="text-right"
            leftIcon={<User className="w-4 h-4" />}
          />
        </div>

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

        {/* Confirm Password Input */}
        <div>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            label="تأكيد كلمة المرور"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            error={!!fieldErrors.confirmPassword}
            helperText={fieldErrors.confirmPassword}
            required
            placeholder="••••••••"
            className="text-right"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-gray-500" />
                ) : (
                  <Eye className="w-4 h-4 text-gray-500" />
                )}
              </button>
            }
          />
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agree-terms"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-1"
          />
          <label
            htmlFor="agree-terms"
            className="mr-2 text-sm text-gray-700 cursor-pointer"
          >
            أوافق على{" "}
            <a
              href="/auth/terms"
              className="text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              الشروط والأحكام
            </a>{" "}
            و{" "}
            <a
              href="/auth/privacy"
              className="text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              سياسة الخصوصية
            </a>
          </label>
        </div>

        {fieldErrors.agreeToTerms && (
          <p className="text-red-600 text-sm mt-1">يجب الموافقة على الشروط والأحكام</p>
        )}

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
          {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        </Button>

        {/* Login Link */}
        <div className="text-center text-sm text-gray-600">
          لديك حساب بالفعل؟{" "}
          <a
            href="/auth/login"
            className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            تسجيل الدخول
          </a>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
