"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Clock, Tag, Gift, Star } from "lucide-react";

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const promotions = [
    {
      id: 1,
      title: "خصم 20% على منتجات العناية بالبشرة",
      description: "احصل على خصم 20% على جميع منتجات العناية بالبشرة من ماركات La Roche-Posay و Vichy",
      discount: "20%",
      category: "العناية بالبشرة",
      validUntil: "2026-03-31",
      code: "SKIN20",
      image: "/products1.png",
      type: "percentage"
    },
    {
      id: 2,
      title: "شحن مجاني للطلبات فوق 300 درهم",
      description: "استمتع بالتوصيل المجاني لجميع الطلبات التي تتجاوز 300 درهم",
      discount: "مجاني",
      category: "جميع المنتجات",
      validUntil: "2026-12-31",
      code: "FREESHIP",
      image: "/products2.png",
      type: "shipping"
    },
    {
      id: 3,
      title: "عرض 2 + 1 على الزيوت العطرية",
      description: "اشتر زيتين واحصل على الثالث مجاناً من مجموعة الزيوت العطرية",
      discount: "3x2",
      category: "الزيوت العطرية",
      validUntil: "2026-02-28",
      code: "OILS3X2",
      image: "/products3.png",
      type: "bogo"
    },
    {
      id: 4,
      title: "خصم 15% للأعضاء الجدد",
      description: "خصم خاص 15% على أول طلب للأعضاء الجدد في BioPara",
      discount: "15%",
      category: "جميع المنتجات",
      validUntil: "2026-12-31",
      code: "NEW15",
      image: "/products4.png",
      type: "newuser"
    },
    {
      id: 5,
      title: "خصم 50 درهم على طلبك الأول",
      description: "خصم 50 درهم على أول طلب بقيمة 200 درهم أو أكثر",
      discount: "50 درهم",
      category: "جميع المنتجات",
      validUntil: "2026-02-15",
      code: "FIRST50",
      image: "/products5.png",
      type: "fixed"
    },
    {
      id: 6,
      title: "عروض الأعشاب الطبية",
      description: "خصم يصل إلى 30% على مجموعة الأعشاب الطبية والمكملات الغذائية",
      discount: "30%",
      category: "الأعشاب الطبية",
      validUntil: "2026-03-15",
      code: "HERBS30",
      image: "/products6.png",
      type: "percentage"
    }
  ];

  const filteredPromotions = promotions.filter(promo =>
    promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDaysLeft = (validUntil: string) => {
    const today = new Date();
    const expiryDate = new Date(validUntil);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">العروض والخصومات</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            استمتع بأفضل العروض الحصرية على منتجاتنا المميزة
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن عرض..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
              dir="rtl"
            />
          </div>
        </div>

        {/* Active Promotions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">العروض النشطة</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromotions.map((promo) => {
              const daysLeft = getDaysLeft(promo.validUntil);
              
              return (
                <div key={promo.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition">
                  {/* Promotion Image */}
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                      {promo.discount}
                    </div>
                  </div>
                  
                  {/* Promotion Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-emerald-700" />
                      <span className="text-sm text-emerald-700 font-medium">{promo.category}</span>
                    </div>
                    
                    <h3 className="font-bold text-gray-800 mb-2">{promo.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{promo.description}</p>
                    
                    {/* Promotion Code */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">كود الخصم:</span>
                        <span className="font-bold text-emerald-700">{promo.code}</span>
                      </div>
                    </div>
                    
                    {/* Validity */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>صالح لـ {daysLeft} يوم</span>
                      </div>
                      <button className="text-emerald-700 hover:text-emerald-800 font-medium">
                        استخدم العرض
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Special Offers */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">عروض خاصة</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-8 h-8" />
                <h3 className="text-xl font-bold">هدية الأعضاء</h3>
              </div>
              <p className="mb-4">
                انضم إلى برنامج الولاء واحصل على هدية خاصة بمناسبة عيد ميلادك
              </p>
              <button className="bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition">
                انضم الآن
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-8 h-8" />
                <h3 className="text-xl font-bold">عرض الأسبوع</h3>
              </div>
              <p className="mb-4">
                خصم 25% على منتج مختار كل أسبوع. تابعنا على وسائل التواصل الاجتماعي!
              </p>
              <button className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
                عرض هذا الأسبوع
              </button>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-emerald-800 mb-4">شروط العروض</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2">شروط عامة:</h4>
              <ul className="space-y-1 text-emerald-700 text-sm">
                <li>• العروض صالحة حتى تاريخ الانتهاء المحدد</li>
                <li>• لا يمكن الجمع بين أكثر من عرض في نفس الطلب</li>
                <li>• العروض لا تشمل تكاليف الشحن</li>
                <li>• يحق لـ BioPara تعديل العروض دون إشعار مسبق</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2">كيفية الاستخدام:</h4>
              <ul className="space-y-1 text-emerald-700 text-sm">
                <li>• أضف المنتجات إلى سلة التسوق</li>
                <li>• أدخل كود الخصم في صفحة الدفع</li>
                <li>• سيتم تطبيق الخصم تلقائياً</li>
                <li>• تأكد من صلاحية العرض قبل الاستخدام</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
