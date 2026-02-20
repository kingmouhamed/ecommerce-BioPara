'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">سياسة الخصوصية</h1>

        <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">مقدمة</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              نحن في BioParaa نقدر خصوصيتك وملتزمون بحماية بيانات العملاء. توضح هذه السياسة
              كيفية قيامنا بجمع واستخدام وحماية معلوماتك الشخصية.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">البيانات التي نجمعها</h2>
            <ul className="space-y-2 text-gray-700 text-lg">
              <li>• اسمك والبريد الإلكتروني</li>
              <li>• عنوانك ورقم هاتفك</li>
              <li>• تفاصيل الطلب والدفع</li>
              <li>• سجل التصفح والتفضيلات</li>
              <li>• معلومات جهازك وموقعك (اختياري)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">استخدام البيانات</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              نستخدم بيانات العملاء فقط لأغراض تقديم الخدمات وتحسين تجربتك. لا نبيع أو نشاركي
              بيانات العملاء مع الغير دون موافقتك الصريحة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">حماية البيانات</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              نستخدم تقنيات التشفير والحماية الحديثة لحماية بيانات العملاء من الوصول غير المصرح به.
              جميع المعاملات آمنة وسرية.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">حقوقك</h2>
            <ul className="space-y-2 text-gray-700 text-lg">
              <li>• الحق في الوصول إلى بيانات عنك</li>
              <li>• الحق في تعديل بيانات عنك</li>
              <li>• الحق في حذف حسابك</li>
              <li>• الحق في عدم تلقي رسائل تسويقية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">التواصل معنا</h2>
            <p className="text-gray-700 text-lg">
              إذا كان لديك أي استفسارات حول سياسة الخصوصية، يرجى التواصل معنا على:
            </p>
            <p className="text-gray-700 text-lg mt-2">
              البريد: privacy@bioparaa.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
