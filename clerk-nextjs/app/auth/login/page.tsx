"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    router.push('/');
    return null;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50" dir="rtl">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">تسجيل الدخول إلى حسابك</h2>
        
        <div className="space-y-4">
          <SignInButton mode="modal">
            <button className="w-full px-4 py-3 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition">
              تسجيل الدخول
            </button>
          </SignInButton>
          
          <div className="text-center text-gray-500">أو</div>
          
          <SignUpButton mode="modal">
            <button className="w-full px-4 py-3 font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition">
              إنشاء حساب جديد
            </button>
          </SignUpButton>
        </div>
        
        <p className="text-sm text-center text-gray-600">
          <Link href="/" className="font-medium text-green-600 hover:text-green-500">
            العودة للصفحة الرئيسية
          </Link>
        </p>
      </div>
    </div>
  );
}