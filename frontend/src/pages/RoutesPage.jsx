import React from 'react';
import { Link } from 'react-router-dom';

const RoutesPage = () => {
  const routes = [
    { path: '/', name: 'الرئيسية', description: 'الصفحة الرئيسية للمتجر' },
    { path: '/products', name: 'جميع المنتجات', description: 'عرض جميع المنتجات المتاحة' },
    { path: '/products?category=Visage', name: 'الاعشاب الطبية', description: 'منتجات الاعشاب الطبية' },
    { path: '/products?category=Parapharmacie', name: 'Parapharmacie', description: 'منتجات Parapharmacie' },
    { path: '/about', name: 'من نحن', description: 'معلومات عن المتجر' },
    { path: '/contact', name: 'اتصل بنا', description: 'صفحة التواصل' },
    { path: '/login', name: 'تسجيل الدخول', description: 'تسجيل الدخول أو إنشاء حساب' },
    { path: '/favorites', name: 'المفضلة', description: 'المنتجات المفضلة' },
    { path: '/cart', name: 'سلة التسوق', description: 'عرض وإدارة سلة التسوق' },
    { path: '/checkout', name: 'إتمام الطلب', description: 'إتمام عملية الشراء' },
  ];

  return (
    <div className="routes-page">
      <h1>خريطة الموقع</h1>
      <p>استكشف جميع الصفحات المتاحة في متجرنا:</p>
      <div className="routes-grid">
        {routes.map((route, index) => (
          <div key={index} className="route-card">
            <h3><Link to={route.path}>{route.name}</Link></h3>
            <p>{route.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutesPage;