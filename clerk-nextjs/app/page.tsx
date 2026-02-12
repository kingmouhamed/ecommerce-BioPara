"use client";

import React from 'react';
import Navbar from '../components/Navbar-Unified';
import Hero from '../components/Hero-Unified';
import CustomerReviews from '../components/CustomerReviews-Fixed';
import ProductList from '../components/ProductList';
import Brands from '../components/Brands';
import FeaturedTabs from '../components/FeaturedTabs';
import CategoriesGrid from '../components/CategoriesGrid';
import Footer from '../components/Footer-Unified';
import Cart from '../components/Cart';
import WhatsAppWidget from '../components/WhatsAppWidget';
import LiveChatSupport from '../components/LiveChatSupport';
import { allProducts, parapharmacieProducts, herbalProducts } from '../data/index';

export default function HomePage() {
  // Filter products for different sections
  const paraProducts = parapharmacieProducts;
  const herbalProductsList = herbalProducts;
  const newArrivals = allProducts.filter((p) => p && p.isNew).slice(0, 10);
  const bestSellers = allProducts
    .filter((p) => p)
    .sort((a, b) => (b.oldPrice || 0) - (a.oldPrice || 0))
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans" dir="rtl">
      <Navbar locale="ar" variant="premium" />
      
      <main>
        <Hero locale="ar" variant="premium" />
        
        <div className="container-premium py-12">
          <CategoriesGrid />
        </div>

        {/* Parapharmacie Products */}
        <div className="container-premium py-12">
          <h2 className="text-headline text-gradient-primary mb-4 text-right">الصيدلية الفاخرة</h2>
          <p className="text-body text-[var(--color-text-secondary)] mb-8 text-right">أفضل العلامات التجارية للعناية بالبشرة والعافية في العالم</p>
          <ProductList products={paraProducts.slice(0, 8)} />
        </div>

        <Brands />

        {/* Featured Products Tabs */}
        <div className="container-premium py-12">
          <FeaturedTabs />
        </div>

        {/* Herbalism Products */}
        <div className="container-premium py-12">
          <h2 className="text-headline text-gradient-primary mb-4 text-right">العلاجات العشبية الطبيعية</h2>
          <p className="text-body text-[var(--color-text-secondary)] mb-8 text-right">منتجات 100% طبيعية لرحلتك نحو العافية</p>
          <ProductList products={herbalProductsList.slice(0, 8)} />
        </div>

        {/* Global Customer Reviews */}
        <CustomerReviews locale="ar" />
      </main>
      
      <Footer locale="ar" variant="global" />
      <Cart />
      <WhatsAppWidget />
      <LiveChatSupport />
    </div>
  );
}
