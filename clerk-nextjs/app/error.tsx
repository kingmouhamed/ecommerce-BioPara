"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4" dir="rtl">
      <div className="text-center max-w-lg mx-auto">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">حدث خطأ ما</h1>
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          {error.message || "حدث خطأ غير متوقع"}
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          نعتذر عن هذا الإزعاج. يرجى المحاولة مرة أخرى أو 
          <span className="font-medium">التواصل مع فريق الدعم</span> إذا استمرت المشكلة.
        </p>

        {/* Error Details (for development) */}
        {process.env.NODE_ENV === "development" && error.digest && (
          <details className="mb-8 text-right">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              تفاصيل الخطأ التقنية
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs text-gray-800 overflow-auto text-right">
              <code>{error.digest}</code>
            </pre>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            إعادة المحاولة
          </button>
          
          <button
            onClick={() => window.location.href = "/"}
            className="inline-flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">تحتاج مساعدة؟</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• تحقق من اتصالك بالإنترنت</p>
            <p>• أعد تحميل الصفحة (Ctrl+F5)</p>
            <p>• إذا استمرت المشكلة، تواصل معنا عبر:</p>
            <div className="flex justify-center gap-4 mt-3">
              <a
                href="mailto:support@biopara.ma"
                className="text-blue-600 hover:underline font-medium"
              >
                البريد الإلكتروني
              </a>
              <a
                href="tel:+212600000000"
                className="text-blue-600 hover:underline font-medium"
              >
                الهاتف
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
