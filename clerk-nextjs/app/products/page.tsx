"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumbs from '../../components/Breadcrumbs';
import ProductFilters from '../../components/ProductFilters';
import ProductList from '../../components/ProductList';
import { allProducts, Product } from '../../data/index';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getCategoryLabel = (category: string) => {
    const categoryLabels: Record<string, string> = {
      'medical-herbs': 'الأعشاب الطبية',
      'Herbal Medicine': 'الأعشاب الطبية'
    };

    return categoryLabels[category] ?? category;
  };

  const handleFiltersChange = (filters: any) => {
    const categoriesFilter = filters?.category;
    if (Array.isArray(categoriesFilter) && categoriesFilter.length === 1) {
      setSelectedCategory(categoriesFilter[0]);
      return;
    }
    if (!categoriesFilter || (Array.isArray(categoriesFilter) && categoriesFilter.length === 0)) {
      setSelectedCategory('all');
    }
  };

  // Initialize state from URL parameters
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    if (search) {
      setSearchQuery(search);
    }
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Update URL when search or category changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery);
    }
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    
    const newUrl = params.toString() ? `/products?${params.toString()}` : '/products';
    window.history.replaceState(null, '', newUrl);
  }, [searchQuery, selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map(p => p.category))];
    return ['all', ...cats];
  }, []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const searchLower = searchQuery.toLowerCase();
      return (
        product.title.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.brand && product.brand.toLowerCase().includes(searchLower))
      );
    });

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumbs items={[{ label: 'المنتجات' }]} />
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">جميع المنتجات</h1>
              <p className="text-gray-600">اكتشف مجموعتنا الكاملة من المنتجات الطبيعية وشبه الصيدلية</p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-600">{allProducts.length}</div>
                <div className="text-sm text-gray-600">منتج</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {allProducts.filter(p => p.isNew).length}
                </div>
                <div className="text-sm text-gray-600">منتج جديد</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {allProducts.filter(p => p.originalPrice).length}
                </div>
                <div className="text-sm text-gray-600">عروض</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <ProductFilters onFiltersChange={handleFiltersChange} />
          </div>
          <div className="lg:col-span-9 bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن منتج، ماركة، أو وصف..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              aria-label="التصفية حسب الفئة"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'جميع الفئات' : getCategoryLabel(category)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              aria-label="الترتيب حسب"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="default">الترتيب حسب</option>
              <option value="price-low">السعر: من الأقل للأعلى</option>
              <option value="price-high">السعر: من الأعلى للأقل</option>
              <option value="rating">التقييم الأعلى</option>
              <option value="name">الاسم أ-ي</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                aria-label="عرض شبكي"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                aria-label="عرض قائمة"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="container mx-auto px-4 py-4">
        <p className="text-gray-600">
          {searchQuery && (
            <span>نتائج البحث عن &quot;{searchQuery}&quot;: </span>
          )}
          عرض {filteredAndSortedProducts.length} من {allProducts.length} منتج
          {selectedCategory !== 'all' && (
            <span> في فئة &quot;{getCategoryLabel(selectedCategory)}&quot;</span>
          )}
        </p>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 pb-8">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchQuery ? `لم يتم العثور على نتائج لـ "${searchQuery}"` : 'لم يتم العثور على منتجات'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'جرب استخدام كلمات مختلفة أو تصفح جميع المنتجات' 
                : 'جرب تغيير الفلاتر أو تصفح جميع المنتجات'
              }
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                عرض جميع المنتجات
              </button>
            )}
          </div>
        ) : (
          <ProductList products={filteredAndSortedProducts} viewMode={viewMode} />
        )}
      </div>
    </div>
  );
}
