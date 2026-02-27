'use client';

import { Truck, Clock, MapPin, Shield } from 'lucide-react';

export default function DeliveryPage() {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">سياسة التوصيل</h1>

        <div className="bg-white p-8 rounded-xl shadow-md space-y-8">
          {/* Shipping Methods */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">طرق التوصيل</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Truck size={28} className="text-primary-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">التوصيل العادي</h3>
                  <p className="text-gray-700">من 3 إلى 5 أيام عمل - مجاني للطلبات فوق 100 ر.س</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock size={28} className="text-primary-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">التوصيل السريع</h3>
                  <p className="text-gray-700">توصيل في يوم أو يومين - 25 ر.س</p>
                </div>
              </div>

              <div className="flex gap-4">
                <MapPin size={28} className="text-primary-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">الاستلام من الفرع</h3>
                  <p className="text-gray-700">استلم طلبك من أقرب فرع لنا - مجاني</p>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Areas */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">مناطق التوصيل</h2>
            <p className="text-gray-700 text-lg mb-4">
              نوفر خدمة توصيل لجميع أنحاء المملكة العربية السعودية
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• الرياض وضواحيها</li>
              <li>• جدة والمنطقة الغربية</li>
              <li>• الدمام والمنطقة الشرقية</li>
              <li>• الطائف ومحافظات منطقة مكة</li>
              <li>• والمزيد من المناطق</li>
            </ul>
          </section>

          {/* Tracking */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">تتبع الطلب</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              بعد إتمام طلبك، ستحصل على رقم تتبع عبر البريد الإلكتروني. يمكنك استخدام هذا الرقم
              لتتبع حالة طلبك في أي وقت من خلال الموقع أو تطبيق الهاتف المحمول.
            </p>
          </section>

          {/* Packaging */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">طريقة التغليف</h2>
            <div className="flex gap-4 items-start">
              <Shield size={28} className="text-primary-600 flex-shrink-0" />
              <div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  نحرص على تغليف منتجاتك بعناية شديدة لضمان وصولها سليمة وآمنة.
                  جميع الطرود تُغلف برعاية احترافية وتشحن في صناديق آمنة.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">مشاكل في التوصيل؟</h2>
            <p className="text-gray-700 text-lg mb-4">
              إذا واجهت أي مشكلة في التوصيل، يرجى التواصل معنا فوراً على:
            </p>
            <p className="text-gray-700 text-lg">
              البريد الإلكتروني: support@bioparaa.com
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
