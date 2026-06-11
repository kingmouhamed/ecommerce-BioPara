import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'شروط الاستخدام | BioPara',
  description: 'اقرأ شروط الاستخدام والأحكام المتعلقة باستخدام متجر BioPara.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 text-center border-b border-emerald-100 pb-6">
            شروط الاستخدام
          </h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">1</span>
                قبول الشروط
              </h2>
              <p>
                بدخولك إلى متجر <strong>BioPara</strong> واستخدامه، فإنك توافق على الالتزام بشروط الاستخدام هذه وجميع القوانين واللوائح المعمول بها. إذا كنت لا توافق على أي من هذه الشروط، يُحظر عليك استخدام هذا الموقع أو الوصول إليه.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">2</span>
                استخدام المتجر
              </h2>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li>يجب ألا يقل عمرك عن السن القانوني في بلد إقامتك لإجراء عمليات الشراء.</li>
                <li>تتعهد بأن جميع المعلومات التي تقدمها (مثل بيانات الشحن والاتصال) صحيحة ودقيقة.</li>
                <li>يُمنع استخدام الموقع لأي أغراض غير قانونية أو غير مصرح بها.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">3</span>
                المنتجات والأسعار
              </h2>
              <p>
                نسعى جاهدين لعرض ألوان وصور منتجاتنا بدقة، ومع ذلك لا يمكننا ضمان أن تعرض شاشة حاسوبك الألوان بدقة تامة. جميع الأسعار تخضع للتغيير دون إشعار مسبق.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">4</span>
                الطلبات والمدفوعات
              </h2>
              <p>
                نحتفظ بالحق في رفض أي طلب تضعه لدينا. قد نقوم، وفقاً لتقديرنا الخاص، بالحد من الكميات المشتراة أو إلغائها لكل شخص أو لكل أسرة أو لكل طلب. نحن نوفر خدمة "الدفع عند الاستلام" كخيار أساسي، بالإضافة إلى بوابات الدفع الإلكترونية المعتمدة.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">5</span>
                إخلاء المسؤولية
              </h2>
              <p>
                المنتجات الطبيعية والمكملات الغذائية المعروضة في المتجر ليست بديلاً عن الاستشارة الطبية المتخصصة. نرجو استشارة الطبيب قبل استخدام أي منتج إذا كنت تعاني من حالات صحية خاصة.
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
