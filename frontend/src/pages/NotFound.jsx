import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-4">404 - الصفحة غير موجودة</h1>
      <p className="text-lg mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
      <Link to="/" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
};

export default NotFound;
