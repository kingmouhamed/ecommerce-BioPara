import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'الشحن والتوصيل | BioPara',
  description: 'معلومات الشحن والتوصيل الموثوقة والسريعة في متجر BioPara.',
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 text-center border-b border-emerald-100 pb-6">
            الشحن والتوصيل
          </h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">1</span>
                مناطق التغطية
              </h2>
              <p>
                نحن في <strong>BioPara</strong> نفخر بتقديم خدمات التوصيل لجميع المدن والمناطق داخل المملكة المغربية، مع ضمان وصول منتجاتك بأمان وسرعة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">2</span>
                مدة التوصيل
              </h2>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li><strong>الدار البيضاء والنواحي:</strong> التوصيل خلال 24 ساعة.</li>
                <li><strong>باقي المدن المغربية:</strong> يستغرق التوصيل بين 2 إلى 4 أيام عمل كحد أقصى.</li>
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                ملاحظة: لا يشمل وقت التوصيل أيام الأحد والعطلات الرسمية.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">3</span>
                رسوم الشحن
              </h2>
              <p className="mb-2">
                نسعى لتقديم أفضل الأسعار لعملائنا:
              </p>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li><strong>شحن مجاني:</strong> لجميع الطلبات التي تتجاوز قيمتها 200 درهم مغربي.</li>
                <li><strong>الطلبات أقل من 200 درهم:</strong> يتم احتساب رسوم شحن رمزية تعتمد على مدينتك وسيتم عرضها بوضوح في صفحة الدفع.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">4</span>
                تتبع الطلب
              </h2>
              <p>
                بمجرد تأكيد شحن طلبك، يمكنك تتبع حالة الشحنة مباشرة عبر صفحة <strong>تتبع الطلب</strong> في متجرنا باستخدام رقم هاتفك أو رقم الطلب المرفق في الإيصال.
              </p>
            </section>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
            آخر تحديث: يونيو 2026
          </div>
        </div>
      </div>
    </div>
  )
}
