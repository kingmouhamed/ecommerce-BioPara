
import { Leaf } from 'lucide-react';
import React from 'react';

const PromoBanner = () => {
  return (
    <section className="container mx-auto px-4 py-8">
       <div className="bg-green-800 rounded-xl p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
             <h2 className="text-3xl font-bold mb-2">L&apos;Univers Herboristerie</h2>
             <p className="mb-4 text-green-100">Huiles pures, Miels, et Plantes médicinales.</p>
             <button className="bg-white text-green-800 px-6 py-2 rounded-full font-bold hover:bg-green-50">Découvrir le Bio</button>
          </div>
          <Leaf className="absolute top-4 right-4 text-green-600 w-32 h-32 opacity-30"/>
       </div>
    </section>
  );
};

export default PromoBanner;
