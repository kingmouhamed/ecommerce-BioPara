"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle checkout logic here
    alert('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans" dir="rtl">
      <div className="container mx-auto px-4">
        
        <div className="flex items-center gap-3 mb-8">
          <Link href="/cart" className="flex items-center gap-2 text-gray-600 hover:text-emerald-700">
            <ArrowLeft size={18} />
            العودة للسلة
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">إتمام الطلب</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- نموذج الطلب --- */}
          <div className="lg:w-2/3">
            
            {/* معلومات العملاء */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b">معلومات العميل</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأول</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأخير</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* عنوان التوصيل */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b">عنوان التوصيل</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">العنوان التفصيلي</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الرمز البريدي</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* طريقة الدفع */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b">طريقة الدفع</h2>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="text-emerald-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">الدفع عند الاستلام (COD)</div>
                    <div className="text-sm text-gray-500">الدفع نقداً عند استلام الطلب</div>
                  </div>
                  <CreditCard size={20} className="text-gray-400" />
                </label>
                
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                    className="text-emerald-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium">بطاقة الائتمان</div>
                    <div className="text-sm text-gray-500">دفع آمن بالبطاقة</div>
                  </div>
                  <CreditCard size={20} className="text-gray-400" />
                </label>
              </div>
            </div>
          </div>

          {/* --- ملخص الطلب --- */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b">ملخص الطلب</h2>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>المجموع الفرعي</span>
                  <span className="font-bold">545 DH</span>
                </div>
                <div className="flex justify-between">
                  <span>التوصيل</span>
                  <span className="text-emerald-600 font-bold">مجاني</span>
                </div>
                <div className="flex justify-between">
                  <span>ضريبة القيمة المضافة (20%)</span>
                  <span>شاملة</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>المجموع الإجمالي</span>
                  <span>545 DH</span>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  className="block w-full bg-emerald-700 text-white text-center py-4 rounded-lg font-bold hover:bg-emerald-800 transition shadow-lg shadow-emerald-200 mb-6"
                >
                  تأكيد الطلب
                </button>
              </form>

              {/* Trust Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <span>دفع آمن 100% (COD / بطاقة)</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <Truck size={18} className="text-emerald-600" />
                  <span>توصيل في جميع أنحاء المغرب خلال 48 ساعة</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <CheckCircle size={18} className="text-emerald-600" />
                  <span>منتجات أصلية مضمونة</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
