"use client";

import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import { useCart } from '../contexts/CartContext';
import { Search, SlidersHorizontal, Grid, List } from 'lucide-react';
import { getParapharmacieImage } from '../data/parapharmacie-images';
import { getHerbalImage } from '../data/herbal-images';
import { Product as UnifiedProduct } from '../data/index';

interface Product extends UnifiedProduct {
  reviews?: number;
}

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
}

export default function ProductList({ 
  products, 
  loading = false, 
  viewMode: initialViewMode = 'grid' 
}: ProductListProps) {
  const { addToCart } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');

  // Function to get product image
  const getProductImage = (product: Product) => {
    if (product.category.includes('Parapharmacie') || product.category.includes('العناية')) {
      const image = getParapharmacieImage(product.id);
      return image?.imageUrl || product.image;
    } else {
      const image = getHerbalImage(product.id);
      return image?.imageUrl || product.image;
    }
  };

  const productsPerPage = viewMode === 'grid' ? 12 : 8;

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    // First, filter out invalid products
    let validProducts = products.filter(product => product && typeof product.name === 'string' && typeof product.category === 'string');

    // Then, filter by search query
    let filtered = validProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [products, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + productsPerPage);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image
    }, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" dir="rtl">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
            <div className="bg-gray-200 h-64"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="ترتيب المنتجات"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="default">الترتيب حسب</option>
            <option value="price-low">السعر: من الأقل للأعلى</option>
            <option value="price-high">السعر: من الأعلى للأقل</option>
            <option value="rating">التقييم الأعلى</option>
            <option value="name">الاسم أ-ي</option>
          </select>
        </div>

        {/* View Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            aria-label="عرض شبكي"
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            aria-label="عرض قائمة"
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          عرض {startIndex + 1}-{Math.min(startIndex + productsPerPage, filteredAndSortedProducts.length)} من {filteredAndSortedProducts.length} منتج
        </p>
      </div>

      {/* Products */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">لم يتم العثور على منتجات</h3>
          <p className="text-gray-600">جرب تغيير كلمات البحث أو الفلاتر</p>
        </div>
      ) : (
        <>
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  title: product.name,
                  originalPrice: product.oldPrice,
                  image: getProductImage(product)
                }}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
