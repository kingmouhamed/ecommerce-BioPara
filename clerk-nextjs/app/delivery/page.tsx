"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Truck, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  HeadphonesIcon
} from "lucide-react";

export default function DeliveryPage() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("standard");

  const cities = [
    "الدار البيضاء", "الرباط", "مراكش", "فاس", "طنجة", "أكادير", 
    "مكناس", "وجدة", "الجديدة", "الخميسات", "القنيطرة", "تطوان"
  ];

  const deliveryMethods = [
    {
      id: "standard",
      name: "توصيل قياسي",
      price: "40 DH",
      time: "2-3 أيام عمل",
      description: "توصيل إلى باب المنزل"
    },
    {
      id: "express",
      name: "توصيل سريع",
      price: "70 DH", 
      time: "24 ساعة",
      description: "توصيل في نفس اليوم أو اليوم التالي"
    },
    {
      id: "pickup",
      name: "استلام من الفرع",
      price: "مجاني",
      time: "فوري",
      description: "استلام من أقرب فرع"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">خيارات التوصيل</h1>
          <p className="text-gray-600 text-lg">نوفر خدمات توصيل سريعة وموثوقة في جميع أنحاء المغرب</p>
        </div>

        {/* Delivery Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {deliveryMethods.map((method) => (
            <div 
              key={method.id}
              className={`bg-white rounded-xl p-6 border-2 cursor-pointer transition ${
                selectedMethod === method.id 
                  ? "border-emerald-500 shadow-lg" 
                  : "border-gray-200 hover:border-emerald-300"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <Truck className="text-emerald-600" size={32} />
                <div className={`w-6 h-6 rounded-full border-2 ${
                  selectedMethod === method.id 
                    ? "border-emerald-500 bg-emerald-500" 
                    : "border-gray-300"
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-full h-full flex items-center justify-center">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">{method.name}</h3>
              <div className="text-2xl font-bold text-emerald-600 mb-2">{method.price}</div>
              <div className="flex items-center gap-2 text-gray-500 mb-3">
                <Clock size={16} />
                <span className="text-sm">{method.time}</span>
              </div>
              <p className="text-gray-600 text-sm">{method.description}</p>
            </div>
          ))}
        </div>

        {/* City Selection */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">اختر مدينتك</h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`p-3 rounded-lg border transition ${
                  selectedCity === city
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium"
                    : "border-gray-200 hover:border-emerald-300 text-gray-700"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Truck className="text-emerald-600" />
              معلومات التوصيل
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-emerald-600 mt-1" size={20} />
                <div>
                  <h4 className="font-medium text-gray-800">توصيل مجاني</h4>
                  <p className="text-gray-600 text-sm">للطلبات فوق 500 درهم</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="text-emerald-600 mt-1" size={20} />
                <div>
                  <h4 className="font-medium text-gray-800">تتبع الطلب</h4>
                  <p className="text-gray-600 text-sm">تتبع طلبك خطوة بخطوة</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="text-emerald-600 mt-1" size={20} />
                <div>
                  <h4 className="font-medium text-gray-800">توصيل آمن</h4>
                  <p className="text-gray-600 text-sm">تغليف احترافي وتأمين للمنتجات</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <HeadphonesIcon className="text-emerald-600" />
              خدمة العملاء
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="text-emerald-600" size={20} />
                <div>
                  <h4 className="font-medium text-gray-800">هاتف</h4>
                  <p className="text-gray-600 text-sm">+212 673 02 02 64</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="text-emerald-600" size={20} />
                <div>
                  <h4 className="font-medium text-gray-800">بريد إلكتروني</h4>
                  <p className="text-gray-600 text-sm">delivery@biopara.ma</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="text-emerald-600" size={20} />
                <div>
                  <h4 className="font-medium text-gray-800">ساعات العمل</h4>
                  <p className="text-gray-600 text-sm">9:00 - 18:00 (الأحد - الخميس)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Map */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">مناطق التغطية</h3>
          
          <div className="bg-emerald-50 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-emerald-600" size={24} />
              <h4 className="font-medium text-gray-800">نتغطي جميع المدن المغربية الرئيسية</h4>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <h5 className="font-medium text-gray-800 mb-2">الشمال</h5>
                <ul className="space-y-1">
                  <li>• طنجة</li>
                  <li>• تطوان</li>
                  <li>• العرائش</li>
                  <li>• Chefchaouen</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-800 mb-2">المركز</h5>
                <ul className="space-y-1">
                  <li>• الدار البيضاء</li>
                  <li>• الرباط</li>
                  <li>• القنيطرة</li>
                  <li>• الجديدة</li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-800 mb-2">الجنوب</h5>
                <ul className="space-y-1">
                  <li>• مراكش</li>
                  <li>• أكادير</li>
                  <li>• ورزازات</li>
                  <li>• الداخلة</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-800 transition"
            >
              <Phone size={18} />
              تواصل معنا للاستفسار عن منطقتك
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
