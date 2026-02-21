'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Sign in logic will be implemented
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="container mx-auto max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              مرحباً بعودتك
            </h1>
            <p className="text-gray-600">
              سجل دخولك للوصول إلى حسابك
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="بريدك الإلكتروني"
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-gray-600">تذكرني</span>
              </label>
              <a
                href="#"
                className="text-primary-600 hover:text-primary-700 font-bold"
              >
                هل نسيت كلمة المرور؟
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-2 rounded-lg font-bold hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أو</span>
            </div>
          </div>

          {/* Social Login */}
          <button
            type="button"
            className="w-full border-2 border-gray-200 text-gray-700 py-2 rounded-lg font-bold hover:border-gray-300 transition-all"
          >
            متابعة مع Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 mt-6">
            ليس لديك حساب؟{' '}
            <Link
              href="/sign-up"
              className="text-primary-600 hover:text-primary-700 font-bold"
            >
              انشئ حسابك الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
