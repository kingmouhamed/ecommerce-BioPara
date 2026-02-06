"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Filter, 
  ChevronDown, 
  Grid, 
  List, 
  Star, 
  Heart, 
  ShoppingCart,
  Check
} from "lucide-react";

// --- بيانات وهمية موسعة (Mock Data) ---
const mockBrands = ["La Roche-Posay", "Vichy", "CeraVe", "Bioderma", "Nuxe", "Avène"];
const mockProducts = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: [
    "Gel Nettoyant Purifiant", "Crème Hydratante Riche", "Sérum Anti-Âge Global", 
    "Ecran Solaire SPF50+", "Shampoing Fortifiant", "Huile Prodigieuse"
  ][i % 6],
  brand: mockBrands[i % mockBrands.length],
  price: (Math.random() * 300 + 50).toFixed(2),
  rating: Math.floor(Math.random() * 2) + 3.5, // 3.5 to 5
  reviews: Math.floor(Math.random() * 100),
  image: `https://images.unsplash.com/photo-${[
    "1556228720-19634e23387e", "1620916566398-39f1143ab7be", "1556228578-8d85f5280b09",
    "1519681393784-d8e5b5a4570e", "1608248597279-f99d160bfbc8"
  ][i % 5]}?w=400`,
  isNew: i < 3,
  inStock: i !== 4
}));

