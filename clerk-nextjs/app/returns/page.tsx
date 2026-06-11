import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة الإرجاع | BioPara',
  description: 'تعرف على سياسة الإرجاع والاستبدال في متجر BioPara لضمان رضاك التام.',
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 text-center border-b border-emerald-100 pb-6">
            سياسة الإرجاع والاستبدال
          </h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <p className="text-lg mb-6">
                رضاكم هو هدفنا الأول في <strong>BioPara</strong>. إذا لم تكن راضياً تماماً عن مشترياتك، فنحن هنا لمساعدتك من خلال سياسة إرجاع مرنة وميسرة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">1</span>
                فترة الإرجاع
              </h2>
              <p>
                نحن نوفر لك إمكانية إرجاع أو استبدال المنتجات خلال <strong>7 أيام</strong> من تاريخ استلام الطلب.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">2</span>
                شروط الإرجاع
              </h2>
              <p className="mb-2">لضمان قبول طلب الإرجاع، يجب توفر الشروط التالية:</p>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li>أن يكون المنتج في حالته الأصلية وغير مستخدم.</li>
                <li>أن يكون في عبوته الأصلية مع جميع الملصقات.</li>
                <li>يجب إرفاق فاتورة الشراء الأصلية أو رقم الطلب.</li>
                <li>المنتجات القابلة للتلف السريع، المفتوحة، أو المستخدمة جزئياً لا يمكن إرجاعها لأسباب صحية.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">3</span>
                خطوات الإرجاع
              </h2>
              <ol className="list-decimal list-inside space-y-2 mr-4">
                <li>تواصل مع خدمة العملاء عبر تطبيق الواتساب أو البريد الإلكتروني مع ذكر رقم الطلب وسبب الإرجاع.</li>
                <li>سيقوم فريقنا بمراجعة الطلب وترتيب عملية استلام المنتج من قبل شركة الشحن.</li>
                <li>بمجرد استلامنا للمنتج وفحصه، سيتم إعلامك بقبول الإرجاع.</li>
                <li>سيتم استرداد المبلغ بطريقة الدفع الأصلية أو عبر تحويل بنكي خلال 3 إلى 7 أيام عمل.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">4</span>
                تكاليف الشحن
              </h2>
              <p>
                في حال كان الإرجاع بسبب خطأ من قبلنا (منتج خاطئ أو تالف)، سنتحمل كافة تكاليف الشحن. أما في حال كان الإرجاع بسبب تغيير رأي العميل، فقد يتحمل العميل رسوم الشحن.
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
