"use client";

import React, { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if the user has already consented
        const consent = localStorage.getItem('biopara_cookie_consent');
        if (!consent) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('biopara_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 md:p-6 translate-y-0 transition-transform duration-500 ease-in-out">
            <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-700 text-white rounded-2xl shadow-2xl p-6 relative flex flex-col md:flex-row items-center justify-between gap-6">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                    aria-label="إغلاق"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-start md:items-center gap-4 flex-1">
                    <div className="bg-emerald-500/20 p-3 rounded-full hidden md:flex">
                        <Cookie className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                            <Cookie className="w-5 h-5 text-emerald-400 md:hidden" />
                            نحن نستخدم ملفات تعريف الارتباط
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
                            يستخدم BioPara ملفات تعريف الارتباط (Cookies) لتحسين تجربة التسوق الخاصة بك، وتحليل حركة المرور، وتخصيص المحتوى.
                            باستمرارك في تصفح الموقع، فإنك توافق على استخدامنا لملفات تعريف الارتباط.
                            <Link href="/privacy" className="text-emerald-400 mx-1 hover:underline">
                                اقرأ سياسة الخصوصية
                            </Link>
                            لمزيد من التفاصيل.
                        </p>
                    </div>
                </div>

                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto min-w-[140px]">
                    <button
                        onClick={acceptCookies}
                        className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-6 rounded-lg font-bold transition-all shadow-lg hover:shadow-emerald-500/20"
                    >
                        قبول المتابعة
                    </button>
                    <Link
                        href="/privacy"
                        className="flex-1 md:flex-none text-center bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 px-6 rounded-lg font-medium transition-all"
                    >
                        التفاصيل
                    </Link>
                </div>
            </div>
        </div>
    );
}
