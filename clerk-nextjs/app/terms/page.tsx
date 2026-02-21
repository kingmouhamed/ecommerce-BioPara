'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">شروط الاستخدام</h1>

        <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">قبول الشروط</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              بزيارتك لموقعنا أو إجراؤك لأي عملية شراء، فأنت توافق على هذه الشروط والأحكام.
              إذا كنت لا توافق على أي جزء منها، يرجى عدم استخدام المتجر.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">الاستخدام المقبول</h2>
            <ul className="space-y-2 text-gray-700 text-lg">
              <li>• استخدام المتجر للأغراض القانونية فقط</li>
              <li>• عدم الإساءة أو إزعاج المستخدمين الآخرين</li>
              <li>• احترام الملكية الفكرية والعلامات التجارية</li>
              <li>• عدم محاولة اختراق أو تعطيل النظام</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">تفاصيل المنتجات</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              نحرص على تقديم معلومات دقيقة عن المنتجات. لكننا لا نضمن خلو الموقع من الأخطاء
              أو السهو. تقع على عاتقك مسؤولية التحقق من المعلومات قبل الشراء.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">الأسعار والدفع</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              جميع الأسعار بالريال السعودي وقابلة للتغيير دون إشعار. نقبل جميع طرق الدفع الآمنة.
              يتم تأكيد الطلب فقط عند استقبال الدفع الكامل.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">مسؤوليتنا</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              لا نتحمل مسؤولية عن الأضرار الناتجة عن استخدام المنتجات أو الخدمات.
              استشر الطبيب قبل استخدام أي عشبة طبية، خاصة إذا كان لديك حالات صحية معينة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">التعديلات</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات جوهرية.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">القانون الحاكم</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              تخضع هذه الشروط للقانون السعودي. أي نزاع سيتم حله في محاكم المملكة العربية السعودية.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
