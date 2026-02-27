"use client";

import React, { useState, useEffect } from 'react';
import {
  Search, Filter, SlidersHorizontal, Grid, List, ChevronDown, X,
  ShoppingCart, Heart, Star, MessageCircle, ArrowRight, Shield, Award,
  Truck, Clock, Zap
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/Toast';
import EnhancedProductCard from '@/components/products/EnhancedProductCard';
import { CATEGORIES, getProductsByCategory, getProductsBySubcategory, SAMPLE_PRODUCTS } from '@/lib/categories';
import { Product as UnifiedProduct } from '../../../data/index';

interface ProductsPageProps {
  searchParams?: {
    category?: string;
    search?: string;
    subcategory?: string;
    sort?: string;
    priceRange?: string;
    inStock?: string;
  };
}

export default function ProductsPage({ searchParams = {} }: ProductsPageProps) {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.category || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.subcategory || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.inStock === 'true');
  const [showCompare, setShowCompare] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);

  const { cartItemCount, addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    let filtered = SAMPLE_PRODUCTS;

    // Filter by category
    if (selectedCategory) {
      filtered = getProductsByCategory(selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory) {
      filtered = getProductsBySubcategory(selectedCategory, selectedSubcategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
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
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default: // featured
        filtered.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedSubcategory, searchQuery, priceRange, inStockOnly, sortBy]);

  const handleAddToCart = (product: UnifiedProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      brand: product.brand,
      inStock: product.inStock
    }, 1);

    addToast({
      type: 'success',
      title: 'تمت الإضافة للسلة',
      message: `${product.title} تمت إضافته بنجاح`
    });
  };

  const handleWhatsAppOrder = (product: UnifiedProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const message = `مرحباً، أود طلب المنتج: ${product.title}\nالسعر: ${product.price} درهم\nالرابط: ${window.location.href}/products/${product.id}`;
    const whatsappUrl = `https://wa.me/212600000000?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCompare = (productId: string | number) => {
    const idStr = String(productId);
    if (compareList.includes(idStr)) {
      setCompareList(compareList.filter(id => id !== idStr));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, idStr]);
    } else {
      addToast({
        type: 'warning',
        title: 'الحد الأقصى للمقارنة',
        message: 'يمكنك مقارنة 3 منتجات كحد أقصى'
      });
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 1000 });
    setInStockOnly(false);
    setSortBy('featured');
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    inStockOnly,
    priceRange.min > 0 || priceRange.max < 1000
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Title and Results Count */}
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">المنتجات</h1>
              <span className="text-sm text-gray-500">
                {filteredProducts.length} منتج
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث عن منتجات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>التصفية</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="featured">الأكثر مبيعاً</option>
                  <option value="price-low">الأقل سعراً</option>
                  <option value="price-high">الأعلى سعراً</option>
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="newest">الأحدث</option>
                </select>
                <ChevronDown className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">التصفية المتقدمة</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">جميع الفئات</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.nameAr}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نطاق السعر: {priceRange.min} - {priceRange.max} درهم
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="الحد الأدنى"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="الحد الأقصى"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Stock Filter */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="inStock" className="mr-2 text-sm font-medium text-gray-700">
                  المتوفر فقط
                </label>
              </div>

              {/* Clear Filters */}
              <div>
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  مسح التصفية
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600 mb-4">لم نجد أي منتجات تطابق معايير البحث</p>
            <button
              onClick={clearFilters}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              مسح التصفية
            </button>
          </div>
        ) : (
          <>
            {/* Compare Bar */}
            {compareList.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-emerald-700">
                      {compareList.length} منتج للمقارنة
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCompare(true)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
                    >
                      مقارنة
                    </button>
                    <button
                      onClick={() => setCompareList([])}
                      className="text-emerald-600 hover:text-emerald-700 text-sm"
                    >
                      مسح
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Display */}
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {filteredProducts.map((product) => (
                <div key={product.id} className="relative">
                  {/* Compare Checkbox */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={compareList.includes(String(product.id))}
                      onChange={() => handleCompare(product.id)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </div>

                  {/* Product Card */}
                  <EnhancedProductCard
                    product={product}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/212600000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-110 z-50"
        aria-label="تواصل عبر واتساب"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
