'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, Phone } from 'lucide-react';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }
    setIsLoading(true);
    // Sign up logic will be implemented
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="container mx-auto max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              إنشاء حساب جديد
            </h1>
            <p className="text-gray-600">
              انضم إلى BioParaa واستمتع بالتسوق
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                الاسم الكامل
              </label>
              <div className="relative">
                <User
                  size={20}
                  className="absolute right-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="اسمك الكامل"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail
                  size={20}
                  className="absolute right-3 top-3 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                رقم الهاتف
              </label>
              <div className="relative">
                <Phone
                  size={20}
                  className="absolute right-3 top-3 text-gray-400"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pr-10 pl-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="رقم هاتفك"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute right-3 top-3 text-gray-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pr-10 pl-10 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="كلمة المرور"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Lock
                  size={20}
                  className="absolute right-3 top-3 text-gray-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pr-10 pl-10 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="تأكيد كلمة المرور"
                  required
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                أوافق على{' '}
                <Link
                  href="/terms"
                  className="text-primary-600 hover:text-primary-700 font-bold"
                >
                  شروط الاستخدام
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !agreeToTerms}
              className="w-full bg-primary-600 text-white py-2 rounded-lg font-bold hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 mt-6">
            هل لديك حساب بالفعل؟{' '}
            <Link
              href="/sign-in"
              className="text-primary-600 hover:text-primary-700 font-bold"
            >
              سجل دخولك
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
