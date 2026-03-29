'use client';
import { Leaf, Award, Microscope, Globe } from 'lucide-react';

const reasons = [
    {
        icon: Leaf,
        title: 'مصادر طبيعية أصيلة',
        desc: 'نجمع أعشابنا يدوياً من أودية المغرب وجباله الشاهقة، حيث تنمو في بيئة طبيعية خالصة بعيداً عن أي ملوثات صناعية.',
        stat: '100%',
        statLabel: 'طبيعي',
        bg: 'from-emerald-500 to-green-600',
    },
    {
        icon: Award,
        title: 'إرث عشبي مغربي أصيل',
        desc: 'نستلهم وصفاتنا من علم الأعشاب المغربي العريق المتوارث عبر الأجيال، مدعوماً اليوم بأحدث اعتمادات الجودة العالمية.',
        stat: '+30',
        statLabel: 'عشب مغربي',
        bg: 'from-amber-500 to-orange-600',
    },
    {
        icon: Microscope,
        title: 'رقابة جودة صارمة',
        desc: 'كل دفعة إنتاج تخضع لتحليل مخبري شامل لقياس النقاء والفاعلية وضمان خلو المنتج من أي مبيدات أو ملوثات.',
        stat: '3x',
        statLabel: 'فحص جودة',
        bg: 'from-teal-500 to-cyan-600',
    },
    {
        icon: Globe,
        title: 'ثروة المغرب النباتية',
        desc: 'يزخر المغرب بأكثر من 4000 نوع نباتي، كثير منها نادر وثمين. نحن فخورون بتقديم هذه الكنوز الطبيعية بشكل آمن وموثوق.',
        stat: '+4000',
        statLabel: 'نوع نباتي',
        bg: 'from-violet-500 to-purple-600',
    },
];

export default function WhyBioPara() {
    return (
        <section className="py-20 bg-gray-50" id="why-biopara">
            <div className="container mx-auto px-4" dir="rtl">
                <div className="text-center mb-14">
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                        قصتنا
                    </span>
                    <h2 className="text-4xl font-black text-gray-900 mb-3">لماذا BioPara؟</h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        نحن لسنا مجرد متجر. نحن رسالة لنشر ثقافة الطب الطبيعي الأصيل بأرقى معايير الجودة العالمية
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reasons.map(({ icon: Icon, title, desc, stat, statLabel, bg }) => (
                        <div key={title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex gap-6">
                            {/* Icon */}
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                                <Icon className="w-8 h-8 text-white" />
                            </div>
                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-black text-gray-900">{title}</h3>
                                    <div className="text-right mr-4">
                                        <p className={`text-2xl font-black bg-gradient-to-r ${bg} bg-clip-text text-transparent`}>{stat}</p>
                                        <p className="text-gray-400 text-xs">{statLabel}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Heritage banner */}
                <div className="mt-12 bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-10 text-center text-white shadow-xl">
                    <div className="text-5xl mb-4">🇲🇦</div>
                    <h3 className="text-2xl font-black mb-3">صنع بفخر في المغرب</h3>
                    <p className="text-emerald-100 max-w-2xl mx-auto leading-relaxed">
                        المغرب بلد ميزته الله بتنوع نباتي استثنائي وإرث عشبي عريق. في BioPara، نحمل هذا الإرث ونقدمه لك بأسلوب عصري ذي جودة مثالية لترقى بصحتك إلى مستوى أعلى.
                    </p>
                </div>
            </div>
        </section>
    );
}