// --- المكون الرئيسي ---
export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = decodeURIComponent(params.slug).toUpperCase();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState(500);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popular");

  // منطق الفلتر (Toggle Brand)
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-emerald-800 text-white py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-sm text-emerald-200 mb-2">الرئيسية / المتجر / {categoryName}</div>
          <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
          <p className="max-w-2xl text-emerald-100 text-lg">
            اكتشف مختاراتنا الحصرية من منتجات {categoryName.toLowerCase()}. 
            منتجات عالية الجودة، معتمدة أصيلة وبأفضل سعر في المغرب.
          </p>
        </div>
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-700 skew-x-12 opacity-50 transform translate-x-20"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filter (Left) */}
          <aside className="w-full lg:w-1/4 shrink-0 space-y-8">
            
            {/* Filter: Categories */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">التصنيفات الفرعية</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {["منظفات", "مرطبات", "سيرومات", "واقيات الشمس", "العناية بالعين"].map(sub => (
                  <li key={sub} className="flex items-center justify-between cursor-pointer hover:text-emerald-700">
                    <span>{sub}</span>
                    <span className="bg-gray-100 text-gray-500 text-xs py-0.5 px-2 rounded-full">{(Math.random()*50).toFixed(0)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter: Prix */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">فلتر حسب السعر</h3>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-emerald-700 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  aria-label="فلتر حسب السعر"
                />
                <div className="flex justify-between text-sm font-medium mt-3 text-gray-600">
                  <span>0 DH</span>
                  <span className="text-emerald-700">{priceRange} DH</span>
                  <span>1000+ DH</span>
                </div>
              </div>
            </div>

            {/* Filter: Marques */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">الماركات</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {mockBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 border rounded flex items-center justify-center transition ${selectedBrands.includes(brand) ? 'bg-emerald-700 border-emerald-700' : 'border-gray-300 bg-white group-hover:border-emerald-500'}`}>
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                      {selectedBrands.includes(brand) && <Check size={14} className="text-white"/>}
                    </div>
                    <span className={`text-sm ${selectedBrands.includes(brand) ? 'text-emerald-700 font-medium' : 'text-gray-600'}`}>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Banner Pub Sidebar */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
              <h4 className="font-bold text-orange-800 text-lg mb-2">عرض خاص</h4>
              <p className="text-sm text-orange-700 mb-4">-20% على طلبك الأولى باستخدام كود <span className="font-bold">BIO20</span></p>
              <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-orange-600 w-full">استفد الآن</button>
            </div>

          </aside>

          {/* Main Content (Right) */}
          <main className="flex-1">
            
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500">
                عرض <span className="font-bold text-gray-800">1-12</span> من <span className="font-bold text-gray-800">45</span> منتج
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 hidden sm:inline">ترتيب حسب:</span>
                  <select
                    className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-emerald-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="ترتيب حسب"
                  >
                    <option value="popular">الأكثر شعبية</option>
                    <option value="price_asc">السعر تصاعدي</option>
                    <option value="price_desc">السعر تنازلي</option>
                    <option value="newest">الأحدث</option>
                  </select>
                </div>

                <div className="flex border border-gray-300 rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-emerald-50 text-emerald-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    aria-label="عرض شبكي"
                  >
                    <Grid size={20}/>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-emerald-50 text-emerald-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    aria-label="عرض قائمة"
                  >
                    <List size={20}/>
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              {mockProducts.map((product) => (
                <div key={product.id} className={`bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition group ${viewMode === "list" ? "flex items-center p-4 gap-6" : ""}`}>
                  
                  {/* Image Area */}
                  <div className={`relative bg-white overflow-hidden ${viewMode === "list" ? "w-48 h-48 shrink-0" : "h-64 flex items-center justify-center p-6"}`}>
                    {product.isNew && (
                      <span className="absolute top-3 right-3 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10">جديد</span>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                        <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded">نفد المخزون</span>
                      </div>
                    )}
                    
                    <Image 
                      src={product.image} 
                      alt={product.title} 
                      fill 
                      className={`object-contain transition duration-500 ${product.inStock ? "group-hover:scale-105" : "grayscale"}`}
                    />
                    
                    {/* Quick Actions (Hover) - Only in Grid */}
                    {viewMode === "grid" && product.inStock && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition duration-300">
                        <button className="w-full bg-emerald-700 text-white py-2.5 rounded font-bold shadow-lg hover:bg-emerald-800 flex items-center justify-center gap-2">
                          <ShoppingCart size={18}/> أضف إلى السلة
                        </button>
                      </div>
                    )}
                    
                    {/* Wishlist Button */}
                    <button className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition" aria-label="إضافة للمفضلة">
                      <Heart size={16}/>
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className={`${viewMode === "list" ? "flex-1 py-2" : "p-4"}`}>
                    <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-bold text-gray-800 mb-2 hover:text-emerald-700 transition line-clamp-2 min-h-[40px]" title={product.title}>
                        {product.title}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({length: 5}).map((_, i) => (
                        <Star key={i} size={12} className={`${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
                    </div>

                    <div className="flex items-end justify-between mt-auto">
                      <div className="font-bold text-xl text-emerald-700">{Number(product.price).toFixed(2)} DH</div>
                      {viewMode === "list" && product.inStock && (
                        <button className="bg-emerald-700 text-white px-6 py-2 rounded font-bold hover:bg-emerald-800 transition flex items-center gap-2">
                          <ShoppingCart size={18}/> أضف إلى السلة
                        </button>
                      )}
                    </div>
                    
                    {viewMode === "list" && (
                      <p className="text-sm text-gray-500 mt-4 line-clamp-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 text-gray-500 disabled:opacity-50" disabled>
                  &laquo;
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded bg-emerald-700 text-white font-bold">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium">3</button>
                <span className="px-2 text-gray-400">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium">12</button>
                <button className="w-10 h-10 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium">
                  &raquo;
                </button>
              </nav>
            </div>

            {/* SEO Description (Bottom) */}
            <div className="mt-16 bg-gray-100 p-8 rounded-xl text-gray-600 text-sm leading-relaxed">
              <h2 className="text-xl font-bold text-gray-800 mb-4">كل شيء عن {categoryName}</h2>
              في بيوبارا، نلتزم بتزويدك بمجموعة واسعة من منتجات {categoryName.toLowerCase()}. منتجات عالية الجودة، معتمدة أصيلة وبأفضل سعر في المغرب.
              استمتع بالتوصيل السريع في جميع أنحاء المغرب (الدار البيضاء، الرباط، مراكش، طنجة...) وخدمة عملاء تستمع إليك. جميع منتجاتنا مضمونة أصيلة 100%.
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}