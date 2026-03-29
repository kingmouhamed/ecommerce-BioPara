'use client';
import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const recipes = [
    {
        id: 1,
        emoji: '🍵',
        title: 'شاي المناعة السحري',
        desc: 'مزيج الزنجبيل والكركم والليمون مع العسل لتعزيز المناعة في الشتاء',
        time: '5 دقائق',
        difficulty: 'سهل',
        ingredients: ['زنجبيل طازج', 'كركم', 'عصير ليمون', 'عسل طبيعي'],
        benefit: '🛡️ تقوية المناعة',
        slug: 'immunity-tea',
    },
    {
        id: 2,
        emoji: '🌙',
        title: 'شاي النوم الهادئ',
        desc: 'البابونج والخزامى والنعناع لنوم عميق وهادئ دون منبهات اصطناعية',
        time: '7 دقائق',
        difficulty: 'سهل',
        ingredients: ['بابونج مجفف', 'أزهار خزامى', 'نعناع', 'عسل'],
        benefit: '😴 نوم عميق',
        slug: 'sleep-tea',
    },
    {
        id: 3,
        emoji: '⚡',
        title: 'منشط الطاقة الصباحي',
        desc: 'مشروب الجينسنغ والكاكاو الخام لبداية يوم نشيط وإنتاجي',
        time: '10 دقائق',
        difficulty: 'متوسط',
        ingredients: ['جينسنغ مسحوق', 'كاكاو خام', 'حليب نباتي', 'قرفة'],
        benefit: '⚡ طاقة فورية',
        slug: 'energy-drink',
    },
    {
        id: 4,
        emoji: '🌿',
        title: 'علاج الهضم الطبيعي',
        desc: 'أعشاب النعناع والشمر والكمون لهضم سليم وراحة مثالية بعد الأكل',
        time: '8 دقائق',
        difficulty: 'سهل',
        ingredients: ['نعناع طازج', 'بذور شمر', 'كمون', 'زنجبيل'],
        benefit: '🌿 هضم صحي',
        slug: 'digestive-tea',
    },
];

export default function HerbalRecipes() {
    return (
        <section className="py-20 bg-emerald-950 text-white" id="recipes">
            <div className="container mx-auto px-4" dir="rtl">
                <div className="text-center mb-14">
                    <span className="inline-block bg-emerald-800 text-emerald-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                        🌿 وصفاتنا العشبية
                    </span>
                    <h2 className="text-4xl font-black text-white mb-3">وصفات طبيعية من مطبخنا</h2>
                    <p className="text-emerald-300 text-lg max-w-xl mx-auto">
                        دليلك العملي لتحضير أقوى العلاجات العشبية في بيتك
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="bg-emerald-900/60 backdrop-blur border border-emerald-800 rounded-2xl overflow-hidden hover:bg-emerald-900 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 pb-4">
                                <div className="text-5xl mb-4">{recipe.emoji}</div>
                                <span className="bg-emerald-700/60 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
                                    {recipe.benefit}
                                </span>
                                <h3 className="text-lg font-black text-white mt-3 mb-2">{recipe.title}</h3>
                                <p className="text-emerald-300 text-sm leading-relaxed">{recipe.desc}</p>
                            </div>

                            {/* Ingredients */}
                            <div className="px-6 pb-4 flex-1">
                                <p className="text-emerald-400 text-xs font-bold mb-2 uppercase tracking-wider">المكونات:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {recipe.ingredients.map((ing) => (
                                        <span key={ing} className="bg-emerald-800/60 text-emerald-200 text-xs px-2.5 py-1 rounded-full">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-emerald-800 flex items-center justify-between">
                                <div className="flex items-center gap-3 text-emerald-400 text-xs">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{recipe.time}</span>
                                    </div>
                                    <span>•</span>
                                    <span>{recipe.difficulty}</span>
                                </div>
                                <Link
                                    href={`/blog/${recipe.slug}`}
                                    className="flex items-center gap-1 text-emerald-400 hover:text-white text-xs font-bold transition-colors"
                                >
                                    الوصفة كاملة
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/blog?category=recipes"
                        className="inline-flex items-center gap-2 border-2 border-emerald-600 text-emerald-300 px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all"
                    >
                        تصفح جميع الوصفات
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
