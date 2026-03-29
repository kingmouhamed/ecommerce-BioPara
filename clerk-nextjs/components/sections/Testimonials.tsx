'use client';
import { Star, MapPin, CheckCircle } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: 'فاطمة أمزيان',
        city: 'الدار البيضاء',
        avatar: '👩',
        rating: 5,
        productBought: 'باقة المناعة الذهبية',
        review: 'منذ استخدامي لباقة المناعة من BioPara، لم أصب بأي نزلة برد طوال الشتاء! المنتجات طبيعية 100% وفعاليتها مثبتة. أنصح بها بشدة لكل العائلة.',
        verified: true,
        date: 'يناير 2026',
    },
    {
        id: 2,
        name: 'أحمد بوجمعة',
        city: 'مراكش',
        avatar: '👨',
        rating: 5,
        productBought: 'باقة الطاقة الطبيعية',
        review: 'كنت أعاني من إرهاق مستمر. بعد أسبوعين فقط من استخدام باقة الطاقة، شعرت بتحسن ملحوظ في نشاطي وتركيزي. التوصيل كان سريعاً جداً!',
        verified: true,
        date: 'فبراير 2026',
    },
    {
        id: 3,
        name: 'خديجة بنعلي',
        city: 'فاس',
        avatar: '👩‍🦱',
        rating: 5,
        productBought: 'شاي الأعشاب المريح',
        review: 'مذاق رائع وجودة استثنائية. استخدمت شاي الأعشاب للنوم وأصبح نومي أعمق وأهدأ. سعر معقول جداً مقارنة بما تحصل عليه من فوائد.',
        verified: true,
        date: 'مارس 2026',
    },
    {
        id: 4,
        name: 'يوسف العيد',
        city: 'أكادير',
        avatar: '👨‍💼',
        rating: 5,
        productBought: 'زيت الأرغان العضوي',
        review: 'اشتريت زيت الأرغان لزوجتي وهي سعيدة جداً بالنتائج. بشرتها أصبحت أكثر إشراقاً خلال أسبوع واحد فقط. منتج أصيل وليس مغشوشاً!',
        verified: true,
        date: 'ديسمبر 2025',
    },
    {
        id: 5,
        name: 'سلمى الإدريسي',
        city: 'الرباط',
        avatar: '👩‍🔬',
        rating: 5,
        productBought: 'الكركم والزنجبيل',
        review: 'كممرضة، أنا حذرة جداً في اختيار المنتجات. BioPara يقدم منتجات ذات جودة مختبرية حقيقية. أنصح به لكل من يهتم بصحته واستخدامه طبي.',
        verified: true,
        date: 'يناير 2026',
    },
    {
        id: 6,
        name: 'محمد السوسي',
        city: 'طنجة',
        avatar: '🧔',
        rating: 5,
        productBought: 'باقة التخلص من السموم',
        review: 'بعد رمضان جربت باقة الديتوكس، والنتيجة مذهلة! شعرت بخفة وصفاء ذهني واضح. الخدمة ممتازة والتغليف احترافي جداً.',
        verified: true,
        date: 'أبريل 2025',
    },
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-gray-50" id="testimonials">
            <div className="container mx-auto px-4" dir="rtl">
                <div className="text-center mb-14">
                    <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                        آراء موثوقة 100%
                    </span>
                    <h2 className="text-4xl font-black text-gray-900 mb-3">ماذا يقول عملاؤنا؟</h2>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-gray-700 font-bold mr-1">4.9 / 5</span>
                        <span className="text-gray-400 text-sm">(+1000 تقييم موثق)</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
                        >
                            {/* Stars */}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Review text */}
                            <p className="text-gray-700 leading-relaxed text-sm flex-1 mb-5">
                                &ldquo;{t.review}&rdquo;
                            </p>

                            {/* Product badge */}
                            <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full inline-block w-fit mb-4">
                                ✓ اشترى: {t.productBought}
                            </div>

                            {/* Customer info */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                                        <div className="flex items-center gap-1 text-gray-400 text-xs">
                                            <MapPin className="w-3 h-3" />
                                            <span>{t.city}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left">
                                    {t.verified && (
                                        <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            <span>مشترٍ موثق</span>
                                        </div>
                                    )}
                                    <p className="text-gray-400 text-xs mt-0.5">{t.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
