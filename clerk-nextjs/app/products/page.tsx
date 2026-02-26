"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Grid, List, ChevronDown, X } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../components/ui/Toast';
import ProductCard from '../../components/ProductCard';
import { CATEGORIES, getProductsByCategory, getProductsBySubcategory, SAMPLE_PRODUCTS } from '../../lib/categories';
import { Product as UnifiedProduct } from '../../data/index';

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

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tags && product.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
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
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.title.localeCompare(b.title);
        case 'newest':
          return 0; // Would need date field
        default: // featured
          return (b.rating - a.rating);
      }
    });

    setFilteredProducts(sorted);
  }, [selectedCategory, selectedSubcategory, searchQuery, priceRange, inStockOnly, sortBy]);

  const handleAddToCart = (product: UnifiedProduct) => {
    // Convert UnifiedProduct to CartItem format
    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
      brand: product.brand,
      inStock: product.inStock
    };
    addToCart(cartItem, 1);
    addToast({
      type: 'success',
      title: 'تمت الإضافة للسلة',
      message: `${product.title} تمت إضافته بنجاح إلى سلة التسوق`
    });
  };

  const handleFilterChange = (type: string, value: any) => {
    switch (type) {
      case 'category':
        setSelectedCategory(value);
        setSelectedSubcategory('');
        break;
      case 'subcategory':
        setSelectedSubcategory(value);
        break;
      case 'sort':
        setSortBy(value);
        break;
      case 'priceRange':
        setPriceRange(value);
        break;
      case 'inStock':
        setInStockOnly(value);
        break;
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

  const currentCategory = CATEGORIES.find(cat => cat.slug === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {currentCategory ? currentCategory.nameAr : 'جميع المنتجات'}
            </h1>

            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} منتج
              </span>

              {/* View Toggle */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-emerald-600"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>فلترة وترتيب</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                {showFilters && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 space-y-4">
                      {/* Category Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الفئة</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="">جميع الفئات</option>
                          {CATEGORIES.map((category) => (
                            <option key={category.slug} value={category.slug}>
                              {category.nameAr}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subcategory Filter */}
                      {currentCategory && currentCategory.subcategories && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">النوع</label>
                          <select
                            value={selectedSubcategory}
                            onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                          >
                            <option value="">جميع الأنواع</option>
                            {currentCategory.subcategories.map((subcategory) => (
                              <option key={subcategory.slug} value={subcategory.slug}>
                                {subcategory.nameAr}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Sort Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الترتيب حسب</label>
                        <select
                          value={sortBy}
                          onChange={(e) => handleFilterChange('sort', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="featured">المميز</option>
                          <option value="price-low">السعر: الأقل للأعلى</option>
                          <option value="price-high">السعر: الأعلى للأقل</option>
                          <option value="rating">التقييم</option>
                          <option value="name">الاسم</option>
                          <option value="newest">الأحدث</option>
                        </select>
                      </div>

                      {/* Price Range Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نطاق السعر</label>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <input
                            type="number"
                            placeholder="الحد الأدنى"
                            value={priceRange.min}
                            onChange={(e) => handleFilterChange('priceRange', { ...priceRange, min: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="number"
                            placeholder="الحد الأقصى"
                            value={priceRange.max}
                            onChange={(e) => handleFilterChange('priceRange', { ...priceRange, max: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Stock Filter */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="inStock"
                          checked={inStockOnly}
                          onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                          className="ml-2"
                        />
                        <label htmlFor="inStock" className="text-sm text-gray-700">
                          المتوفر فقط
                        </label>
                      </div>

                      {/* Clear Filters */}
                      <button
                        onClick={clearFilters}
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        مسح الفلاتر
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 border-t-transparent"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لم يتم العثور على منتجات</h3>
            <p className="text-gray-600 mb-4">
              حاول تعديل معايير البحث أو تصفح جميع المنتجات
            </p>
            <button
              onClick={clearFilters}
              className="bg-emerald-600 text-white py-2 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              عرض جميع المنتجات
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {filteredProducts.map((product) => {
              // Convert to UnifiedProduct format for ProductCard
              const unifiedProduct: UnifiedProduct = {
                id: typeof product.id === 'number' ? product.id : parseInt(product.id),
                title: product.title,
                name: product.title, // Add name property
                price: product.price,
                originalPrice: product.originalPrice,
                rating: product.rating,
                image: product.image,
                category: product.category,
                badge: product.badge,
                type: 'herbal', // Add type property
                description: product.description,
                inStock: product.inStock,
                reviews: product.reviewCount
              };

              return (
                <ProductCard
                  key={product.id}
                  product={unifiedProduct}
                  onAddToCart={handleAddToCart}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
