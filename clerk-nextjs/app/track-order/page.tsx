"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, MessageCircle, AlertCircle } from "lucide-react";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isTracking, setIsTracking] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [error, setError] = useState(false);

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId || !phoneNumber) {
            setError(true);
            return;
        }
        setError(false);
        setIsTracking(true);
        setShowResult(false);

        // Simulate API logic delay
        setTimeout(() => {
            setIsTracking(false);
            setShowResult(true);
        }, 1500);
    };

    const currentStep = 2; // Simulated status: 0=pending, 1=processing, 2=shipped, 3=delivered

    const steps = [
        { title: "تم تأكيد الطلب", desc: "استلمنا طلبك بنجاح ونقوم بمراجعته.", icon: Package, date: "05 مارس 2026 - 10:30 ص" },
        { title: "قيد التجهيز", desc: "نحن نقوم بتجهيز وتغليف منتجاتك الطبيعية بعناية فائقة.", icon: Clock, date: "06 مارس 2026 - 09:15 ص" },
        { title: "في الطريق إليك", desc: "طلبك مع مندوب شركة الشحن الآن وفي طريقه إليك.", icon: Truck, date: "08 مارس 2026 - 08:00 ص" },
        { title: "تم التوصيل", desc: "استلمت طلبك بنجاح. نتمنى لك دوام الصحة!", icon: CheckCircle, date: "متوقع اليوم" },
    ];

    return (
        <div className="min-h-[80vh] bg-gray-50 py-12 lg:py-20" dir="rtl">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-6 relative">
                        <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-20" />
                        <Search className="w-10 h-10 relative z-10" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">تتبع طلبك بسهولة</h1>
                    <p className="text-gray-500 text-lg">أدخل رقم الطلب ورقم الهاتف المرتبط به لمعرفة حالة شحنتك خطوة بخطوة.</p>
                </div>

                {/* Tracking Form */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 mb-8 transition-all hover:shadow-md">
                    <form onSubmit={handleTrack} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">رقم الطلب</label>
                                <input
                                    type="text"
                                    placeholder="مثال: BIO-12345"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    className="w-full px-5 py-4 border-2 border-gray-100 bg-gray-50 rounded-2xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-gray-800 text-left font-medium placeholder:text-gray-400"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف المرتبط بالطلب</label>
                                <input
                                    type="tel"
                                    placeholder="06 XX XX XX XX"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full px-5 py-4 border-2 border-gray-100 bg-gray-50 rounded-2xl focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-gray-800 text-left font-medium placeholder:text-gray-400"
                                    dir="ltr"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 text-sm font-bold p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>المرجو إدخال كلاً من رقم الطلب ورقم الهاتف لنتمكن من تتبع الشحنة.</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isTracking}
                            className={`w-full py-4 rounded-2xl font-black text-lg text-white transition-all shadow-md flex items-center justify-center gap-3 ${isTracking
                                    ? "bg-emerald-400 cursor-wait shadow-none"
                                    : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl hover:-translate-y-1"
                                }`}
                        >
                            {isTracking ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    جاري البحث عن الطلب...
                                </>
                            ) : (
                                <>
                                    <Search className="w-6 h-6" />
                                    تتبع الشحنة الآن
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Tracking Results */}
                {showResult && (
                    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100/50 p-6 md:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
                        {/* Request Summary Top */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-100">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">رقم الطلب الخاص بك</p>
                                <p className="text-2xl font-black text-gray-900 tracking-wider" dir="ltr">{orderId.toUpperCase() || "BIO-98765"}</p>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 w-fit">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                </span>
                                <span>الشحنة في الطريق إليك</span>
                            </div>
                        </div>

                        {/* Timeline UI */}
                        <div className="relative pr-2 md:pr-4">
                            {/* The vertical line container connecting icons */}
                            <div className="absolute top-6 bottom-10 right-[25px] md:right-[33px] w-0.5 bg-gray-100 z-0">
                                {/* Active part of the line */}
                                <div
                                    className="absolute top-0 w-full bg-emerald-500 transition-all duration-1000 ease-out"
                                    style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
                                ></div>
                            </div>

                            <div className="space-y-10 relative z-10">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isCompleted = index <= currentStep;
                                    const isCurrent = index === currentStep;

                                    return (
                                        <div key={index} className={`flex gap-6 md:gap-8 ${isCompleted ? 'opacity-100' : 'opacity-40 grayscale group'}`}>
                                            {/* Icon Circle */}
                                            <div className={`w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500 ${isCompleted
                                                    ? 'bg-emerald-500 text-white rotate-0'
                                                    : 'bg-white text-gray-400 border-2 border-gray-100 rotate-12 group-hover:rotate-0'
                                                } ${isCurrent ? 'ring-4 ring-emerald-100 ring-offset-2 scale-110' : ''}`}>
                                                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                            </div>

                                            {/* Content */}
                                            <div className={`flex-1 pt-1 md:pt-2 transition-all duration-500 ${isCurrent ? '-translate-y-1' : ''}`}>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                                    <h3 className={`font-black text-lg md:text-xl ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                                        {step.title}
                                                    </h3>
                                                    <span className="bg-gray-50 text-gray-500 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 w-fit">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span dir="ltr">{step.date}</span>
                                                    </span>
                                                </div>
                                                <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-lg">{step.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Delivery address card */}
                        <div className="mt-12 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-emerald-200 transition-colors">
                            <div className="bg-white p-4 rounded-xl flex-shrink-0 text-emerald-600 shadow-sm border border-gray-100">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">عنوان التوصيل المرتبط بالطلب</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    الحي المحمدي، شارع الحسن الثاني، الدار البيضاء، المغرب
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Need Help Footer */}
                <div className="mt-10 text-center bg-emerald-50/50 rounded-3xl p-8 border border-emerald-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-sm">
                        <MessageCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-gray-900 mb-2">هل تواجه مشكلة في الشحنة؟</h3>
                    <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">فريق خدمة العملاء لدينا مستعد لمساعدتك والإجابة على استفساراتك عبر الواتساب طوال أيام الأسبوع.</p>
                    <a
                        href="https://wa.me/212673020264"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-600 transition-all hover:-translate-y-1 shadow-md hover:shadow-xl"
                    >
                        تواصل مع الدعم المباشر
                    </a>
                </div>
            </div>
        </div>
    );
}
