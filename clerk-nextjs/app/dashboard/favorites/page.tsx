"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, ArrowRight, Star } from "lucide-react";

export default function FavoritesPage() {
  // بيانات وهمية للمفضلة
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: "Vichy Mineral 89 Booster Quotidien Fortifiant",
      price: 210.0,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300",
      inStock: true,
      rating: 4.8
    },
    {
      id: 2,
      title: "La Roche-Posay Effaclar Gel Moussant",
      price: 150.0,
      image: "https://images.unsplash.com/photo-1556228720-19634e23387e?w=300",
      inStock: true,
      rating: 4.5
    },
    {
      id: 3,
      title: "Bio Oil Huile de Soin (Rupture)",
      price: 95.0,
      image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=300",
      inStock: false,
      rating: 4.2
    }
  ]);

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <Heart size={40} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Votre liste de favoris est vide</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Sauvegardez vos produits préférés pour les retrouver facilement plus tard.
        </p>
        <Link href="/products" className="bg-emerald-700 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-800 transition">
          DÉCOUVRIR NOS PRODUITS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="ltr">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <Heart className="text-red-500 fill-red-500" /> Mes Favoris <span className="text-gray-400 text-lg font-normal">({favorites.length})</span>
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b text-sm font-bold text-gray-600">
            <div className="col-span-6">Produit</div>
            <div className="col-span-2 text-center">Prix</div>
            <div className="col-span-2 text-center">Statut</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          <div className="divide-y divide-gray-100">
            {favorites.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 items-center group hover:bg-gray-50 transition">
                
                {/* Product Info */}
                <div className="md:col-span-6 flex gap-4">
                  <div className="w-20 h-20 bg-white border rounded p-2 shrink-0 relative">
                    <Image src={item.image} alt={item.title} fill className="object-contain" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-emerald-700 transition line-clamp-2 mb-1">{item.title}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs mb-2">
                       <Star size={12} fill="currentColor"/> <span>{item.rating}</span>
                    </div>
                    <button onClick={() => removeFavorite(item.id)} className="text-xs text-red-500 hover:underline md:hidden flex items-center gap-1">
                      <Trash2 size={12}/> Supprimer
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="md:col-span-2 md:text-center">
                   <span className="font-bold text-lg text-emerald-700">{item.price.toFixed(2)} DH</span>
                </div>

                {/* Stock Status */}
                <div className="md:col-span-2 md:text-center">
                  {item.inStock ? (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      En Stock
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                      Rupture
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex flex-col gap-2 md:items-end">
                  <button 
                    disabled={!item.inStock}
                    className="bg-emerald-700 text-white px-4 py-2 rounded text-sm font-bold hover:bg-emerald-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                  >
                    <ShoppingCart size={16} /> Ajouter
                  </button>
                  <button 
  aria-label="Supprimer le produit" 
  onClick={() => removeFavorite(item.id)} 
  className="text-gray-400 hover:text-red-500 p-2 hidden md:block transition"
>
  <Trash2 size={18} />
</button>
                </div>

              </div>
            ))}
          </div>

          <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
            <Link href="/products" className="text-emerald-700 font-bold hover:underline flex items-center gap-2">
               <ArrowRight size={16} className="rotate-180"/> Continuer le shopping
            </Link>
            <button className="text-gray-500 hover:text-red-600 text-sm font-medium">
               Vider la liste
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}