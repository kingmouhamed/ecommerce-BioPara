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
  const searchParam = searchParams.get('search');
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
    
    // Validate products have required fields
    filtered = filtered.filter(product => 
      product && 
      typeof product.id === 'number' && 
      typeof product.name === 'string' && 
      typeof product.price === 'number' &&
      typeof product.category === 'string'
    );
    
    // Filter by search term
    if (searchParam) {
      filtered = filtered.filter((product) => 
        product.name.toLowerCase().includes(searchParam.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchParam.toLowerCase()))
      );
    }
    
    // Filter by category
    if (activeCategory !== 'Tous') {
      filtered = filtered.filter((product) => product.category === activeCategory);
    }
    
    // Sort products
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    return filtered;
  }, [sortBy, activeCategory, searchParam]);

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
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد منتجات متاحة</h3>
            <p className="text-gray-500">لم يتم العثور على منتجات تطابق معايير البحث الخاصة بك. حاول تعديل الفلاتر أو البحث.</p>
          </div>
        ) : (
          <ProductList
            products={filteredProducts}
            onAddToCart={addToCart}
            sortBy={sortBy}
            setSortBy={setSortBy}
            visibleProducts={visibleProducts}
            loadMore={() => setVisibleProducts((prev) => prev + 10)}
          />
        )}
      </div>
    </div>
  );
}
