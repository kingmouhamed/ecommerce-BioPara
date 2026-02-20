'use client';

import { RotateCcw, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">سياسة الاسترجاع والتبديل</h1>

        <div className="bg-white p-8 rounded-xl shadow-md space-y-8">
          {/* Return Period */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={28} className="text-primary-600" />
              فترة الاسترجاع
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              يمكنك استرجاع أو تبديل المنتج خلال 14 يوماً من استلام طلبك.
              يجب أن يكون المنتج في حالته الأصلية بدون فتح أو استخدام.
            </p>
          </section>

          {/* Return Conditions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle size={28} className="text-primary-600" />
              شروط الاسترجاع
            </h2>
            <ul className="space-y-2 text-gray-700 text-lg">
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">✓</span>
                <span>المنتج لم يتم فتحه أو استخدامه</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">✓</span>
                <span>العبوة والمواد الأصلية سليمة وموجودة</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">✓</span>
                <span>الفاتورة والإيصال موجود</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600 font-bold">✓</span>
                <span>المنتج لم يتضرر أو يتعرض للتلف</span>
              </li>
            </ul>
          </section>

          {/* Return Process */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <RotateCcw size={28} className="text-primary-600" />
              خطوات الاسترجاع
            </h2>
            <ol className="space-y-4 text-gray-700">
              <li className="flex items-start gap-4">
                <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </span>
                <p className="text-lg pt-1">تواصل معنا عبر البريد الإلكتروني مع شرح السبب</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </span>
                <p className="text-lg pt-1">اتفق معنا على طريقة الاسترجاع والتكاليف</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </span>
                <p className="text-lg pt-1">احزم المنتج بأمان وأرسله إلينا</p>
              </li>
              <li className="flex items-start gap-4">
                <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                  4
                </span>
                <p className="text-lg pt-1">بعد استقبالنا، سيتم معالجة طلبك خلال 5 أيام</p>
              </li>
            </ol>
          </section>

          {/* Refund */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle size={28} className="text-primary-600" />
              عملية استرجاع المبلغ
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              بعد التحقق من المنتج واستقباله، سيتم استرجاع المبلغ الكامل.
              قد تستغرق عملية الاسترجاع من 5 إلى 10 أيام عمل.
            </p>
            <div className="bg-blue-50 border-l-4 border-primary-600 p-4 rounded">
              <p className="text-gray-700 text-lg">
                <strong>ملاحظة:</strong> تكاليف الشحن الأولية لن يتم استرجاعها إلا في حالة
                وجود خطأ من قبلنا أو منتج معيب.
              </p>
            </div>
          </section>

          {/* Exceptions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">حالات عدم الاسترجاع</h2>
            <ul className="space-y-2 text-gray-700 text-lg">
              <li>• المنتجات المفتوحة أو المستخدمة</li>
              <li>• المنتجات المنتهية الصلاحية</li>
              <li>• المنتجات التي تعرضت للتلف بسبب الاستخدام</li>
              <li>• المنتجات المرجعة بدون إيصال أو فاتورة</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">تواصل معنا</h2>
            <p className="text-gray-700 text-lg mb-2">
              لأي استفسارات حول الاسترجاع، يرجى التواصل معنا:
            </p>
            <p className="text-gray-700 text-lg">
              البريد: returns@bioparaa.com
            </p>
            <p className="text-gray-700 text-lg">
              الهاتف: +966 50 123 4567
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
