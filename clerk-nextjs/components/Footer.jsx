import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-heading">منتجاتنا</h3>
          <ul className="footer-links">
            <li><Link href="/products">جميع المنتجات</Link></li>
            <li><Link href="/products">منتجات جديدة</Link></li>
            <li><Link href="/products">الأكثر مبيعا</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">معلومات مفيدة</h3>
          <ul className="footer-links">
            <li><Link href="/delivery">التوصيل والتسليم</Link></li>
            <li><Link href="/legal">الشروط القانونية</Link></li>
            <li><Link href="/terms">شروط الاستخدام</Link></li>
            <li><Link href="/payment">الدفع الآمن</Link></li>
            <li><Link href="/routes">خريطة الموقع</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">من نحن</h3>
          <ul className="footer-links">
            <li><Link href="/about">من نحن؟</Link></li>
            <li><Link href="/contact">اتصل بنا</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">حسابكم</h3>
          <ul className="footer-links">
            <li><Link href="/login">المعلومات الشخصية</Link></li>
            <li><Link href="/cart">الطلبات</Link></li>
            <li><Link href="/credits">الأرصدة</Link></li>
            <li><Link href="/addresses">العناوين</Link></li>
            <li><Link href="/coupons">قسائم التخفيض</Link></li>
            <li><Link href="/favorites">المفضلة</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
