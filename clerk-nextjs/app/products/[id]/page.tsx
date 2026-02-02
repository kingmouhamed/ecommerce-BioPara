"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Filter, 
  ChevronDown, 
  Search, 
  Grid, 
  List, 
  Star, 
  Heart, 
  ShoppingCart, 
  X 
} from "lucide-react";

// --- بيانات تجريبية (Mock Data) ---
const categories = [
  { name: "Cosmétique", count: 120 },
  { name: "Compléments", count: 45 },
  { name: "Huiles Essentielles", count: 30 },
  { name: "Hygiène", count: 85 },
  { name: "Miel & Ruche", count: 20 },
];

const products = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: i % 2 === 0 ? "Huile d'Argan Bio Premium" : "Crème Hydratante Visage",
  price: (i + 1) * 50 + 99,
  oldPrice: (i + 1) * 50 + 150,
  rating: 4.5,
  reviews: 12 + i,
  image: i % 2 === 0 
    ? "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=600" 
    : "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=600",
  badge: i === 0 ? "Nouveau" : i === 3 ? "-20%" : null,
  category: "Cosmétique"
}));

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(500);

  return (
    <div className="bg-gray-50 min-h-screen font-sans" dir="ltr">
      
      {/* --- Header Banner --- */}
      <div className="bg-emerald-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Nos Produits</h1>
          <p className="text-emerald-200">Découvrez le meilleur de la nature pour votre santé.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* --- Sidebar Filters (Desktop) --- */}
        <aside className={`lg:w-1/4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit lg:block ${mobileFiltersOpen ? "fixed inset-0 z-50 overflow-y-auto" : "hidden"}`}>
          
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Filtres</h2>
            <button onClick={() => setMobileFiltersOpen(false)} aria-label="إغلاق الفلترة"><X /></button>
          </div>

          {/* Search */}
          <div className="mb-8">
            <label htmlFor="search-product" className="font-bold text-gray-900 mb-3">Recherche</label>
            <div className="relative">
              <input id="search-product" type="text" placeholder="Chercher un produit..." className="w-full border border-gray-300 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:border-emerald-500" />
              <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8 border-b border-gray-100 pb-8">
            <h3 className="font-bold text-gray-900 mb-3 flex justify-between">Catégories <ChevronDown size={16} /></h3>
            <ul className="space-y-2">
              {categories.map((cat, idx) => (
                <li key={idx} className="flex justify-between items-center text-gray-600 hover:text-emerald-700 transition">
                  <label htmlFor={`category-${idx}`} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" id={`category-${idx}`} />
                    <span>{cat.name}</span>
                  </label>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{cat.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range */}
          <div className="mb-8 border-b border-gray-100 pb-8">
            <label htmlFor="price-range" className="font-bold text-gray-900 mb-3">Prix (MAD)</label>
            <input 
              id="price-range"
              type="range" 
              min="0" 
              max="2000" 
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>0 DH</span>
              <span className="font-bold text-emerald-700">{priceRange} DH</span>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-8">
             <h3 className="font-bold text-gray-900 mb-3">Avis Clients</h3>
             {[5, 4, 3, 2].map((stars) => (
               <label htmlFor={`rating-${stars}`} key={stars} className="flex items-center gap-2 mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                 <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" id={`rating-${stars}`} />
                 <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < stars ? "currentColor" : "none"} className={i >= stars ? "text-gray-300" : ""} />
                    ))}
                 </div>
                 <span className="text-xs text-gray-500">& Plus</span>
               </label>
             ))}
          </div>

          <button className="w-full bg-emerald-700 text-white py-3 rounded-lg font-bold hover:bg-emerald-800 transition" aria-label="تطبيق الفلاتر">
            Appliquer les filtres
          </button>
        </aside>

        {/* --- Main Content (Products Grid) --- */}
        <main className="lg:w-3/4">
          
          {/* Top Bar (Sorting & View Mode) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg text-sm font-bold text-gray-700"
                  aria-label="فتح الفلترة"
                >
                    <Filter size={18} /> Filtres
                </button>
                <p className="text-gray-500 text-sm hidden sm:block">Affichage de <span className="font-bold text-gray-900">1-12</span> sur 200 résultats</p>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <select className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-500 bg-white" aria-label="Sort by">
                    <option>Trier par: Pertinence</option>
                    <option>Prix: Croissant</option>
                    <option>Prix: Décroissant</option>
                    <option>Nouveautés</option>
                </select>

                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button 
                        onClick={() => setViewMode("grid")}
                        className={`p-2 ${viewMode === "grid" ? "bg-emerald-50 text-emerald-600" : "bg-white text-gray-400 hover:text-gray-600"}`}
                        aria-label="عرض شبكي"
                    >
                        <Grid size={20} />
                    </button>
                    <button 
                        onClick={() => setViewMode("list")}
                        className={`p-2 ${viewMode === "list" ? "bg-emerald-50 text-emerald-600" : "bg-white text-gray-400 hover:text-gray-600"}`}
                        aria-label="عرض قائمة"
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {products.map((product) => (
                <div key={product.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group ${viewMode === "list" ? "flex flex-row h-48" : ""}`}>
                    
                    {/* Image Section */}
                    <div className={`relative ${viewMode === "list" ? "w-48 h-full" : "aspect-[4/3] w-full"}`}>
                        <Image 
                            src={product.image} 
                            alt={product.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        {product.badge && (
                            <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded text-white ${product.badge === "Nouveau" ? "bg-blue-500" : "bg-red-500"}`}>
                                {product.badge}
                            </span>
                        )}
                        {/* Quick Actions (Hover) */}
                        <div className="absolute bottom-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                            <button className="bg-white p-2 rounded-full shadow text-gray-600 hover:text-red-500 transition" aria-label="إضافة للمفضلة"><Heart size={18} /></button>
                            <button className="bg-emerald-700 p-2 rounded-full shadow text-white hover:bg-emerald-800 transition" aria-label="إضافة للسلة"><ShoppingCart size={18} /></button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">{product.category}</span>
                            <Link href={`/products/${product.id}`}>
                                <h3 className="font-bold text-gray-800 mb-2 hover:text-emerald-700 transition line-clamp-2">{product.title}</h3>
                            </Link>
                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-2">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-400">({product.reviews})</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto">
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-emerald-700">{product.price} DH</span>
                                <span className="text-xs text-gray-400 line-through">{product.oldPrice} DH</span>
                            </div>
                            <Link href={`/products/${product.id}`} className={`px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-emerald-700 hover:text-white transition ${viewMode === "list" ? "block" : "hidden group-hover:block"}`}>
                                Voir Détails
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50" aria-label="الصفحة السابقة">Précédent</button>
            <button className="px-4 py-2 bg-emerald-700 text-white rounded-lg font-bold" aria-label="الصفحة الحالية">1</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50" aria-label="الصفحة 2">2</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50" aria-label="الصفحة 3">3</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50" aria-label="الصفحة التالية">Suivant</button>
          </div>

        </main>
      </div>
    </div>
  );
}