"use client";

import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000);
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-16" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-white" />
          </div>

          {/* Content */}
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            انضم إلى نشرتنا الإخبارية
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            احصل على أحدث العروض والمنتجات والنصائح الحصرية مباشرة في بريدك الإلكتروني
          </p>

          {/* Subscription Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="بريدك الإلكتروني"
                  className="w-full pr-12 pl-4 py-4 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-semibold hover:bg-emerald-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    اشترك الآن
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
              <CheckCircle className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">شكراً لاشتراكك!</h3>
              <p className="text-emerald-100">
                تم إضافة بريدك الإلكتروني بنجاح. ستصلك أحدث العروض قريباً.
              </p>
            </div>
          )}

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">15%</div>
              <div className="text-emerald-100">خصم على أول طلب</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">أسبوعي</div>
              <div className="text-emerald-100">عروض حصرية</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">دائماً</div>
              <div className="text-emerald-100">مجاني ولا إزعاج</div>
            </div>
          </div>

          {/* Privacy Note */}
          <p className="text-emerald-200 text-sm mt-8">
            نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.
          </p>
        </div>
      </div>
    </div>
  );
}
