"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  CheckCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Menu
} from "lucide-react";

// --- بيانات تجريبية للمنتج (لاحقاً ستأتي من قاعدة البيانات) ---
const productData = {
  id: 1,
  title: "BioPara Argan Oil Premium - Organic 100%",
  price: 250,
  oldPrice: 350,
  rating: 4.8,
  reviewsCount: 124,
  description:
    "زيت أركان بيوبارا الأصلي، مستخرج بعناية من أجود ثمار شجرة الأركان المغربية. غني بفيتامين E والأحماض الدهنية الأساسية. مثالي لترطيب البشرة، تغذية الشعر، وتقوية الأظافر. منتج طبيعي 100% بدون أي إضافات كيميائية.",
  stock: 15,
  category: "Cosmétique",
  sku: "ARG-100-BIO",
  images: [
    "https://images.unsplash.com/photo-1571781308869-ff4585483f2a?q=80&w=800", // صورة 1
    "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=800", // صورة 2
    "https://images.unsplash.com/photo-1556228720-1927515a468d?q=80&w=800", // صورة 3
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800", // صورة 4
  ],
  features: [
    "عضوي وطبيعي 100%",
    "معصور على البارد",
    "خالي من البارابين",
    "صناعة مغربية فاخرة",
  ],
  ingredients:
    "100% Argania Spinosa Kernel Oil (Huile d'Argan).",
};

// --- بيانات مراجعات العملاء ---
const reviews = [
  { id: 1, user: "Ahmed K.", rating: 5, date: "2026-01-15", comment: "منتج رائع جداً، التوصيل كان سريعاً والزيت جودته عالية." },
  { id: 2, user: "Sara L.", rating: 4, date: "2026-01-20", comment: "الزيت ممتاز للبشرة، لكن العبوة صغيرة قليلاً." },
  { id: 3, user: "Mohamed B.", rating: 5, date: "2026-01-28", comment: "أفضل زيت أركان جربته حتى الآن. شكراً بيوبارا!" },
];

// --- منتجات مقترحة ---
const relatedProducts = [
  { id: 2, title: "Savon Noir Beldi", price: 45, image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=400" },
  { id: 3, title: "Ghassoul Clay Mask", price: 80, image: "https://images.unsplash.com/photo-1590156206657-b8943491f6bb?q=80&w=400" },
  { id: 4, title: "Rose Water Spray", price: 60, image: "https://images.unsplash.com/photo-1616091093747-479225011505?q=80&w=400" },
];

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("desc");

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc" && quantity < productData.stock) setQuantity(quantity + 1);
    if (type === "dec" && quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 font-sans" dir="ltr">
      {/* --- Breadcrumb (مسار الصفحة) --- */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-700 transition">Accueil</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-emerald-700 transition">Produits</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate">{productData.title}</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* --- القسم الأيمن: معرض الصور --- */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
              <Image
                src={productData.images[selectedImage]}
                alt={productData.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                -30% PROMO
              </div>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2">
              {productData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === idx ? "border-emerald-600 ring-2 ring-emerald-100" : "border-gray-200 hover:border-gray-300"
                  }`}
                  aria-label={`عرض الصورة ${idx + 1}`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* --- القسم الأيسر: تفاصيل المنتج --- */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                {productData.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <Star size={14} fill="currentColor" />
                <span className="text-gray-700 font-bold">{productData.rating}</span>
                <span className="text-gray-400">({productData.reviewsCount} avis)</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{productData.title}</h1>
            
            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-bold text-emerald-700">{productData.price} MAD</span>
              <span className="text-lg text-gray-400 line-through mb-1">{productData.oldPrice} MAD</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6 border-b border-gray-100 pb-6">
              {productData.description}
            </p>

            {/* مميزات سريعة */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {productData.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-emerald-500" />
                  {feature}
                </div>
              ))}
            </div>

            {/* أزرار التحكم */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* عداد الكمية */}
              <div className="flex items-center border-2 border-gray-200 rounded-lg w-full sm:w-auto">
                <button 
                  onClick={() => handleQuantityChange("dec")}
                  className="p-3 hover:bg-gray-100 text-gray-600 transition"
                  disabled={quantity <= 1}
                  aria-label="تقليل الكمية"
                >
                  <Minus size={20} />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange("inc")}
                  className="p-3 hover:bg-gray-100 text-gray-600 transition"
                  aria-label="زيادة الكمية"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* زر الإضافة للسلة */}
              <button className="flex-1 bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-800 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2">
                <ShoppingCart size={20} />
                Ajouter au Panier
              </button>
              
              {/* زر المفضلة */}
              <button className="p-3 border-2 border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition" aria-label="إضافة للمفضلة">
                <Heart size={24} />
              </button>
            </div>

            {/* معلومات الشحن */}
            <div className="space-y-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-gray-700" />
                <span>Livraison Gratuite à partir de 300 DHS</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-gray-700" />
                <span>Garantie Authenticité 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw size={18} className="text-gray-700" />
                <span>Retour gratuit sous 7 jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- قسم التبويبات (Description / Reviews) --- */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("desc")}
              className={`px-8 py-4 font-bold text-sm md:text-base transition ${activeTab === "desc" ? "border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Description & Détails
            </button>
            <button
              onClick={() => setActiveTab("ingredients")}
              className={`px-8 py-4 font-bold text-sm md:text-base transition ${activeTab === "ingredients" ? "border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Ingrédients
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-8 py-4 font-bold text-sm md:text-base transition ${activeTab === "reviews" ? "border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Avis Clients ({productData.reviewsCount})
            </button>
          </div>

          <div className="p-8 min-h-[200px]">
            {activeTab === "desc" && (
              <div className="prose max-w-none text-gray-600">
                <p>استمتع بتجربة العناية الفاخرة مع زيت أركان بيوبارا. هذا المنتج ليس مجرد زيت، بل هو إكسير الحياة لبشرتك وشعرك. يتم استخلاصه بطرق تقليدية تحافظ على جميع العناصر الغذائية.</p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li>يرطب البشرة الجافة بعمق.</li>
                  <li>يساعد في تقليل التجاعيد والخطوط الدقيقة.</li>
                  <li>يعالج تقصف الشعر ويعطيه لمعاناً طبيعياً.</li>
                  <li>يقوي الأظافر ويمنع تكسرها.</li>
                </ul>
              </div>
            )}
            
            {activeTab === "ingredients" && (
              <div className="text-gray-600">
                <h3 className="font-bold text-gray-900 mb-2">المكونات الكاملة:</h3>
                <p className="bg-gray-50 p-4 rounded-lg border border-gray-200 inline-block font-mono text-sm">
                  {productData.ingredients}
                </p>
                <p className="mt-4 text-sm text-gray-500">* جميع المكونات معتمدة عضوياً من قبل الهيئات المختصة.</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">ماذا يقول عملاؤنا؟</h3>
                  <button className="text-emerald-700 font-bold hover:underline" aria-label="كتابة مراجعة">Écrire un avis</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-bold text-gray-900">{review.user}</h4>
                            <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} stroke={i < review.rating ? "none" : "currentColor"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- قسم منتجات ذات صلة --- */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-l-4 border-emerald-600 pl-4">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 group">
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                   <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 truncate mb-1">{item.title}</h3>
                  <p className="text-emerald-700 font-bold">{item.price} MAD</p>
                  <button className="mt-3 w-full border border-emerald-600 text-emerald-700 text-sm font-bold py-2 rounded hover:bg-emerald-50 transition" aria-label="عرض التفاصيل">
                    Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}