'use client';
import { Shield, Leaf, FlaskConical, Truck, RotateCcw, HeadphonesIcon } from 'lucide-react';

const badges = [
    { icon: Leaf, label: '100% طبيعي', sub: 'خالٍ من المواد الكيميائية', color: 'emerald' },
    { icon: Shield, label: 'عضوي معتمد', sub: 'شهادات دولية معترف بها', color: 'green' },
    { icon: FlaskConical, label: 'مختبر مُعتمد', sub: 'فحوصات جودة دورية صارمة', color: 'teal' },
    { icon: Truck, label: 'توصيل 24 ساعة', sub: 'لجميع المدن المغربية', color: 'blue' },
    { icon: RotateCcw, label: 'ضمان 7 أيام', sub: 'استرداد كامل بلا شروط', color: 'violet' },
    { icon: HeadphonesIcon, label: 'دعم 24/7', sub: 'فريق متخصص دائماً معك', color: 'rose' },
];

const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    teal: 'bg-teal-100 text-teal-700 border-teal-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    violet: 'bg-violet-100 text-violet-700 border-violet-200',
    rose: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function TrustBadges() {
    return (
        <section className="py-14 bg-white border-b border-gray-100" id="trust">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {badges.map(({ icon: Icon, label, sub, color }) => (
                        <div
                            key={label}
                            className={`flex flex-col items-center text-center p-5 rounded-2xl border ${colorMap[color]} hover:scale-105 transition-transform cursor-default`}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-white shadow-sm">
                                <Icon className="w-6 h-6" />
                            </div>
                            <p className="font-bold text-sm leading-tight mb-1">{label}</p>
                            <p className="text-xs opacity-75 leading-snug">{sub}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
