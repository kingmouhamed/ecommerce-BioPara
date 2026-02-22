"use client";

import { useState } from 'react';
import { Leaf, Droplet, Heart, Calendar, Phone, User, MessageSquare, Clock, Shield, CheckCircle } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ConsultationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    condition: '',
    preferredDate: '',
    preferredTime: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const scrollToForm = () => {
    document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    {
      icon: Leaf,
      title: 'العلاج بالأعشاب الطبية',
      description: 'خلطات طبيعية مدروسة بعناية لعلاج الأمراض المختلفة وتحسين الصحة العامة'
    },
    {
      icon: Droplet,
      title: 'الزيوت الطبيعية والعطرية',
      description: 'زيوت أصلية للاسترخاء والعلاج، مستخلصة من أفضل النباتات الطبية'
    },
    {
      icon: Heart,
      title: 'الرقية والعلاج الروحي',
      description: 'جلسات استشارية لتشخيص ومعالجة الحالات الروحية بالرقية الشرعية'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50" dir="rtl">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">تم استلام طلبك بنجاح!</h2>
              <p className="text-gray-600 mb-8 text-lg">
                شكراً لثقتك بـ BioPara. سنتواصل معك في أقرب وقت ممكن لتحديد موعد الاستشارة.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-green-900 mb-3">ما الخطوة التالية؟</h3>
                <ul className="text-right text-green-800 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    سنتواصل معك عبر الهاتف أو واتساب خلال 24 ساعة
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    سنحدد موعد الاستشارة المناسب لحالتك
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    سنقدم لك خطة علاجية متكاملة ومخصصة
                  </li>
                </ul>
              </div>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50" dir="rtl">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[
              { label: 'الرئيسية', href: '/' },
              { label: 'حجز استشارة', href: '/consultation' }
            ]}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-emerald-900/80"></div>
          <div className="absolute inset-0 bg-[url('/images/backgrounds/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              احجز استشارتك الخاصة
              <span className="block text-green-300">براحتك وشفائك</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              نجمع بين حكمة الأعشاب الطبية، الزيوت الطبيعية، والعلاج الروحي لنقدم لك العناية التي تستحقها في سرية تامة.
            </p>
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-3 bg-white text-green-700 px-8 py-4 rounded-lg font-bold hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg"
            >
              احجز موعدك الآن
              <Calendar className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">خدماتنا</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              نقدم مجموعة متكاملة من الخدمات الطبية والروحية لعلاج الجسد والروح
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="group">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 h-full border border-green-100 hover:border-green-300 transition-all hover:shadow-lg">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                      <Icon className="w-8 h-8 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">احجز استشارتك</h2>
              <p className="text-gray-600 text-lg">
                املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                      <User className="w-4 h-4" />
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                      <Phone className="w-4 h-4" />
                      رقم الهاتف / واتساب
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="أدخل رقم الهاتف أو واتساب"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferredDate" className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                      <Calendar className="w-4 h-4" />
                      التاريخ المفضل
                    </label>
                    <input
                      type="date"
                      id="preferredDate"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="preferredTime" className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                      <Clock className="w-4 h-4" />
                      الوقت المفضل
                    </label>
                    <select
                      id="preferredTime"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">اختر الوقت المناسب</option>
                      <option value="morning">الصباح (9:00 - 12:00)</option>
                      <option value="afternoon">بعد الظهر (14:00 - 17:00)</option>
                      <option value="evening">المساء (18:00 - 21:00)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="condition" className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                    <MessageSquare className="w-4 h-4" />
                    صف حالتك أو الأعراض التي تشعر بها
                  </label>
                  <textarea
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                    placeholder="صف حالتك الصحية أو الأعراض التي تشعر بها بالتفصيل..."
                  />
                </div>

                {/* Privacy Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-semibold mb-1">سرية تامة ومطلقة</p>
                      <p>
                        نحن نضمن سرية جميع معلوماتك الشخصية والطبية. جميع الاستشارات تتم في بيئة آمنة ومحترمة، ولن يتم مشاركة معلوماتك مع أي طرف ثالث دون موافقتك الصريحة.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      إرسال طلب الاستشارة
                      <Calendar className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">طرق التواصل الأخرى</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-green-50 rounded-xl p-6">
                <Phone className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">الهاتف</h3>
                <p className="text-gray-600">+212 673020264</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <MessageSquare className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">واتساب</h3>
                <p className="text-gray-600">+212 673020264</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6">
                <Clock className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">ساعات العمل</h3>
                <p className="text-gray-600">9:00 ص - 9:00 م</p>
                <p className="text-gray-600 text-sm">من السبت إلى الخميس</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
