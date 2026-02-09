"use client";

import React, { useState } from "react";
import { Briefcase, MapPin, Clock, Users, Heart, Award, Target, Mail, Phone } from "lucide-react";

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const jobOpenings = [
    {
      id: "pharmacy-tech",
      title: "فني صيدلة",
      department: "الصيدلة",
      location: "الدار البيضاء",
      type: "دوام كامل",
      experience: "2-3 سنوات",
      description: "نبحث عن فني صيدلة محترف للانضمام إلى فريقنا.",
      responsibilities: [
        "مساعدة الصيدلي في تجهيز الوصفات الطبية",
        "تقديم الاستشارات للعملاء حول المنتجات",
        "تنظيم وإدارة مخزون الأدوية",
        "ضمان جودة المنتجات وصلاحيتها"
      ],
      requirements: [
        "شهادة فني صيدلة",
        "خبرة 2-3 سنوات في شبه الصيدلية",
        "قدرة جيدة على التواصل مع العملاء",
        "معرفة بالمنتجات الطبيعية والعلاجية"
      ],
      benefits: [
        "راتب تنافسي",
        "تأمين صحي شامل",
        "فرص تطوير مهني",
        "خصومات على المنتجات"
      ]
    },
    {
      id: "beauty-advisor",
      title: "مستحضر تجميل",
      department: "التجميل",
      location: "الدار البيضاء",
      type: "دوام كامل",
      experience: "1-2 سنوات",
      description: "مستحضر تجميل متخصص لتقديم الاستشارات وتطبيق العلاجات.",
      responsibilities: [
        "تقديم استشارات تجميلية للعملاء",
        "تطبيق العلاجات والخدمات التجميلية",
        "متابعة العملاء وتقديم الدعم الفني",
        "المساعدة في اختيار المنتجات المناسبة"
      ],
      requirements: [
        "شهادة في التجميل أو التجميل المتقدم",
        "خبرة 1-2 سنوات في مجال التجميل",
        "مهارات ممتازة في التواصل",
        "معرفة بالمنتجات التجميلية الطبيعية"
      ],
      benefits: [
        "راتب تنافسي",
        "تدريب مستمر",
        "منتجات مجانية للاستخدام الشخصي",
        "فرص للتطوير المهني"
      ]
    },
    {
      id: "digital-marketer",
      title: "مسوق رقمي",
      department: "التسويق",
      location: "عن بعد",
      type: "دوام كامل",
      experience: "3-5 سنوات",
      description: "مسوق رقمي إبداعي لإدارة حملاتنا التسويقية الرقمية.",
      responsibilities: [
        "إدارة حملات التسويق الرقمي",
        "تحسين محركات البحث (SEO)",
        "إدارة وسائل التواصل الاجتماعي",
        "تحليل البيانات وإعداد التقارير"
      ],
      requirements: [
        "خبرة 3-5 سنوات في التسويق الرقمي",
        "معرفة بـ SEO و SEM",
        "خبرة في إدارة حملات الإعلانات",
        "مهارات تحليلية قوية"
      ],
      benefits: [
        "عمل مرن من المنزل",
        "راتب تنافسي",
        "مكافآت أداء",
        "فرص للتطوير المهني"
      ]
    },
    {
      id: "customer-service",
      title: "موظف خدمة عملاء",
      department: "خدمة العملاء",
      location: "الدار البيضاء",
      type: "دوام كامل",
      experience: "1-2 سنوات",
      description: "موظف خدمة عملاء ودود وفعال لتقديم دعم استثنائي لعملائنا.",
      responsibilities: [
        "الرد على استفسارات العملاء عبر الهاتف والبريد",
        "مساعدة العملاء في الطلبات والمشاكل",
        "حل الشكاوى والمشكلات بفعالية",
        "تسجيل الملاحظات وتحسين الخدمة"
      ],
      requirements: [
        "خبرة 1-2 سنوات في خدمة العملاء",
        "مهارات ممتازة في التواصل",
        "قدرة على حل المشكلات",
        "اللغة العربية والفرنسية"
      ],
      benefits: [
        "راتب تنافسي",
        "تدريب شامل",
        "بيئة عمل داعمة",
        "فرص للنمو المهني"
      ]
    }
  ];

  const toggleJob = (jobId: string) => {
    setSelectedJob(selectedJob === jobId ? null : jobId);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">انضم إلى فريق BioPara</h1>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
            كن جزءاً من رحلتنا في تقديم أفضل المنتجات الطبيعية والخدمات المميزة
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Why Join Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">لماذا تنضم إلينا؟</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">بيئة عمل داعمة</h3>
              <p className="text-gray-600 text-sm">
                فريق عمل متعاون وبيئة إيجابية تشجع على النمو
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">تطوير مهني</h3>
              <p className="text-gray-600 text-sm">
                تدريب مستمر وفرص للتعلم والتطور المهني
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">أهداف واضحة</h3>
              <p className="text-gray-600 text-sm">
                العمل معاً لتحقيق أهداف مشتركة ونجاحات فردية
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">فريق محترف</h3>
              <p className="text-gray-600 text-sm">
                العمل مع خبراء في مجال الصيدلة والتجميل
              </p>
            </div>
          </div>
        </div>

        {/* Job Openings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">الوظائف الشاغرة</h2>
          
          <div className="space-y-4">
            {jobOpenings.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleJob(job.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold text-lg text-gray-800">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                        <span>خبرة: {job.experience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-emerald-700">
                    {selectedJob === job.id ? "أقل" : "عرض التفاصيل"}
                  </div>
                </button>
                
                {selectedJob === job.id && (
                  <div className="border-t p-6">
                    <p className="text-gray-600 mb-6">{job.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">المسؤوليات:</h4>
                        <ul className="space-y-2 text-gray-600">
                          {job.responsibilities.map((resp, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-emerald-700 mt-1">•</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">المتطلبات:</h4>
                        <ul className="space-y-2 text-gray-600">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-emerald-700 mt-1">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-emerald-800 mb-3">المزايا:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {job.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-emerald-700">
                            <span className="w-2 h-2 bg-emerald-700 rounded-full"></span>
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition">
                      التقديم على الوظيفة
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* No Openings */}
        {jobOpenings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">لا توجد وظائف شاغرة حالياً</h3>
            <p className="text-gray-600">يمكنك إرسال سيرتك الذاتية وسنتواصل معك عند توفر وظيفة مناسبة</p>
          </div>
        )}

        {/* Contact */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-emerald-800 mb-4">هل لديك أسئلة؟</h3>
          <p className="text-emerald-700 mb-6">
            إذا كان لديك أي استفسارات حول الوظائف أو فريق العمل، فلا تتردد في التواصل معنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:careers@biopara.ma" className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition flex items-center gap-2">
              <Mail className="w-5 h-5" />
              البريد الإلكتروني
            </a>
            <a href="tel:+212600000000" className="bg-white text-emerald-700 border border-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition flex items-center gap-2">
              <Phone className="w-5 h-5" />
              اتصل بنا
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
