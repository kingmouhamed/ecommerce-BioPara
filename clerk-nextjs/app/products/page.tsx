"use client";

import { useState, useEffect } from 'react';
import { supabase, Tables } from '../../lib/supabase-client';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Star, Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Tables['products'][]>([]);
  const [categories, setCategories] = useState<Tables['categories'][]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        } else {
          setCategories(categoriesData || []);
        }

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (productsError) {
          console.error('Error fetching products:', productsError);
        } else {
          setProducts(productsData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price_low':
        return a.price - b.price;
      case 'price_high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[
              { label: 'الرئيسية', href: '/' },
              { label: 'المنتجات', href: '/products' }
            ]}
          />
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">جميع المنتجات</h1>
          <p className="text-gray-600">اكتشف مجموعة واسعة من الأعشاب الطبية الطبيعية</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="name">ترتيب حسب الاسم</option>
              <option value="price_low">السعر: من الأقل إلى الأعلى</option>
              <option value="price_high">السعر: من الأعلى إلى الأقل</option>
              <option value="rating">التقييم</option>
              <option value="newest">الأحدث أولاً</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
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

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {sortedProducts.length} منتج{sortedProducts.length !== 1 ? 'ات' : ''}
          </p>
        </div>

        {/* Products Grid/List */}
        {sortedProducts.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {sortedProducts.map((product) => {
              const category = categories.find(c => c.id === product.category_id);
              return (
                <ProductCard
                  key={product.id}
                  product={{
                    id: parseInt(product.id),
                    title: product.name,
                    price: product.price,
                    rating: product.rating,
                    image: product.image_url,
                    category: category?.name || 'غير محدد',
                    badge: product.rating >= 4.5 ? 'مميز' : undefined
                  }}
                  onAddToCart={(p) => {
                    // Will implement cart functionality
                    console.log('Added to cart:', p);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600">لم يتم العثور على منتجات تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );
}
