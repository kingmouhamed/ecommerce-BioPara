import Image from 'next/image';
import React from 'react';

const HeroSection = () => {
  return (
    <div className="bg-gray-100 py-6">
      <div className="container mx-auto px-4">
         <div className="bg-emerald-100 rounded-xl overflow-hidden relative min-h-[300px] md:min-h-[400px] flex items-center justify-center text-center p-6 cursor-pointer group">
            <Image 
              src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1200" 
              alt="Banner" 
              fill 
              className="object-cover opacity-90 group-hover:scale-105 transition duration-700"
            />
            <div className="relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-lg border-l-4 border-emerald-600">
               <h2 className="text-3xl md:text-5xl font-bold text-emerald-800 mb-2">Nature & Science</h2>
               <p className="text-gray-700 mb-6 text-lg">Découvrez +300 produits authentiques pour votre bien-être.</p>
               <button className="bg-emerald-700 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-800 transition shadow-lg">J&apos;EN PROFITE</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default HeroSection;