"use client";

import React from 'react';
import MasterComponent from '../components/MasterComponent';
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
      <MasterComponent locale="ar" variant="global" />
    </div>
  );
}
