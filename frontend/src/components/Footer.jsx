import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-heading">منتجاتنا</h3>
          <ul className="footer-links">
            <li><Link to="/products">جميع المنتجات</Link></li>
            <li><Link to="/products">منتجات جديدة</Link></li>
            <li><Link to="/products">الأكثر مبيعا</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">معلومات مفيدة</h3>
          <ul className="footer-links">
            <li><Link to="/delivery">التوصيل والتسليم</Link></li>
            <li><Link to="/legal">الشروط القانونية</Link></li>
            <li><Link to="/terms">شروط الاستخدام</Link></li>
            <li><Link to="/payment">الدفع الآمن</Link></li>
            <li><Link to="/routes">خريطة الموقع</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">من نحن</h3>
          <ul className="footer-links">
            <li><Link to="/about">من نحن؟</Link></li>
            <li><Link to="/contact">اتصل بنا</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">حسابكم</h3>
          <ul className="footer-links">
            <li><Link to="/login">المعلومات الشخصية</Link></li>
            <li><Link to="/cart">الطلبات</Link></li>
            <li><Link to="/credits">الأرصدة</Link></li>
            <li><Link to="/addresses">العناوين</Link></li>
            <li><Link to="/coupons">قسائم التخفيض</Link></li>
            <li><Link to="/favorites">المفضلة</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
