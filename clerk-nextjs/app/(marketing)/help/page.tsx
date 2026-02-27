'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'كيف أطلب المنتجات؟',
      answer: 'يمكنك البحث عن المنتجات المطلوبة والضغط على "أضف للسلة" ثم الانتقال للدفع والشراء.',
    },
    {
      id: '2',
      question: 'ما هي طرق الدفع المتاحة؟',
      answer: 'نوفر عدة طرق دفع آمنة منها: بطاقات الائتمان، التحويل البنكي، والدفع عند الاستلام.',
    },
    {
      id: '3',
      question: 'كم مدة التوصيل؟',
      answer: 'التوصيل العادي يأخذ من 3 إلى 5 أيام عمل، بينما التوصيل السريع يأخذ يوم أو يومين.',
    },
    {
      id: '4',
      question: 'هل التوصيل مجاني؟',
      answer: 'نعم، التوصيل مجاني للطلبات التي تزيد عن 100 ريال سعودي.',
    },
    {
      id: '5',
      question: 'كيف أسترجع المنتج؟',
      answer: 'يمكنك استرجاع المنتج خلال 14 يوم من استلامك للطلب، شريطة أن يكون بحالته الأصلية.',
    },
    {
      id: '6',
      question: 'هل المنتجات آمنة للاستخدام؟',
      answer: 'نعم، جميع المنتجات طبيعية وآمنة 100%، لكن يفضل استشارة الطبيب قبل الاستخدام.',
    },
  ];

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">المساعدة والأسئلة الشائعة</h1>
          <p className="text-gray-600">إجابات على الأسئلة الشائعة حول المتجر والمنتجات</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                }
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-gray-900 text-lg text-right">
                  {faq.question}
                </h3>
                <ChevronDown
                  size={24}
                  className={`text-primary-600 transition-transform ${
                    expandedFaq === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedFaq === faq.id && (
                <div className="bg-gray-50 p-4 border-t border-gray-200">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            هل لم تجد إجابتك؟
          </h2>
          <p className="text-gray-600 mb-6">
            تواصل معنا مباشرة وفريق الدعم سيساعدك فوراً
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition-all"
          >
            اتصل بنا
          </a>
        </div>
      </div>
    </div>
  );
}
