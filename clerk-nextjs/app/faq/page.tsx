"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, ShoppingBag, Truck, CreditCard, Package, RefreshCw, Shield } from "lucide-react";

export default function FAQPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const faqCategories = [
    {
      id: "general",
      name: "أسئلة عامة",
      icon: <HelpCircle className="w-5 h-5" />,
      questions: [
        {
          q: "ما هو BioPara؟",
          a: "BioPara هو متجر إلكتروني متخصص في المنتجات شبه الصيدلية والأعشاب الطبية والمستحضرات التجميلية الطبيعية. نقدم منتجات أصلية من أشهر الماركات العالمية والمحلية."
        },
        {
          q: "هل المنتجات أصلية؟",
          a: "نعم، جميع منتجاتنا أصلية 100% وموثوقة من الموردين الرسميين. نضمن جودة المنتجات وأصالتها."
        },
        {
          q: "هل هناك فرع فعلي؟",
          a: "نعم، لدينا فرع في الدار البيضاء. يمكنك زيارتنا أو طلب الاستلام من الفرع."
        },
        {
          q: "كيف يمكنني التواصل معكم؟",
          a: "يمكنك التواصل معنا عبر الهاتف +212 600 000 000 أو البريد الإلكتروني info@biopara.ma أو عبر WhatsApp."
        }
      ]
    },
    {
      id: "orders",
      name: "الطلبات",
      icon: <ShoppingBag className="w-5 h-5" />,
      questions: [
        {
          q: "كيف أقوم بعملية الشراء؟",
          a: "اختر المنتجات التي تريدها، أضفها إلى سلة التسوق، ثم اضغط على 'إتمام الطلب'. املأ معلومات الشحن والدفع، ثم أكمل الطلب."
        },
        {
          q: "هل يمكنني تعديل طلبي بعد إرساله؟",
          a: "يمكن تعديل الطلب خلال 30 دقيقة من إرساله. بعد ذلك، يرجى التواصل مع خدمة العملاء للمساعدة."
        },
        {
          q: "كيف أعرف حالة طلبي؟",
          a: "ستتلقى رسالة بريد إلكتروني بتأكيد الطلب ورقم تتبع. يمكنك أيضاً تسجيل الدخول لحسابك لمتابعة حالة الطلب."
        },
        {
          q: "ماذا أفعل إذا لم أستلم طلبي؟",
          a: "إذا لم تستلم طلبك في الوقت المحدد، يرجى التواصل معنا فوراً للتحقق من حالة الشحن وحل المشكلة."
        }
      ]
    },
    {
      id: "shipping",
      name: "التوصيل",
      icon: <Truck className="w-5 h-5" />,
      questions: [
        {
          q: "كم يستغرق توصيل الطلب؟",
          a: "التوصيل القياسي: 3-5 أيام عمل. التوصيل السريع: 1-2 أيام عمل. الاستلام من الفرع: نفس اليوم."
        },
        {
          q: "كم تكلفة التوصيل؟",
          a: "التوصيل القياسي مجاني. التوصيل السريع 30 درهم. الاستلام من الفرع مجاني."
        },
        {
          q: "هل توصون لجميع أنحاء المغرب؟",
          a: "نعم، نوصل التوصيل لجميع المدن المغربية. قد تختلف مدة التوصيل حسب المنطقة."
        },
        {
          q: "هل يمكن تتبع الشحنة؟",
          a: "نعم، ستصلك رسالة بريد إلكتروني برقم تتبع يمكنك استخدامه لمتابعة شحنتك."
        }
      ]
    },
    {
      id: "payment",
      name: "الدفع",
      icon: <CreditCard className="w-5 h-5" />,
      questions: [
        {
          q: "ما هي طرق الدفع المتاحة؟",
          a: "نقبل الدفع عند الاستلام، البطاقات البنكية، والتحويل البنكي. جميع المعاملات آمنة ومشفرة."
        },
        {
          q: "هل الدفع آمن؟",
          a: "نعم، نستخدم أحدث تقنيات التشفير لحماية معلومات الدفع. جميع المعاملات تتم عبر بوابات دفع آمنة."
        },
        {
          q: "هل يمكن الدفع بالأقساط؟",
          a: "حالياً لا نقدم خيارات الدفع بالأقساط، لكننا نعمل على إضافتها قريباً."
        },
        {
          q: "ماذا أفعل إذا فشلت عملية الدفع؟",
          a: "إذا فشلت عملية الدفع، يرجى المحاولة مرة أخرى أو التواصل مع خدمة العملاء للمساعدة."
        }
      ]
    },
    {
      id: "returns",
      name: "الإرجاع والاستبدال",
      icon: <RefreshCw className="w-5 h-5" />,
      questions: [
        {
          q: "هل يمكن إرجاع المنتج؟",
          a: "نعم، يمكن إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام بشرط أن يكون في حالته الأصلية."
        },
        {
          q: "ما هي شروط الإرجاع؟",
          a: "يجب أن يكون المنتج مغلقاً وفي حالته الأصلية مع العبوة. يجب تقديم إيصال الشراء."
        },
        {
          q: "كيف أقوم بعملية الإرجاع؟",
          a: "تواصل مع خدمة العملاء لطلب رقم الإرجاع. أرسل المنتج إلى العنوان المحدد وسنقوم باسترداد المبلغ."
        },
        {
          q: "متى أحصل على استرداد المبلغ؟",
          a: "يتم استرداد المبلغ خلال 7 أيام عمل من استلامنا للمنتج المرجوع."
        }
      ]
    },
    {
      id: "products",
      name: "المنتجات",
      icon: <Package className="w-5 h-5" />,
      questions: [
        {
          q: "كيف أعرف أن المنتج مناسب لي؟",
          a: "يمكنك قراءة وصف المنتج والمكونات والتقييمات من عملاء آخرين. يمكنك أيضاً التواصل معنا للاستشارة."
        },
        {
          q: "هل تقدمون استشارات مجانية؟",
          a: "نعم، فريقنا من الخبراء متاح لتقديم استشارات مجانية حول المنتجات المناسبة لك."
        },
        {
          q: "ماذا أفعل إذا كان لدي حساسية من مكون معين؟",
          a: "يرجى قراءة قائمة المكونات بعناية قبل الشراء. إذا كانت لديك حساسية معروفة، تواصل معنا للمساعدة."
        },
        {
          q: "هل المنتجات صالحة للاستخدام؟",
          a: "جميع منتجاتنا جديدة وتاريخ صلاحيتها طويل. يتم التحقق من تواريخ الانتهاء قبل الشحن."
        }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">الأسئلة الشائعة</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            إجابات على الأسئلة الأكثر شيوعاً حول خدماتنا ومنتجاتنا
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="relative">
            <HelpCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن سؤال..."
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4">
          {faqCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                </div>
                {openCategory === category.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {openCategory === category.id && (
                <div className="border-t">
                  {category.questions.map((item, index) => (
                    <div key={index} className="p-6 border-b last:border-b-0">
                      <h4 className="font-semibold text-gray-800 mb-3">{item.q}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 mt-8 text-center">
          <Shield className="w-12 h-12 text-emerald-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-emerald-800 mb-2">لم تجد إجابتك؟</h3>
          <p className="text-emerald-700 mb-6">
            فريق خدمة العملاء متاح للمساعدة من الإثنين إلى الجمعة، 9:00 - 18:00
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact" className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition">
              تواصل معنا
            </a>
            <a href="tel:+212600000000" className="bg-white text-emerald-700 border border-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition">
              اتصل بنا
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
