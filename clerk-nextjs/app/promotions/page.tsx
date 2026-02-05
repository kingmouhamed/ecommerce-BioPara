"use client";

import React from "react";
import Image from "next/image";
import { Timer, Tag, Percent, ShoppingCart, ArrowRight } from "lucide-react";

const promoProducts = [
  { id: 1, title: "Pack Routine Visage Eclat", brand: "Vichy", price: 350.0, oldPrice: 580.0, discount: 40, image: "https://images.unsplash.com/photo-1556228720-19634e23387e?w=300" },
  { id: 2, title: "Duo Solaire Familial", brand: "La Roche-Posay", price: 280.0, oldPrice: 420.0, discount: 33, image: "https://images.unsplash.com/photo-1556228578-8d85f5280b09?w=300" },
  { id: 3, title: "Coffret Naissance Bio", brand: "Mustela", price: 199.0, oldPrice: 299.0, discount: 35, image: "https://images.unsplash.com/photo-1519681393784-d8e5b5a4570e?w=300" },
  { id: 4, title: "Cure Anti-Chute 3 mois", brand: "Phyto", price: 450.0, oldPrice: 900.0, discount: 50, image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=300" },
  { id: 5, title: "Eau Micellaire Lot de 2", brand: "Bioderma", price: 180.0, oldPrice: 260.0, discount: 30, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300" },
  { id: 6, title: "Crème Mains Reparation", brand: "CeraVe", price: 45.0, oldPrice: 85.0, discount: 45, image: "https://images.unsplash.com/photo-1571781926291-28b46c54908d?w=300" },
];

export default function PromotionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="ltr">
      
      {/* Flash Sale Hero */}
      <div className="bg-red-600 text-white py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-red-800/50 px-4 py-1 rounded-full text-sm font-bold mb-4 border border-red-400">
               <Timer size={16} className="animate-pulse"/> OFFRE LIMITÉE
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">SUPER SOLDES</h1>
            <p className="text-red-100 text-lg max-w-lg mb-6">
              Jusqu&apos;à <span className="font-bold text-white bg-red-800 px-2"> -70% </span> sur une sélection de grandes marques. Stock limité !
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
               <div className="bg-white text-red-600 px-4 py-2 rounded-lg font-mono font-bold text-xl text-center">
                  02 <span className="block text-[10px] text-gray-500 uppercase">Jours</span>
               </div>
               <div className="bg-white text-red-600 px-4 py-2 rounded-lg font-mono font-bold text-xl text-center">
                  14 <span className="block text-[10px] text-gray-500 uppercase">Heures</span>
               </div>
               <div className="bg-white text-red-600 px-4 py-2 rounded-lg font-mono font-bold text-xl text-center">
                  35 <span className="block text-[10px] text-gray-500 uppercase">Min</span>
               </div>
            </div>
          </div>
          
          <div className="hidden md:block relative w-80 h-80">
             {/* Decorative element resembling a gift or product explosion */}
             <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
             <div className="absolute inset-4 bg-white/20 rounded-full"></div>
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl opacity-20 rotate-12">
                <Percent />
             </div>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      {/* Filter Strip */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
         <div className="container mx-auto px-4 py-4 flex overflow-x-auto gap-4 no-scrollbar">
            <button className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap">Tout voir</button>
            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap">-50% et plus</button>
            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap">Coffrets</button>
            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap">Soins Visage</button>
            <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap">Bébé</button>
         </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {promoProducts.map((product) => (
               <div key={product.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-xl transition group relative">
                  {/* Discount Badge */}
                  <div className="absolute top-0 right-0 bg-red-600 text-white font-bold px-3 py-2 rounded-bl-xl z-10 shadow-md">
                     -{product.discount}%
                  </div>

                  <div className="relative h-64 p-6 flex items-center justify-center bg-gray-50">
                     <Image 
                        src={product.image} 
                        alt={product.title} 
                        fill 
                        className="object-contain group-hover:scale-105 transition duration-500"
                     />
                     <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition translate-y-2 group-hover:translate-y-0">
                        <button className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center justify-center gap-2 mx-auto hover:bg-black">
                           <ShoppingCart size={16}/> Ajouter
                        </button>
                     </div>
                  </div>

                  <div className="p-4">
                     <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                     <h3 className="font-bold text-gray-800 mb-2 truncate">{product.title}</h3>
                     
                     <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                           <span className="text-xs text-gray-400 line-through">Prix conseillé</span>
                           <span className="text-sm text-gray-400 font-medium line-through decoration-red-500">{product.oldPrice.toFixed(2)} DH</span>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="flex flex-col">
                           <span className="text-xs text-red-600 font-bold">Prix Promo</span>
                           <span className="text-xl font-bold text-red-600">{product.price.toFixed(2)} DH</span>
                        </div>
                     </div>
                     
                     <div className="mt-4 pt-3 border-t">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                           <div className="bg-red-500 h-1.5 rounded-full w-1/2"></div>
                        </div>
                        <div className="text-xs text-gray-500 flex justify-between">
                           <span>Déjà vendus: {Math.floor(Math.random() * 50)}</span>
                           <span className="text-red-500 font-medium">Bientôt épuisé</span>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
         
         <div className="mt-12 text-center">
            <button className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-900 hover:text-white transition flex items-center gap-2 mx-auto">
               VOIR TOUTES LES OFFRES <ArrowRight size={18}/>
            </button>
         </div>
      </div>
    </div>
  );
}