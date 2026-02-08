"use client";

import React from "react";
import { Truck, Clock, Shield, MapPin, Package, RefreshCw } from "lucide-react";

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">التوصيل والإرجاع</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            كل ما تحتاج لمعرفته عن سياسات التوصيل والإرجاع في BioPara
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Delivery Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">خيارات التوصيل</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-emerald-600">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-8 h-8 text-emerald-700" />
                <h3 className="text-xl font-bold text-gray-800">التوصيل القياسي</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">المدة:</span>
                  <span className="font-medium">3-5 أيام عمل</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">التكلفة:</span>
                  <span className="font-medium text-emerald-600">مجاني</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الحد الأدنى للطلب:</span>
                  <span className="font-medium">لا يوجد</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-8 h-8 text-blue-700" />
                <h3 className="text-xl font-bold text-gray-800">التوصيل السريع</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">المدة:</span>
                  <span className="font-medium">1-2 أيام عمل</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">التكلفة:</span>
                  <span className="font-medium">30.00 درهم</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الحد الأدنى للطلب:</span>
                  <span className="font-medium">لا يوجد</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-600">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-8 h-8 text-purple-700" />
                <h3 className="text-xl font-bold text-gray-800">الاستلام من الفرع</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">المدة:</span>
                  <span className="font-medium">نفس اليوم</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">التكلفة:</span>
                  <span className="font-medium text-emerald-600">مجاني</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">العنوان:</span>
                  <span className="font-medium">الدار البيضاء</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">مراحل التوصيل</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">تأكيد الطلب</h3>
              <p className="text-gray-600 text-sm">
                استلام الطلب وتأكيد الدفع
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">تحضير الشحنة</h3>
              <p className="text-gray-600 text-sm">
                تغليف المنتجات وتجهيزها للشحن
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">التوصيل</h3>
              <p className="text-gray-600 text-sm">
                تسليم الطلب إلى العنوان المحدد
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">استلام الطلب</h3>
              <p className="text-gray-600 text-sm">
                التأكد من المنتجات والتوقيع
              </p>
            </div>
          </div>
        </div>

        {/* Return Policy */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">سياسة الإرجاع</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-emerald-700" />
                شروط الإرجاع
              </h3>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>فترة الإرجاع: 14 يوماً من تاريخ الاستلام</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>يجب أن يكون المنتج في حالته الأصلية</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>العبوة الأصلية يجب أن تكون مكتملة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>إيصال الشراء مطلوب</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 mt-1">•</span>
                  <span>المنتجات المستخدمة لا تقبل الإرجاع</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">منتجات لا تقبل الإرجاع</h3>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>المنتجات الغذائية والمكملات</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>منتجات العناية الشخصية المفتوحة</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>المنتجات المخفضة بشكل خاص</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>المنتجات الصحية المعقمة</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-emerald-800 mb-4">ملاحظات هامة</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2">التوصيل:</h4>
              <ul className="space-y-1 text-emerald-700 text-sm">
                <li>• التوصيل في جميع أنحاء المغرب</li>
                <li>• التوصيل في أيام العمل فقط</li>
                <li>• يمكن تتبع الطلب عبر الرقم</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2">الإرجاع:</h4>
              <ul className="space-y-1 text-emerald-700 text-sm">
                <li>• استرداد المبلغ خلال 7 أيام عمل</li>
                <li>• يمكن استبدال المنتج بدلاً من الإرجاع</li>
                <li>• تكلفة الإرجاع على العميل</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
