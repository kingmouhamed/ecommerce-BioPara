export default function Payment() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-right">الدفع الآمن</h1>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-right">طرق الدفع</h2>
          <p className="mb-4 text-right">
            نقبل طرق دفع آمنة متنوعة لضمان تجربة تسوق آمنة ومريحة.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-right">البطاقات الائتمانية/الخصم</h3>
              <p className="text-right">يتم قبول فيزا، ماستركارد، وبطاقات رئيسية أخرى</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-right">باي بال</h3>
              <p className="text-right">مدفوعات باي بال السريعة والآمنة</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-right">التحويل البنكي</h3>
              <p className="text-right">التحويل البنكي المباشر للطلبات الكبيرة</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-right">الدفع عند الاستلام</h3>
              <p className="text-right">ادفع عند استلام طلبك</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-right">الأمان</h2>
          <p className="mb-4 text-right">
            معلومات الدفع الخاصة بك مشفرة وآمنة. نحن نستخدم تشفير SSL المعياري في الصناعة لحماية بياناتك.
          </p>
          <ul className="list-disc list-inside space-y-1 text-right">
            <li>تشفير SSL 256 بت</li>
            <li>متوافق مع PCI DSS</li>
            <li>بوابات دفع آمنة</li>
            <li>لا يتم حفظ تفاصيل البطاقة</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-right">عملية الدفع</h2>
          <ol className="list-decimal list-inside space-y-2 text-right">
            <li>اختر منتجاتك وأضفها إلى السلة</li>
            <li>تابع إلى الدفع</li>
            <li>اختر طريقة الدفع المفضلة لديك</li>
            <li>أدخل تفاصيل الدفع بشكل آمن</li>
            <li>أكد طلبك</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
