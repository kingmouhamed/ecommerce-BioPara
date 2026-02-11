"use client";

import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import Hero from "../components/Hero";
import ProductList from "../components/ProductList";
import Brands from "../components/Brands";
import FeaturedTabs from "../components/FeaturedTabs";
import Footer from "../components/Footer";
import CategoriesGrid from "../components/CategoriesGrid";
import { allProducts, Product, parapharmacieProducts, herbalProducts } from "../data/index";

export default function HomePage() {
  const { addToCart, cartItemCount } = useCart();

  // Filter products for different sections
  const paraProducts = parapharmacieProducts;
  const herbalProductsList = herbalProducts;
  const newArrivals = allProducts.filter((p: Product) => p && p.isNew).slice(0, 10);
  const bestSellers = allProducts
    .filter((p: Product) => p)
    .sort((a: Product, b: Product) => (b.oldPrice || 0) - (a.oldPrice || 0))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <main>
        <Hero />
        
        <div className="container mx-auto px-4 py-12">
          <CategoriesGrid />
        </div>

        {/* Parapharmacie Products */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">الأكثر مبيعاً في شبه الصيدلية</h2>
          <p className="text-gray-600 mb-8">أفضل الماركات العالمية للعناية بالبشرة</p>
          <ProductList products={paraProducts.slice(0, 8)} />
        </div>

        <Brands />

        {/* Featured Products Tabs */}
        <div className="container mx-auto px-4 py-12">
          <FeaturedTabs />
        </div>

        {/* Herbalism Products */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">الأكثر مبيعاً في الأعشاب الطبية</h2>
          <p className="text-gray-600 mb-8">منتجات طبيعية 100% للعناية بصحتك</p>
          <ProductList products={herbalProductsList.slice(0, 8)} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
