"use client";

import React from "react";
import { Shield, Eye, Lock, Database, UserCheck, AlertCircle } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">سياسة الخصوصية</h1>
          <p className="text-gray-500">آخر تحديث: 01 فبراير 2026</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Introduction */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-emerald-700" />
            <h2 className="text-2xl font-bold text-gray-800">مقدمة</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            في شركة <strong>BioPara المغرب</strong>، نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام和保护 معلوماتك عند استخدام موقعنا الإلكتروني وخدماتنا.
          </p>
        </div>

        {/* Data Collection */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-emerald-700" />
            <h2 className="text-2xl font-bold text-gray-800">المعلومات التي نجمعها</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">المعلومات الشخصية:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>الاسم الكامل وعنوان البريد الإلكتروني</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>رقم الهاتف والعنوان</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>معلومات الدفع والفواتير</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">المعلومات التقنية:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>عنوان IP ونوع المتصفح</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>ملفات تعريف الارتباط (Cookies)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>سجل التصفح والتفاعل مع الموقع</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Usage */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-emerald-700" />
            <h2 className="text-2xl font-bold text-gray-800">كيف نستخدم معلوماتك</h2>
          </div>
          
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-emerald-700 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">تقديم الخدمات</h3>
                <p>معالجة الطلبات والتواصل معك حول حالة الطلبات والتوصيل</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-emerald-700 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">تحسين التجربة</h3>
                <p>تخصيص المحتوى وتحسين أداء الموقع بناءً على استخدامك</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-emerald-700 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">التسويق والاتصال</h3>
                <p>إرسال عروض خاصة ونشرات إخبارية (بموافقتك)</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-emerald-700 font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">الأمن والامتثال</h3>
                <p>حماية الموقع ومنع الاحتيال والامتثال للقوانين</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Protection */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-emerald-700" />
            <h2 className="text-2xl font-bold text-gray-800">حماية البيانات</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-semibold text-emerald-800 mb-2">تدابير الأمن:</h3>
              <ul className="space-y-1 text-emerald-700 text-sm">
                <li>• تشفير البيانات باستخدام SSL/TLS</li>
                <li>• جدار حماية وأنظمة كشف التسلل</li>
                <li>• الوصول المقيد للمعلومات الحساسة</li>
                <li>• نسخ احتياطي منتظم للبيانات</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">الاحتفاظ بالبيانات:</h3>
              <p className="text-blue-700 text-sm">
                نحتفظ بمعلوماتك فقط للفترة اللازمة لتقديم الخدمات والامتثال للمتطلبات القانونية.
                يمكن حذف البيانات الشخصية عند طلبك أو انتهاء الغرض من جمعها.
              </p>
            </div>
          </div>
        </div>

        {/* User Rights */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <UserCheck className="w-6 h-6 text-emerald-700" />
            <h2 className="text-2xl font-bold text-gray-800">حقوقك</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">حقوق الوصول والتعديل:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>الوصول إلى بياناتك الشخصية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>تصحيح المعلومات غير الدقيقة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>حذف البيانات الشخصية</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">حقوق أخرى:</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>تقييد معالجة البيانات</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>نقل البيانات إلى طرف ثالث</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>الاعتراض على معالجة البيانات</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cookies */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">ملفات تعريف الارتباط (Cookies)</h2>
          
          <div className="space-y-4 text-gray-600">
            <p>
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. تشمل أنواع ملفات تعريف الارتباط التي نستخدمها:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">ملفات تعريف الارتباط الضرورية:</h4>
                <p className="text-sm">أساسية لتشغيل الموقع وتقديم الخدمات الأساسية</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">ملفات تعريف الارتباط التحليلية:</h4>
                <p className="text-sm">تساعدنا على فهم كيفية استخدام الموقع</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">ملفات تعريف الارتباط التسويقية:</h4>
                <p className="text-sm">تستخدم لعرض عروض ومحتوى مخصص</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">ملفات تعريف الارتباط الوظيفية:</h4>
                <p className="text-sm">تتذكر تفضيلاتك وتحسن تجربة المستخدم</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-emerald-700" />
            <h3 className="text-xl font-bold text-emerald-800">لديك أسئلة عن الخصوصية؟</h3>
          </div>
          <p className="text-emerald-700 mb-6">
            إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية الخاصة بنا، فلا تتردد في التواصل معنا.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:privacy@biopara.ma" className="bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition">
              البريد الإلكتروني
            </a>
            <a href="/contact" className="bg-white text-emerald-700 border border-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition">
              صفحة التواصل
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
