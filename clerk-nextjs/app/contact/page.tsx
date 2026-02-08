"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">اتصل بنا</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نحن هنا لمساعدتك! تواصل معنا عبر أي من الطرق التالية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">معلومات التواصل</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-700 mt-1" />
                  <div>
                    <div className="font-medium">الهاتف</div>
                    <div className="text-gray-600">+212 600 000 000</div>
                    <div className="text-gray-500 text-sm">من الإثنين إلى الجمعة، 9:00 - 18:00</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-emerald-700 mt-1" />
                  <div>
                    <div className="font-medium">البريد الإلكتروني</div>
                    <div className="text-gray-600">info@biopara.ma</div>
                    <div className="text-gray-500 text-sm">نرد خلال 24 ساعة</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-700 mt-1" />
                  <div>
                    <div className="font-medium">العنوان</div>
                    <div className="text-gray-600">
                      123 الشارع الرئيسي<br />
                      الدار البيضاء 20000<br />
                      المغرب
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-700 mt-1" />
                  <div>
                    <div className="font-medium">ساعات العمل</div>
                    <div className="text-gray-600">
                      الإثنين - الجمعة: 9:00 - 18:00<br />
                      السبت: 9:00 - 13:00<br />
                      الأحد: مغلق
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div className="bg-emerald-700 text-white rounded-lg p-6 text-center">
              <MessageCircle className="w-8 h-8 mx-auto mb-3" />
              <h3 className="font-bold mb-2">تواصل عبر WhatsApp</h3>
              <p className="text-emerald-100 text-sm mb-4">
                رد سريع على استفساراتك
              </p>
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition inline-block"
              >
                افتح WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">أرسل لنا رسالة</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      الموضوع *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">اختر الموضوع</option>
                      <option value="order">استفسار عن طلب</option>
                      <option value="product">معلومات عن منتج</option>
                      <option value="shipping">استفسار عن الشحن</option>
                      <option value="return">إرجاع منتج</option>
                      <option value="complaint">شكوى</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرسالة *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="text-emerald-700 focus:ring-emerald-500"
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    أوافق على <a href="/auth/terms" className="text-emerald-700 hover:underline">الشروط والأحكام</a> و <a href="#" className="text-emerald-700 hover:underline">سياسة الخصوصية</a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 transition"
                >
                  إرسال الرسالة
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">الأسئلة الشائعة</h2>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-800 mb-2">كم يستغرق توصيل الطلب؟</h3>
                  <p className="text-gray-600 text-sm">
                    التوصيل القياسي: 3-5 أيام عمل<br />
                    التوصيل السريع: 1-2 أيام عمل
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-800 mb-2">هل يمكنني إرجاع المنتج؟</h3>
                  <p className="text-gray-600 text-sm">
                    نعم، يمكن إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام بشرط أن يكون في حالته الأصلية.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-800 mb-2">هل المنتجات أصلية؟</h3>
                  <p className="text-gray-600 text-sm">
                    نعم، جميع منتجاتنا أصلية 100% وموثوقة من الموردين الرسميين.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
