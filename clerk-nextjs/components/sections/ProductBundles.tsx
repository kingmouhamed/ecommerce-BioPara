'use client';
import Link from 'next/link';
import { Gift, Star, ShoppingCart, Zap } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const bundles = [
    {
        id: 'immunity-bundle',
        badge: '🛡️ الأكثر مبيعاً',
        badgeColor: 'bg-emerald-500',
        title: 'باقة المناعة الذهبية',
        description: 'مزيج مثالي من الأعشاب الطبيعية لتعزيز المناعة والوقاية من الأمراض الموسمية',
        products: ['إشنصا', 'الزنجبيل', 'الكركم', 'فيتامين C'],
        originalPrice: 380,
        bundlePrice: 289,
        savings: 91,
        gradient: 'from-emerald-50 to-green-50',
        border: 'border-emerald-200',
        slug: 'immunity-bundle',
    },
    {
        id: 'energy-bundle',
        badge: '⚡ الأفضل للنشاط',
        badgeColor: 'bg-amber-500',
        title: 'باقة الطاقة الطبيعية',
        description: 'تركيبة فريدة من الأعشاب المنشطة لتعزيز الطاقة والحيوية طوال اليوم',
        products: ['جينسنغ', 'ماكا', 'أشواجاندا', 'زيت جوز الهند'],
        originalPrice: 450,
        bundlePrice: 339,
        savings: 111,
        gradient: 'from-amber-50 to-orange-50',
        border: 'border-amber-200',
        slug: 'energy-bundle',
    },
    {
        id: 'detox-bundle',
        badge: '🌿 تطهير الجسم',
        badgeColor: 'bg-teal-500',
        title: 'باقة التخلص من السموم',
        description: 'أعشاب طبيعية مختارة تساعد الكبد والكلى على أداء وظيفة التنقية بكفاءة',
        products: ['الهندباء', 'شوك مريم', 'شاي البول', 'الزعتر'],
        originalPrice: 320,
        bundlePrice: 239,
        savings: 81,
        gradient: 'from-teal-50 to-cyan-50',
        border: 'border-teal-200',
        slug: 'detox-bundle',
    },
];

export default function ProductBundles() {
    const { addToCart, setIsCartOpen } = useCart();

    const handleBundleAdd = (bundle: typeof bundles[0]) => {
        addToCart({
            id: bundle.id,
            title: bundle.title,
            price: bundle.bundlePrice,
            slug: bundle.slug,
            image: '/images/products/product-placeholder.jpg',
        });
        setIsCartOpen(true);
    };

    return (
        <section className="py-20 bg-white" id="bundles">
            <div className="container mx-auto px-4" dir="rtl">
                <div className="text-center mb-14">
                    <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                        <Gift className="w-4 h-4" />
                        عروض الباقات
                    </span>
                    <h2 className="text-4xl font-black text-gray-900 mb-3">باقات مميزة بأسعار خاصة</h2>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        وفّر أكثر عند شراء مجموعات منتجاتنا الطبيعية المتكاملة
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {bundles.map((bundle) => (
                        <div
                            key={bundle.id}
                            className={`relative bg-gradient-to-br ${bundle.gradient} border-2 ${bundle.border} rounded-3xl p-7 hover:shadow-xl transition-all duration-300 flex flex-col`}
                        >
                            {/* Badge */}
                            <span className={`absolute -top-3 right-6 ${bundle.badgeColor} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md`}>
                                {bundle.badge}
                            </span>

                            {/* Savings label */}
                            <div className="absolute -top-3 left-6 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md">
                                وفّر {bundle.savings} د.م
                            </div>

                            {/* Stars */}
                            <div className="flex items-center gap-1 mb-4 mt-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="text-gray-600 text-xs mr-1">(4.9)</span>
                            </div>

                            <h3 className="text-xl font-black text-gray-900 mb-2">{bundle.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">{bundle.description}</p>

                            {/* Products in bundle */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {bundle.products.map((p) => (
                                    <span key={p} className="bg-white/80 text-gray-700 text-xs font-bold px-3 py-1 rounded-full border border-white shadow-sm">
                                        ✓ {p}
                                    </span>
                                ))}
                            </div>

                            {/* Pricing */}
                            <div className="mt-auto">
                                <div className="flex items-baseline gap-3 mb-4">
                                    <span className="text-3xl font-black text-gray-900">{bundle.bundlePrice} <span className="text-base font-bold text-gray-500">د.م</span></span>
                                    <span className="text-gray-400 line-through text-lg">{bundle.originalPrice} د.م</span>
                                    <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-0.5 rounded-full">
                                        -{Math.round((bundle.savings / bundle.originalPrice) * 100)}%
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleBundleAdd(bundle)}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-all hover:-translate-y-1 shadow-md hover:shadow-lg"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    أضف الباقة للسلة
                                </button>
                                <Link href={`/products`} className="flex items-center justify-center gap-1 mt-3 text-sm text-emerald-700 hover:underline font-medium">
                                    <Zap className="w-3.5 h-3.5" />
                                    اكتشف المزيد من العروض
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
