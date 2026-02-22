"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Send, Leaf, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function ContactPage() {
  const { cartItemCount } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
              <Leaf className="w-8 h-8" />
              BioPara
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">الرئيسية</Link>
              <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">المنتجات</Link>
              <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">من نحن</Link>
              <Link href="/contact" className="text-primary-600 font-semibold">اتصل بنا</Link>
            </nav>
            <Link href="/cart" className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">
            اتصل بنا
          </h1>
          <p className="text-xl text-gray-600">
            نحن هنا للإجابة على جميع أسئلتك والاستماع إلى مقترحاتك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold text-gray-900">
              معلومات التواصل
            </h2>
            {[
              {
                icon: Phone,
                title: "الهاتف",
                lines: ["+212 673020264"],
              },
              {
                icon: Mail,
                title: "البريد الإلكتروني",
                lines: ["info@biopara.ma", "support@biopara.ma"],
              },
              {
                icon: MapPin,
                title: "العنوان",
                lines: ["المغرب"],
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex gap-4">
                    <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      {item.lines.map((line, j) => (
                        <p key={j} className="text-gray-600">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="bg-primary-50 border-r-4 border-primary-600 p-6 rounded">
              <h3 className="font-bold text-gray-900 mb-2">ساعات العمل</h3>
              <p className="text-gray-600">
                {"من السبت إلى الخميس: 9 صباحا - 9 مساء"}
              </p>
              <p className="text-gray-600">
                {"الجمعة: 2 ظهرا - 9 مساء"}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              أرسل لنا رسالة
            </h2>
            {submitted ? (
              <div className="bg-green-50 border-r-4 border-primary-600 p-4 rounded text-center">
                <p className="text-primary-600 font-bold">
                  {"شكرا لرسالتك!"}
                </p>
                <p className="text-gray-600">سنتواصل معك قريبا.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الاسم
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-gray-900"
                    placeholder="اسمك الكامل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-gray-900"
                    placeholder="بريدك الإلكتروني"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الموضوع
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none text-gray-900"
                    placeholder="موضوع الرسالة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الرسالة
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none resize-none text-gray-900"
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
      </div>
    </div>
  );
}
