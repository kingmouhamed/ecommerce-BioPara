'use client';

import { useState, Suspense } from 'react';
import { login, signup } from './actions';
import { useSearchParams } from 'next/navigation';

function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const handleSubmit = () => {
    setLoading(true);
  };

  return (
    <div className="w-full max-w-md bg-[#162716]/90 backdrop-blur-md border border-[#233d23] rounded-3xl p-8 shadow-2xl relative z-10">
      {/* BioPara Logo and Header */}
      <div className="text-center mb-8">
        <span className="text-4xl">🌿</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mt-3 font-serif">
          BioPara <span className="text-[#c8963e]">Spiritual</span>
        </h1>
        <p className="text-sm text-emerald-100/60 mt-2">
          {isSignUp ? 'انضم إلى مجتمعنا الطبيعي والصحي اليوم' : 'تواصل مع مستشارك الروحي والصحي'}
        </p>
      </div>

      {/* Alerts and Success messages */}
      {message && (
        <div className="mb-6 p-4 rounded-xl text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-center leading-relaxed">
          {message}
        </div>
      )}

      <form action={isSignUp ? signup : login} onSubmit={handleSubmit} className="space-y-5">
        {isSignUp && (
          <div>
            <label className="block text-xs font-semibold text-emerald-100/70 mb-2 mr-1">الاسم الكامل</label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="أحمد محمد"
              className="w-full px-4 py-3.5 rounded-xl bg-[#0d180d] border border-[#233d23] text-white text-sm focus:outline-none focus:border-[#c8963e] focus:ring-1 focus:ring-[#c8963e] transition-all placeholder:text-emerald-100/20"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-emerald-100/70 mb-2 mr-1">البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            required
            placeholder="example@biopara.com"
            className="w-full px-4 py-3.5 rounded-xl bg-[#0d180d] border border-[#233d23] text-white text-sm focus:outline-none focus:border-[#c8963e] focus:ring-1 focus:ring-[#c8963e] transition-all placeholder:text-emerald-100/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-emerald-100/70 mb-2 mr-1">كلمة المرور</label>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-3.5 rounded-xl bg-[#0d180d] border border-[#233d23] text-white text-sm focus:outline-none focus:border-[#c8963e] focus:ring-1 focus:ring-[#c8963e] transition-all placeholder:text-emerald-100/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-[#c8963e] to-[#a3792e] text-white font-bold rounded-xl shadow-lg hover:from-[#d9a74e] hover:to-[#b58a38] focus:outline-none active:scale-[0.98] transition-all flex items-center justify-center text-sm"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isSignUp ? (
            'إنشاء حساب جديد 🌿'
          ) : (
            'تسجيل الدخول 🚪'
          )}
        </button>
      </form>

      {/* Switch Button */}
      <div className="mt-8 pt-6 border-t border-[#233d23]/50 text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-[#c8963e] hover:text-[#d9a74e] font-semibold transition-all focus:outline-none"
        >
          {isSignUp ? 'لديك حساب بالفعل؟ سجل دخولك' : 'ليس لديك حساب؟ سجل معنا الآن'}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1b2e1b] via-[#122212] to-[#0a140a] px-4 py-12 relative overflow-hidden">
      {/* Decorative backdrop elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#1e3d1e]/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#c8963e]/5 blur-[120px]" />

      <Suspense fallback={
        <div className="w-full max-w-md bg-[#162716]/90 border border-[#233d23] rounded-3xl p-8 shadow-2xl flex items-center justify-center min-h-[300px]">
          <div className="w-10 h-10 border-4 border-[#c8963e] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
