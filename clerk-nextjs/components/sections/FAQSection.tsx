'use client';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
    {
        q: 'هل منتجاتكم عضوية ومعتمدة؟',
        a: 'نعم، جميع منتجاتنا مصدّقة من مختبرات معتمدة دولياً. نحرص على الحصول على الأعشاب من مصادر طبيعية نقية خالية من المبيدات الكيميائية والمواد الحافظة الاصطناعية.',
    },
    {
        q: 'كم يستغرق التوصيل إلى مدينتي؟',
        a: 'يصلك طلبك خلال 24-48 ساعة للمدن الكبرى (الدار البيضاء، الرباط، مراكش، فاس). بالنسبة للمناطق الأخرى، قد يصل الأمر إلى 3 أيام عمل. نقدم خدمة التتبع المباشر لطلبك.',
    },
    {
        q: 'هل يمكنني الدفع عند الاستلام؟',
        a: 'بالتأكيد! نوفر خدمة الدفع عند الاستلام (الكاش) في جميع مناطق المغرب. يمكنك أيضاً الدفع عبر بطاقة الائتمان أو عبر خدمة التحويل البنكي.',
    },
    {
        q: 'كيف أحفظ الأعشاب للحفاظ على فعاليتها؟',
        a: 'يُنصح بحفظ الأعشاب في مكان بارد وجاف بعيد عن أشعة الشمس المباشرة. استخدم أوعية زجاجية محكمة الإغلاق. الصلاحية تتراوح بين 12 إلى 24 شهراً من تاريخ التعبئة.',
    },
    {
        q: 'هل لديكم ضمان استرجاع المنتج؟',
        a: 'نعم، نقدم ضمان استرجاع كامل خلال 7 أيام من استلام طلبك في حال عدم رضاك عن جودة المنتج. الاسترجاع بسيط ولا يتطلب شرحاً مطولاً.',
    },
    {
        q: 'هل يمكنني الاستشارة قبل الشراء؟',
        a: 'بالطبع! نوفر استشارة عشبية مجانية عبر واتساب. متخصصونا متاحون يومياً لمساعدتك في اختيار المنتجات المناسبة لحالتك الصحية وتحقيق أفضل النتائج.',
    },
    {
        q: 'هل تشحنون خارج المغرب؟',
        a: 'حالياً، نخدم السوق المغربية فقط. نعمل على توسيع نطاقنا لتشمل دول المغرب العربي والشرق الأوسط قريباً. تابعونا لمعرفة آخر التحديثات!',
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 bg-white" id="faq">
            <div className="container mx-auto px-4 max-w-3xl" dir="rtl">
                <div className="text-center mb-14">
                    <span className="inline-block bg-blue-100 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                        الأسئلة الشائعة
                    </span>
                    <h2 className="text-4xl font-black text-gray-900 mb-3">كل ما تريد معرفته</h2>
                    <p className="text-gray-500 text-lg">لديك سؤال؟ قد تجد الإجابة هنا</p>
                </div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === i ? 'border-emerald-300 shadow-md' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-5 text-right bg-white hover:bg-gray-50 transition-colors"
                            >
                                <span className={`font-bold text-base ${openIndex === i ? 'text-emerald-700' : 'text-gray-900'}`}>
                                    {faq.q}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-emerald-600 flex-shrink-0 mr-4 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-60' : 'max-h-0'}`}>
                                <p className="px-5 pb-5 text-gray-600 leading-relaxed text-sm border-t border-gray-100 pt-4">
                                    {faq.a}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 bg-emerald-50 rounded-2xl p-6 text-center border border-emerald-100">
                    <p className="text-gray-700 font-medium mb-3">لم تجد إجابة على سؤالك؟</p>
                    <a
                        href="https://wa.me/212673020264"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md"
                    >
                        تواصل معنا مباشرة
                    </a>
                </div>
            </div>
        </section>
    );
}
