export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">المفضلات</h1>
          <p className="text-gray-600 mb-8">
            هذه الصفحة قيد التطوير. سيتم تفعيل المفضلات قريباً.
          </p>
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
