import React from 'react';

const TopBar = () => {
  return (
    // الخلفية خضراء (مشابهة للموقع) والنص أبيض وتوسيط المحتوى
    <div className="w-full bg-[#7ed321] text-white py-2 px-4 text-center font-medium">
      <div className="container mx-auto flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-center sm:gap-2">
        {/* الجزء الأيمن: التوصيل */}
        <span className="text-xs sm:text-sm">
          LIVRAISON GRATUITE*
        </span>
        
        {/* الجزء الأيسر: الواتساب */}
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-2">
          <span className="text-xs sm:text-sm">Vous ne trouvez pas un produit ?</span>
          <a href="https://wa.me/212673020264" className="font-bold hover:underline text-xs sm:text-sm">
            Contactez-nous sur WhatsApp: 0673020264
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;