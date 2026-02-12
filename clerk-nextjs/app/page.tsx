"use client";

import React from 'react';
import PremiumNavbar from '../components/PremiumNavbar';
import PremiumHero from '../components/PremiumHero';
import GlobalCustomerReviews from '../components/GlobalCustomerReviews';
import ProductList from '../components/ProductList';
import Brands from '../components/Brands';
import FeaturedTabs from '../components/FeaturedTabs';
import CategoriesGrid from '../components/CategoriesGrid';
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
      <PremiumNavbar />
      
      <main>
        <PremiumHero />
        
        <div className="container-premium py-12">
          <CategoriesGrid />
        </div>

        {/* Parapharmacie Products */}
        <div className="container-premium py-12">
          <h2 className="text-headline text-gradient-primary mb-4">Premium Parapharmacy</h2>
          <p className="text-body text-[var(--color-text-secondary)] mb-8">World's leading skincare and wellness brands</p>
          <ProductList products={paraProducts.slice(0, 8)} />
        </div>

        <Brands />

        {/* Featured Products Tabs */}
        <div className="container-premium py-12">
          <FeaturedTabs />
        </div>

        {/* Herbalism Products */}
        <div className="container-premium py-12">
          <h2 className="text-headline text-gradient-primary mb-4">Natural Herbal Remedies</h2>
          <p className="text-body text-[var(--color-text-secondary)] mb-8">100% natural products for your wellness journey</p>
          <ProductList products={herbalProductsList.slice(0, 8)} />
        </div>

        {/* Global Customer Reviews */}
        <GlobalCustomerReviews />
      </main>
    </div>
  );
}
