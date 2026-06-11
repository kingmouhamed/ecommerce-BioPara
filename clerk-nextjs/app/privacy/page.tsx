import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | BioPara',
  description: 'تعرف على سياسة الخصوصية وكيفية حماية بياناتك الشخصية في متجر BioPara.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16" dir="rtl">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-8 text-center border-b border-emerald-100 pb-6">
            سياسة الخصوصية
          </h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">1</span>
                مقدمة
              </h2>
              <p>
                نحن في <strong>BioPara</strong> نولي أهمية قصوى لحماية بياناتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمعنا للمعلومات، استخدامها، وحمايتها عند زيارتك لمتجرنا الإلكتروني واستخدام خدماتنا.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">2</span>
                المعلومات التي نجمعها
              </h2>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li><strong>المعلومات الشخصية:</strong> مثل الاسم، عنوان البريد الإلكتروني، رقم الهاتف، وعنوان الشحن والتوصيل.</li>
                <li><strong>معلومات الدفع:</strong> نحن لا نخزن بيانات البطاقات الائتمانية؛ تتم معالجة المدفوعات عبر بوابات دفع آمنة ومشفرة.</li>
                <li><strong>بيانات التصفح:</strong> نجمع معلومات تلقائية مثل عنوان IP ونوع المتصفح لتحسين تجربة المستخدم.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">3</span>
                كيف نستخدم معلوماتك؟
              </h2>
              <p className="mb-2">نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
              <ul className="list-disc list-inside space-y-2 mr-4">
                <li>معالجة طلباتك وتوصيل المنتجات إليك.</li>
                <li>التواصل معك بخصوص حالة الطلب أو تقديم دعم العملاء.</li>
                <li>إرسال العروض الترويجية والتحديثات (يمكنك إلغاء الاشتراك في أي وقت).</li>
                <li>تحسين وتطوير متجرنا وخدماتنا.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">4</span>
                مشاركة المعلومات
              </h2>
              <p>
                نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك فقط مع مزودي الخدمات الموثوقين (مثل شركات الشحن) بالقدر اللازم لتقديم خدماتنا.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">5</span>
                حماية البيانات
              </h2>
              <p>
                نستخدم أحدث تقنيات التشفير (SSL) وإجراءات الأمان الصارمة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفصاح.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">6</span>
                تعديلات على سياسة الخصوصية
              </h2>
              <p>
                نحتفظ بالحق في تحديث هذه السياسة من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة، وننصح بمراجعتها بشكل دوري.
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
