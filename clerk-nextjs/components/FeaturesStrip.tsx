
import { Truck, ShieldCheck, CreditCard, Star } from 'lucide-react';
import React from 'react';

const FeaturesStrip = () => {
  return (
    <div className="bg-white border-b py-6 mb-8">
       <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center"><Truck className="text-emerald-600 mb-2"/><span className="text-xs font-bold text-gray-700">Livraison 24h</span></div>
          <div className="flex flex-col items-center"><ShieldCheck className="text-emerald-600 mb-2"/><span className="text-xs font-bold text-gray-700">Authentique</span></div>
          <div className="flex flex-col items-center"><CreditCard className="text-emerald-600 mb-2"/><span className="text-xs font-bold text-gray-700">Paiement Sécurisé</span></div>
          <div className="flex flex-col items-center"><Star className="text-emerald-600 mb-2"/><span className="text-xs font-bold text-gray-700">Service Client</span></div>
       </div>
    </div>
  );
};

export default FeaturesStrip;
