
"use client";

import React from "react";
import { useCart } from "../contexts/CartContext";
import { mockProducts } from "../data/products";
import type { Product } from "../data/products";

// Import main components
import Navbar, { MobileMenu } from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturesStrip from "../components/FeaturesStrip";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";

// Import additional components
import CategoriesGrid from "../components/CategoriesGrid";
import Brands from "../components/Brands";
import FeaturedTabs from "../components/FeaturedTabs";
import PromoBanner from "../components/PromoBanner";
import Loyalty from "../components/Loyalty";
import Newsletter from "../components/Newsletter";
import WhatsAppWidget from "../components/WhatsAppWidget";

export default function HomePage() {
  const { addToCart, cartItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Filter products for different sections
  const paraProducts = mockProducts.filter((p) => p.type === "para");
  const herbalProducts = mockProducts.filter((p) => p.type === "herbal");
  const newArrivals = mockProducts.filter((p) => p.isNew).slice(0, 10);
  const bestSellers = mockProducts
    .sort((a, b) => (b.oldPrice || 0) - (a.oldPrice || 0))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} cartItemCount={cartItemCount} />
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main>
        <Hero />
        <FeaturesStrip />
        <CategoriesGrid />

        {/* Parapharmacie Products */}
        <ProductList
          title="الأكثر مبيعاً في شبه الصيدلية"
          subtitle="أفضل الماركات العالمية للعناية بالبشرة"
          products={paraProducts.slice(0, 8)}
          addToCart={addToCart}
          viewAllLink="/products?category=Parapharmacie"
          type="para"
        />

        <Brands />

        {/* Featured Products Tabs */}
        <FeaturedTabs newArrivals={newArrivals} bestSellers={bestSellers} />

        {/* Promotional Banner */}
        <PromoBanner />

        {/* Herbalism Products */}
        <ProductList
          title="الأكثر مبيعاً في الأعشاب الطبية"
          subtitle="منتجات طبيعية 100% للعناية بصحتك"
          products={herbalProducts.slice(0, 8)}
          addToCart={addToCart}
          viewAllLink="/products?category=الأعشاب الطبية"
          type="herbal"
        />

        <Loyalty />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}
