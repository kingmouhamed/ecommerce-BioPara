import React from 'react';

const TopBar = () => {
  return (
    // الخلفية خضراء (مشابهة للموقع) والنص أبيض وتوسيط المحتوى
    <div className="w-full bg-[#7ed321] text-white text-sm py-2 px-4 text-center font-medium">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        {/* الجزء الأيمن: التوصيل */}
        <span>
          LIVRAISON GRATUITE*
        </span>
        
        {/* الجزء الأيسر: الواتساب */}
        <span className="flex items-center gap-2">
           Vous ne trouvez pas un produit ? Contactez-nous sur WhatsApp: 
           <a href="https://wa.me/212673020264" className="font-bold hover:underline">
             0673020264
           </a>
        </span>
      </div>
    </div>
  );
};

export default TopBar;