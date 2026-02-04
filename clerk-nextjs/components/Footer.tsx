import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6 mt-12" dir="rtl">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-right">
        <div>
          <h4 className="font-bold text-lg mb-4 text-emerald-400">BioPara.ma</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            خبيرك في المنتجات شبه الصيدلية والعلاج بالنباتات في المغرب. التحالف المثالي بين العلم والطبيعة.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">معلومات</h4>
          <ul className="text-sm text-gray-400 space-y-2">
            <li><Link href="/about" className="hover:text-white">من نحن؟</Link></li>
            <li><Link href="/delivery" className="hover:text-white">التوصيل والإرجاع</Link></li>
            <li><Link href="/terms" className="hover:text-white">الشروط العامة</Link></li>
            <li><Link href="/contact" className="hover:text-white">اتصل بنا</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">أقسامنا</h4>
          <ul className="text-sm text-gray-400 space-y-2">
            <li className="font-bold text-white mt-2">شبه صيدلية</li>
            <li><Link href="/category/visage" className="hover:text-emerald-300 mr-2">- العناية بالبشرة</Link></li>
            <li><Link href="/category/corps" className="hover:text-emerald-300 mr-2">- العناية بالجسم</Link></li>
            <li><Link href="/category/cheveux" className="hover:text-emerald-300 mr-2">- العناية بالشعر</Link></li>
            <li className="font-bold text-white mt-2">الأعشاب</li>
            <li><Link href="/category/huiles" className="hover:text-green-300 mr-2">- الزيوت العطرية</Link></li>
            <li><Link href="/category/tisanes" className="hover:text-green-300 mr-2">- الأعشاب الطبية</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">النشرة الإخبارية</h4>
          <p className="text-xs text-gray-400 mb-4">اشترك لتلقي عروضنا.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="bg-gray-700 text-white px-3 py-2 text-sm rounded-r w-full focus:outline-none text-right"
            />
            <button className="bg-emerald-600 px-4 py-2 rounded-l text-sm font-bold hover:bg-emerald-700">موافق</button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-emerald-400">🌿</span>
        </div>
        © 2026 BioPara. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
};

export default Footer;
