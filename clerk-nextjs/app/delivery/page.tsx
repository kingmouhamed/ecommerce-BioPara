export default function Delivery() {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-right">التوصيل والشحن</h1>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-right">معلومات الشحن</h2>
          <p className="mb-4 text-right">
            نحن نقدم خدمات توصيل سريعة وموثوقة في جميع أنحاء المغرب. تتم معالجة جميع الطلبات في غضون 24 ساعة.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-right">التوصيل العادي</h3>
              <p className="text-right">2-3 أيام عمل - مجاني للطلبات التي تزيد عن 300 درهم</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-right">التوصيل السريع</h3>
              <p className="text-right">يوم عمل واحد - 50 درهم</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-right">مناطق التوصيل</h2>
          <p className="mb-4 text-right">نقوم بالتوصيل إلى جميع المدن الكبرى في المغرب:</p>
          <ul className="list-disc list-inside space-y-1 text-right">
            <li>الدار البيضاء</li>
            <li>الرباط</li>
            <li>مراكش</li>
            <li>فاس</li>
            <li>طنجة</li>
            <li>وجميع المدن الأخرى</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-right">تتبع طلبك</h2>
          <p className="text-right">
            بمجرد شحن طلبك، ستتلقى رقم تتبع عبر البريد الإلكتروني والرسائل النصية القصيرة لمراقبة حالة التوصيل الخاصة بك.
          </p>
        </div>
      </div>
    </div>
  );
}
