"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductList from '../../components/ProductList';
import Categories from '../../components/Categories';
import { products } from '../../products';
import { useCart } from '../../contexts/CartContext';

export default function Products() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState(categoryParam || 'Tous');
  const [sortBy, setSortBy] = useState('default');
  const [visibleProducts, setVisibleProducts] = useState(20);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredProducts = useMemo(() => {
    let filtered = Array.isArray(products) ? [...products] : [];
    if (activeCategory !== 'Tous') {
      filtered = filtered.filter((product) => product.category === activeCategory);
    }
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - a.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return filtered;
  }, [sortBy, activeCategory]);

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">استكشف منتجاتنا</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          مجموعة مختارة من أفضل المنتجات الطبيعية والعضوية للعناية بصحتك وجمالك.
        </p>
      </div>
      <Categories activeCategory={activeCategory} onCategoryClick={setActiveCategory} />
      <div className="mt-8">
        <ProductList
          products={filteredProducts}
          onAddToCart={addToCart}
          sortBy={sortBy}
          setSortBy={setSortBy}
          visibleProducts={visibleProducts}
          loadMore={() => setVisibleProducts((prev) => prev + 10)}
        />
      </div>
    </div>
  );
}
