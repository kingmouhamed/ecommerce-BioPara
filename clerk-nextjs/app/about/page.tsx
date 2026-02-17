"use client";

import React from 'react';
import Image from 'next/image';
import { Shield, Users, Award, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              من نحن في BioPara
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
              نحن شركة رائدة في مجال المنتجات الطبيعية والطبية، ملتزمون بتقديم أفضل الأعشاب الطبية والبارافارماسي بجودة عالية وأسعار تنافسية
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">رسالتنا</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                رسالتنا في BioPara هي توفير منتجات طبيعية عالية الجودة تعزز صحة ورفاهية عملائنا. نؤمن بقوة الطبيعة ونسعى جاهدين لجلب أفضل المنتجات من مصادر موثوقة حول العالم.
              </p>
              <p className="text-gray-700 leading-relaxed">
                نحن ملتزمون بالشفافية والجودة في كل خطوة، من اختيار المكونات حتى تسليم المنتج النهائي إلى أيديكم.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/images/about/mission-image.jpg"
                alt="رسالتنا"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <Image
                src="/images/about/team-photo.jpg"
                alt="فريق العمل"
                width={600}
                height={400}
                className="rounded-2xl shadow-xl w-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">فريق الخبراء</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                يتكون فريقنا من خبراء متخصصين في مجال الأعشاب الطبية والبارافارماسي. نعمل معاً لضمان تقديم أفضل المنتجات التي تلبي احتياجاتكم وتوقعاتكم.
              </p>
              <p className="text-gray-700 leading-relaxed">
                خبراؤنا لديهم سنوات من الخبرة في هذا المجال، وهم دائماً على استعداد لتقديم المشورة والدعم الذي تحتاجونه.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Office Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">مقرنا الرئيسي</h2>
            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
              يقع مقرنا الرئيسي في قلب المدينة، حيث نعمل في بيئة محفزة تسمح لنا بتقديم أفضل الخدمات لعملائنا
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Image
              src="/images/about/office-photo.jpg"
              alt="مقر الشركة"
              width={1200}
              height={600}
              className="rounded-2xl shadow-xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">قيمنا</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">الجودة</h3>
              <p className="text-gray-700 text-sm">
                نلتزم بأعلى معايير الجودة في جميع منتجاتنا
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">الثقة</h3>
              <p className="text-gray-700 text-sm">
                نبني علاقات طويلة الأمد مع عملائنا المخلصين
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">التميز</h3>
              <p className="text-gray-700 text-sm">
                نسعى دائماً للتفوق وتقديم الأفضل في السوق
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">الرعاية</h3>
              <p className="text-gray-700 text-sm">
                نهتم بعملائنا ونسعى لتحقيق رضاهم التام
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            انضم إلى عائلة BioPara اليوم
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            اكتشف عالم المنتجات الطبيعية والطبية معنا واستمتع بتجربة تسوق فريدة
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-emerald-600 font-bold px-6 py-3 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              تسوق الآن
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl hover:bg-emerald-800 transition-colors"
            >
              تواصل معنا
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
