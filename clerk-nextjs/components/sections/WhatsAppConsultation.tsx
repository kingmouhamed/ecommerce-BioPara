'use client';
import { MessageCircle, Phone, Clock, Star } from 'lucide-react';

const whatsappNumber = "212673020264";

export default function WhatsAppConsultation() {
    const handleConsult = () => {
        const msg = encodeURIComponent(`السلام عليكم! أرغب في الحصول على استشارة مجانية حول الأعشاب الطبيعية المناسبة لحالتي. 🌿`);
        window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
    };

    return (
        <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden" id="whatsapp-consultation">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-yellow-300/10 blur-3xl pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10" dir="rtl">
                <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-10 md:p-14 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
                                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                                متاح الآن للرد
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                                استشارة عشبية مجانية 🌿
                            </h2>
                            <p className="text-green-100 text-lg leading-relaxed mb-6">
                                تحدث مع خبيرنا الطبيعي مباشرة عبر واتساب. أخبرنا عن حالتك الصحية وسنقترح لك أفضل الأعشاب الطبية المناسبة لن الطبيعة.
                            </p>

                            <div className="space-y-3 mb-8">
                                {[
                                    { icon: '🎯', text: 'تشخيص دقيق وتوصيات شخصية' },
                                    { icon: '⚡', text: 'رد خلال دقائق' },
                                    { icon: '🛡️', text: 'مجاني تماماً بلا التزامات' },
                                    { icon: '🌍', text: 'متاح لجميع المدن المغربية' },
                                ].map(({ icon, text }) => (
                                    <div key={text} className="flex items-center gap-3 text-white/90">
                                        <span className="text-xl">{icon}</span>
                                        <span className="font-medium">{text}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleConsult}
                                className="flex items-center gap-3 bg-white text-green-700 px-8 py-4 rounded-2xl font-black text-lg hover:bg-green-50 transition-all hover:-translate-y-1 shadow-xl hover:shadow-2xl"
                            >
                                <MessageCircle className="w-6 h-6" />
                                تحدث مع خبيرنا الآن
                            </button>
                        </div>

                        {/* Right: Stats */}
                        <div className="space-y-5">
                            <div className="bg-white/15 rounded-2xl p-6 flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                    <Star className="w-7 h-7 text-yellow-300 fill-yellow-300" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-2xl">4.9 / 5</p>
                                    <p className="text-green-100 text-sm">تقييم رضا العملاء</p>
                                </div>
                            </div>
                            <div className="bg-white/15 rounded-2xl p-6 flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                    <Phone className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-2xl">+1000</p>
                                    <p className="text-green-100 text-sm">استشارة أُجريت بنجاح</p>
                                </div>
                            </div>
                            <div className="bg-white/15 rounded-2xl p-6 flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                    <Clock className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-2xl">{'< 5 دقائق'}</p>
                                    <p className="text-green-100 text-sm">متوسط وقت الرد</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
