'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const benefits = [
    {
        icon: '🛡️',
        title: 'أعشاب المناعة',
        desc: 'قوّي دفاعاتك الطبيعية ضد الأمراض',
        slug: 'herbs?benefit=immunity',
        gradient: 'from-emerald-500 to-green-600',
        count: 12,
    },
    {
        icon: '🌿',
        title: 'أعشاب الهضم',
        desc: 'راحة وصحة للجهاز الهضمي',
        slug: 'herbs?benefit=digestion',
        gradient: 'from-lime-500 to-emerald-600',
        count: 9,
    },
    {
        icon: '🌙',
        title: 'أعشاب النوم',
        desc: 'نوم عميق وهادئ بدون أعراض جانبية',
        slug: 'herbs?benefit=sleep',
        gradient: 'from-indigo-500 to-purple-600',
        count: 7,
    },
    {
        icon: '⚡',
        title: 'أعشاب الطاقة',
        desc: 'نشاط وحيوية طوال اليوم بشكل طبيعي',
        slug: 'herbs?benefit=energy',
        gradient: 'from-amber-500 to-orange-600',
        count: 8,
    },
    {
        icon: '🧘',
        title: 'أعشاب التوتر',
        desc: 'هدوء الأعصاب وتخفيف القلق',
        slug: 'herbs?benefit=stress',
        gradient: 'from-rose-500 to-pink-600',
        count: 6,
    },
];

export default function HerbsByBenefit() {
    return (
        <section className="py-20 bg-gray-50" id="herbs-by-benefit">
            <div className="container mx-auto px-4" dir="rtl">
                <div className="text-center mb-14">
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                        اختر حسب احتياجك
                    </span>
                    <h2 className="text-4xl font-black text-gray-900 mb-3">أعشاب لكل فائدة</h2>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        اكتشف الأعشاب الطبيعية المناسبة لاحتياجاتك الصحية اليومية
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                    {benefits.map((b) => (
                        <Link
                            key={b.slug}
                            href={`/products?${b.slug}`}
                            className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                        >
                            {/* Gradient background */}
                            <div className={`bg-gradient-to-br ${b.gradient} p-6 h-full flex flex-col justify-between min-h-[180px]`}>
                                <div>
                                    <div className="text-5xl mb-3">{b.icon}</div>
                                    <h3 className="text-white font-black text-lg leading-tight">{b.title}</h3>
                                    <p className="text-white/80 text-sm mt-1 leading-snug">{b.desc}</p>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {b.count} منتج
                                    </span>
                                    <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
