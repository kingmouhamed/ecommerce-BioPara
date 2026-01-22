import React from 'react';
import { Truck, CheckCircle, AlertCircle } from 'lucide-react';

const Delivery = () => {
  return (
    <div className="info-page">
      <div className="info-header">
        <Truck size={40} className="info-icon" />
        <h1>التوصيل والتسليم</h1>
      </div>

      <div className="info-container">
        <section className="info-section">
          <h2>خدمة التوصيل</h2>
          <p>نوفر خدمة توصيل سريعة وآمنة لجميع أنحاء المغرب.</p>

          <h3>الأسعار:</h3>
          <ul>
            <li>الرباط وسلا: توصيل مجاني</li>
            <li>المناطق الأخرى: 30-50 درهم</li>
            <li>المناطق البعيدة: حسب المسافة</li>
          </ul>

          <h3>المدة:</h3>
          <ul>
            <li>الرباط: 1-2 يوم عمل</li>
            <li>العاصمة وضواحيها: 2-3 أيام عمل</li>
            <li>باقي المدن: 3-5 أيام عمل</li>
          </ul>

          <h3>طرق التوصيل:</h3>
          <ul>
            <li>التسليم المباشر عند العنوان</li>
            <li>استلام من محطة التوصيل</li>
            <li>التوصيل ليلي (طلبات خاصة)</li>
          </ul>

          <h3>تتبع الطلب:</h3>
          <p>يمكنك تتبع طلبك في الوقت الفعلي من خلال رقم الطلب عبر رابط التتبع أو WhatsApp.</p>
        </section>

        <section className="info-section">
          <h2>سياسة الإرجاع</h2>
          <ul>
            <li>يمكن إرجاع المنتجات خلال 14 يوم من تاريخ الاستلام</li>
            <li>يجب أن تكون المنتجات في حالتها الأصلية</li>
            <li>رسوم الإرجاع: 20 درهم</li>
            <li>استرجاع المبلغ خلال 5-7 أيام عمل</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Delivery;
