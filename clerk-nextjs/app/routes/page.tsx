import Link from 'next/link';

export default function Routes() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-right">خريطة الموقع</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-right">
        <div>
          <h2 className="text-xl font-semibold mb-4">المنتجات</h2>
          <ul className="space-y-2">
            <li><Link href="/products" className="text-green-700 hover:underline">كل المنتجات</Link></li>
            <li><Link href="/products?category=Visage" className="text-green-700 hover:underline">العناية بالوجه</Link></li>
            <li><Link href="/products?category=Parapharmacie" className="text-green-700 hover:underline">شبه صيدلية</Link></li>
            <li><Link href="/products?category=Cheveux" className="text-green-700 hover:underline">العناية بالشعر</Link></li>
            <li><Link href="/promotions" className="text-green-700 hover:underline">العروض</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">الحساب</h2>
          <ul className="space-y-2">
            <li><Link href="/login" className="text-green-700 hover:underline">تسجيل الدخول</Link></li>
            <li><Link href="/signup" className="text-green-700 hover:underline">إنشاء حساب</Link></li>
            <li><Link href="/cart" className="text-green-700 hover:underline">عربة التسوق</Link></li>
            <li><Link href="/favorites" className="text-green-700 hover:underline">المفضلة</Link></li>
            <li><Link href="/addresses" className="text-green-700 hover:underline">العناوين</Link></li>
            <li><Link href="/credits" className="text-green-700 hover:underline">الرصيد</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">معلومات</h2>
          <ul className="space-y-2">
            <li><Link href="/about" className="text-green-700 hover:underline">من نحن</Link></li>
            <li><Link href="/contact" className="text-green-700 hover:underline">اتصل بنا</Link></li>
            <li><Link href="/delivery" className="text-green-700 hover:underline">التوصيل</Link></li>
            <li><Link href="/payment" className="text-green-700 hover:underline">الدفع</Link></li>
            <li><Link href="/terms" className="text-green-700 hover:underline">شروط الاستخدام</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
