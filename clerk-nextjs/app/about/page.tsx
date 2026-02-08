"use client";

import React from "react";
import Link from "next/link";
import { Heart, Shield, Truck, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">من نحن</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            خبيرك في المنتجات شبه الصيدلية والعلاج بالنباتات في المغرب
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">قصة BioPara</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                تأسست BioPara في عام 2020 برؤية تتمثل في الجمع بين العلم والطبيعة لتقديم أفضل المنتجات الصحية والتجميلية للعملاء المغاربة.
              </p>
              <p>
                نحن نؤمن بأن العناية بالصحة والجمال تبدأ باختيار المنتجات الطبيعية عالية الجودة التي تحترم جسمك والبيئة على حد سواء.
              </p>
              <p>
                فريقنا يتكون من خبراء في الصيدلة والأعشاب الطبية وعلم التجميل، يعملون معاً لاختيار وتقديم أفضل المنتجات من أشهر الماركات العالمية والمحلية.
              </p>
            </div>
          </div>
          
          <div className="bg-emerald-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-emerald-800 mb-6">أرقامنا تتحدث عنا</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-700 mb-2">300+</div>
                <div className="text-gray-600">منتج أصلي</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-700 mb-2">50+</div>
                <div className="text-gray-600">ماركة موثوقة</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-700 mb-2">10,000+</div>
                <div className="text-gray-600">عميل راضٍ</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-700 mb-2">4.8/5</div>
                <div className="text-gray-600">تقييم العملاء</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">قيمنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">الجودة المضمونة</h3>
              <p className="text-gray-600 text-sm">
                جميع منتجاتنا أصلية 100% وموثوقة من أفضل الموردين
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">رعاية العملاء</h3>
              <p className="text-gray-600 text-sm">
                فريق متخصص لمساعدتك في اختيار المنتجات المناسبة لك
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">توصيل سريع</h3>
              <p className="text-gray-600 text-sm">
                توصيل لجميع أنحاء المغرب خلال 24-48 ساعة
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">خبرة طويلة</h3>
              <p className="text-gray-600 text-sm">
                أكثر من 10 سنوات في مجال الصيدلة والأعشاب الطبية
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-emerald-700 text-white p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">انضم إلى عائلة BioPara</h2>
          <p className="mb-6 text-emerald-100">
            اشترك في نشرتنا الإخبارية واحصل على خصم 10% على أول طلب
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none"
              dir="rtl"
            />
            <button className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition">
              اشترك الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
