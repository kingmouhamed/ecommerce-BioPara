
"use client";

import React from "react";
import { mockProducts } from "../data/products";
import type { Product } from "../data/products";

// Import modular components
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesStrip from "@/components/FeaturesStrip";
import ProductRow from "@/components/ProductRow";
import PromoBanner from "@/components/PromoBanner";
import Footer from "@/components/Footer";
import Brands from "@/components/Brands";
import CategoriesGrid from "@/components/CategoriesGrid";
import Newsletter from "@/components/Newsletter";
import Loyalty from "@/components/Loyalty";
import FeaturedTabs from "@/components/FeaturedTabs";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export default function HomePage() {
  // Filter products for different sections
  const paraProducts = mockProducts.filter((p) => p.type === "para");
  const herbalProducts = mockProducts.filter((p) => p.type === "herbal");
  const newArrivals = mockProducts.filter((p) => p.isNew).slice(0, 10);
  const bestSellers = mockProducts
    .sort((a, b) => (b.oldPrice || 0) - (a.oldPrice || 0))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <Header />
      <main>
        <HeroSection />
        <FeaturesStrip />
        <CategoriesGrid />

        {/* Parapharmacie Products */}
        <ProductRow
          title="عروض الصيدلية"
          subtitle="أفضل الماركات العالمية للعناية بالبشرة"
          href="/products?category=Parapharmacie"
          products={paraProducts.slice(0, 10)}
          type="para"
          totalProducts={paraProducts.length}
        />

        <Brands />

        {/* Featured Products Tabs */}
        <FeaturedTabs newArrivals={newArrivals} bestSellers={bestSellers} />

        {/* Promotional Banner */}
        <PromoBanner />

        {/* Herbalism Products */}
        <ProductRow
          title="قسم الأعشاب الطبيعية"
          subtitle="عودة إلى الطبيعة مع منتجاتنا العضوية"
          href="/products?category=الأعشاب الطبية"
          products={herbalProducts.slice(0, 10)}
          type="herbal"
          totalProducts={herbalProducts.length}
        />

        <Loyalty />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
