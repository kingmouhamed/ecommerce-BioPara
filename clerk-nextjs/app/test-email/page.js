'use client';

import React, { useState } from 'react';
import { useEmail } from '@/hooks/useEmail';

export default function TestEmailPage() {
  const [formData, setFormData] = useState({
    name: 'أحمد محمد',
    email: 'test@example.com',
    token: 'abc123456',
    welcomeUrl: 'http://localhost:3000/welcome',
    verificationUrl: 'http://localhost:3000/verify?token=abc123456',
    resetUrl: 'http://localhost:3000/reset-password?token=abc123456'
  });

  const { 
    loading, 
    error, 
    success,
    sendWelcomeEmail,
    sendVerificationEmail,
    sendPasswordResetEmail,
    clearState 
  } = useEmail();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // إرسال بريد الترحيب
  const handleWelcomeEmail = async () => {
    const result = await sendWelcomeEmail({
      name: formData.name,
      email: formData.email,
      welcomeUrl: formData.welcomeUrl,
    });

    if (result.success) {
      console.log('✅ Welcome email sent:', result.data);
    } else {
      console.error('❌ Failed:', result.error);
    }
  };

  // إرسال بريد التحقق
  const handleVerificationEmail = async () => {
    const result = await sendVerificationEmail({
      name: formData.name,
      email: formData.email,
      verificationUrl: formData.verificationUrl,
      token: formData.token,
    });

    if (result.success) {
      console.log('✅ Verification email sent:', result.data);
    } else {
      console.error('❌ Failed:', result.error);
    }
  };

  // إرسال بريد استعادة كلمة المرور
  const handlePasswordResetEmail = async () => {
    const result = await sendPasswordResetEmail({
      name: formData.name,
      email: formData.email,
      resetUrl: formData.resetUrl,
      token: formData.token,
    });

    if (result.success) {
      console.log('✅ Password reset email sent:', result.data);
    } else {
      console.error('❌ Failed:', result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌿 BioPara Email Service
          </h1>
          <p className="text-lg text-gray-600">
            اختبار خدمة البريد الإلكتروني
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* نموذج البيانات */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              📝 بيانات الاختبار
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="أدخل الاسم"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رمز التحقق
                </label>
                <input
                  type="text"
                  name="token"
                  value={formData.token}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="abc123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الترحيب
                </label>
                <input
                  type="url"
                  name="welcomeUrl"
                  value={formData.welcomeUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="http://localhost:3000/welcome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط التحقق
                </label>
                <input
                  type="url"
                  name="verificationUrl"
                  value={formData.verificationUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="http://localhost:3000/verify?token=abc123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط استعادة كلمة المرور
                </label>
                <input
                  type="url"
                  name="resetUrl"
                  value={formData.resetUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="http://localhost:3000/reset-password?token=abc123"
                />
              </div>
            </div>
          </div>

          {/* أزرار الإرسال والحالة */}
          <div className="space-y-6">
            {/* أزرار الإرسال */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                📧 إرسال الرسائل
              </h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleWelcomeEmail}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      🎉 إرسال بريد الترحيب
                    </>
                  )}
                </button>

                <button
                  onClick={handleVerificationEmail}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      🔐 إرسال بريد التحقق
                    </>
                  )}
                </button>

                <button
                  onClick={handlePasswordResetEmail}
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      🔑 إرسال بريد استعادة كلمة المرور
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* عرض الحالة */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  📊 حالة الإرسال
                </h2>
                <button
                  onClick={clearState}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
                >
                  مسح الحالة
                </button>
              </div>
              
              <div className="space-y-3">
                {loading && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">⏳ جاري الإرسال...</p>
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✅ {success}</p>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">❌ {error}</p>
                  </div>
                )}
                
                {!loading && !success && !error && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-600">لم يتم إرسال أي رسالة بعد</p>
                  </div>
                )}
              </div>
            </div>

            {/* معلومات API */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                ℹ️ معلومات API
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Endpoints:</strong></p>
                <ul className="list-disc list-inside space-y-1 mr-4">
                  <li>/api/email/welcome</li>
                  <li>/api/email/verify</li>
                  <li>/api/email/reset-password</li>
                </ul>
                <p><strong>Rate Limit:</strong> 3 رسائل كل 5 دقائق</p>
                <p><strong>الخدمة:</strong> Resend</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
