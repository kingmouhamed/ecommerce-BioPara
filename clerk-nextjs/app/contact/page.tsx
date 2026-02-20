'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">اتصل بنا</h1>
          <p className="text-xl text-gray-600">
            نحن هنا للإجابة على جميع أسئلتك والاستماع إلى مقترحاتك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">معلومات التواصل</h2>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-4">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">الهاتف</h3>
                  <p className="text-gray-600">+966 50 123 4567</p>
                  <p className="text-gray-600">+966 50 234 5678</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-4">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">البريد الإلكتروني</h3>
                  <p className="text-gray-600">info@bioparaa.com</p>
                  <p className="text-gray-600">support@bioparaa.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex gap-4">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">العنوان</h3>
                  <p className="text-gray-600">الرياض، المملكة العربية السعودية</p>
                  <p className="text-gray-600">حي النخيل - شارع الملك فهد</p>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 border-l-4 border-primary-600 p-6 rounded">
              <h3 className="font-bold text-gray-900 mb-2">ساعات العمل</h3>
              <p className="text-gray-600">من السبت إلى الخميس: 9 صباحاً - 9 مساءً</p>
              <p className="text-gray-600">الجمعة: 2 ظهراً - 9 مساءً</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">أرسل لنا رسالة</h2>

            {submitted ? (
              <div className="bg-green-50 border-l-4 border-primary-600 p-4 rounded text-center">
                <p className="text-primary-600 font-bold">شكراً لرسالتك!</p>
                <p className="text-gray-600">سنتواصل معك قريباً.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الاسم</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="اسمك الكامل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="رقم هاتفك"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الموضوع</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="موضوع الرسالة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الرسالة</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none resize-none"
                    placeholder="اكتب رسالتك هنا"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  إرسال الرسالة
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-gray-200 rounded-xl overflow-hidden h-64 md:h-96">
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <p className="text-gray-600 font-bold">الخريطة قريباً</p>
          </div>
        </div>
      </div>
    </div>
  );
}
