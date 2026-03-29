'use client';
import { useState } from 'react';
import { Send, Gift, BookOpen, Mail } from 'lucide-react';

const perks = [
    { icon: '📖', text: 'دليل "50 علاجاً عشبياً طبيعياً" مجاناً' },
    { icon: '🎁', text: 'خصم 10% على أول طلب' },
    { icon: '🌿', text: 'نصائح صحية أسبوعية حصرية' },
    { icon: '🔔', text: 'إشعار فوري بالعروض الجديدة' },
];

export default function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
        }
    };

    return (
        <section className="py-20 bg-emerald-600 relative overflow-hidden" id="newsletter">
            {/* Background blobs */}
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] -left-10 w-64 h-64 rounded-full bg-yellow-300/10 blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10" dir="rtl">
                <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 md:p-14 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                        {/* Left: Lead magnet description */}
                        <div>
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-sm font-black mb-5">
                                <Gift className="w-4 h-4" />
                                هدية مجانية عند الاشتراك!
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                                احصل على دليل <br />
                                <span className="text-yellow-300">50 علاجاً عشبياً</span> طبيعياً
                            </h2>
                            <p className="text-emerald-100 leading-relaxed mb-7">
                                اشترك في نشرتنا البريدية واحصل فوراً على دليل الشفاء الطبيعي الشامل الذي أعدّه خبراؤنا بعناية، بالإضافة إلى خصم حصري 10% على أول طلبك.
                            </p>

                            <div className="space-y-3">
                                {perks.map(({ icon, text }) => (
                                    <div key={text} className="flex items-center gap-3 text-white">
                                        <span className="text-xl">{icon}</span>
                                        <span className="font-medium text-sm">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Form */}
                        <div>
                            {submitted ? (
                                <div className="bg-white rounded-2xl p-10 text-center shadow-xl">
                                    <div className="text-6xl mb-4">🎉</div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-3">أهلاً بك في عائلة BioPara!</h3>
                                    <p className="text-gray-600 mb-5">
                                        تم الاشتراك بنجاح! ستصلك رسالة فور اكتمال التسجيل تحتوي على الدليل المجاني وكود الخصم.
                                    </p>
                                    <div className="bg-emerald-50 rounded-xl p-4">
                                        <p className="text-emerald-700 font-black text-lg">كود الخصم: <span className="text-2xl">BIO10</span></p>
                                        <p className="text-emerald-600 text-sm mt-1">خصم 10% على طلبك الأول</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl p-8 shadow-xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900">اشترك الآن</p>
                                            <p className="text-gray-500 text-xs">+3500 مشترك يثقون بنا</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">اسمك الكريم</label>
                                            <input
                                                type="text"
                                                placeholder="أدخل اسمك..."
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-800 placeholder-gray-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">بريدك الإلكتروني</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="example@email.com"
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-gray-800 placeholder-gray-400 text-left"
                                                dir="ltr"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-lg hover:bg-emerald-700 hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-5 h-5" />
                                            اشتراك مجاني الآن
                                        </button>
                                    </form>

                                    <p className="text-gray-400 text-xs text-center mt-4">
                                        🔒 بياناتك آمنة تماماً. لن نرسل لك سبام أبداً.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
