export default function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50" dir="rtl">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">إنشاء حساب جديد</h2>
        <p className="text-center text-gray-600">
          هذه الصفحة قيد التطوير. سيتم تفعيل إنشاء الحسابات قريباً.
        </p>
        <div className="text-center">
          <a 
            href="/" 
            className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            العودة للرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}
