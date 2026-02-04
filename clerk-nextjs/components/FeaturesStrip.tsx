
"use client";

import React from "react";
import { Truck, ShieldCheck, CreditCard, Star } from "lucide-react";

const FeaturesStrip = () => (
  <div className="bg-white border-b py-6">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-center divide-x divide-gray-100">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <Truck />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">Livraison Rapide</h4>
        <p className="text-xs text-gray-500">Partout au Maroc en 24/48h</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <ShieldCheck />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">Produits Authentiques</h4>
        <p className="text-xs text-gray-500">100% garantis par nos labos</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <CreditCard />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">Paiement Sécurisé</h4>
        <p className="text-xs text-gray-500">Carte bancaire ou à la livraison</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <Star />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">Service Client</h4>
        <p className="text-xs text-gray-500">Disponible 7j/7 pour vous</p>
      </div>
    </div>
  </div>
);

export default FeaturesStrip;
