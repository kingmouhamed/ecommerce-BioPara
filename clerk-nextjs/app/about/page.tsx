'use client';

import { Leaf, Award, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">عن BioParaa</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            رحلتنا لتوفير أفضل الأعشاب الطبية الطبيعية لصحتك وعافيتك
          </p>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img
              src="https://images.pexels.com/photos/3962642/pexels-photo-3962642.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="عن المتجر"
              className="rounded-xl shadow-lg w-full h-96 object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">من نحن</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              BioParaa هو متخصص في بيع الأعشاب الطبية الطبيعية والمنتجات الصحية بجودة عالية.
              نؤمن بقوة الطبيعة وفوائدها الصحية الفعالة.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              كل منتج يتم اختياره بعناية من أفضل المصادر العالمية، ويخضع لفحوصات جودة صارمة.
              نحن ملتزمون بتقديم منتجات آمنة وفعالة لعملائنا.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              رسالتنا هي مساعدتك على تحقيق صحة أفضل من خلال توفير أعشاب طبية طبيعية
              من أعلى جودة بأسعار معقولة.
            </p>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-primary-600 mb-4">رسالتنا</h3>
            <p className="text-gray-700">
              توفير أعشاب طبية طبيعية عالية الجودة تساهم في تحسين صحة وعافية عملائنا
              بأسعار عادلة وخدمة متميزة.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-primary-600 mb-4">رؤيتنا</h3>
            <p className="text-gray-700">
              أن نكون المتجر الأول والموثوق به في المملكة العربية السعودية لبيع
              الأعشاب الطبية والمنتجات الصحية الطبيعية.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-primary-600 mb-4">قيمنا</h3>
            <p className="text-gray-700">
              الجودة والأمان والشفافية والصدق. نحن نضع ثقة عملائنا فوق كل شيء
              ونسعى لتقديم أفضل خدمة ممكنة.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {[
            { icon: Leaf, label: 'منتج', value: '50+' },
            { icon: Users, label: 'عميل راضي', value: '5000+' },
            { icon: Award, label: 'جودة مضمونة', value: '100%' },
            { icon: Zap, label: 'سنوات خبرة', value: '5+' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-md text-center">
                <Icon size={40} className="text-primary-600 mx-auto mb-4" />
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            فريقنا المتخصص
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((member) => (
              <div key={member} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-40 bg-gradient-to-r from-primary-400 to-primary-600"></div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    خبير العشاب {member}
                  </h3>
                  <p className="text-gray-600">
                    متخصص في الأعشاب الطبية والعلاجات الطبيعية
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">ابدأ رحلتك الصحية اليوم</h2>
          <p className="text-lg text-green-100 mb-6">
            اكتشف مجموعة واسعة من الأعشاب الطبية الطبيعية
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all"
          >
            استكشف المنتجات
          </a>
        </div>
      </div>
    </div>
  );
}
