"use client";

import { useState, useEffect } from 'react';
import { supabase, Tables } from '../../../lib/supabase-client';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Star, Filter, Grid, List } from 'lucide-react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<Tables['categories'] | null>(null);
  const [products, setProducts] = useState<Tables['products'][]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Fetch category
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', params.slug)
          .single();

        if (categoryError) {
          console.error('Error fetching category:', categoryError);
          return;
        }

        setCategory(categoryData);

        // Fetch products for this category
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryData.id)
          .eq('is_active', true)
          .order(sortBy === 'name' ? 'name' : sortBy === 'price_low' ? 'price' : 'created_at', {
            ascending: sortBy === 'name' || sortBy === 'price_low'
          });

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

    fetchCategoryData();
  }, [params.slug, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">الفئة غير موجودة</h1>
          <p className="text-gray-600">الفئة التي تبحث عنها غير موجودة</p>
        </div>
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
              { label: category.name, href: `/category/${category.slug}` }
            ]}
          />
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
              <p className="text-gray-600">{category.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="عرض شبكي"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'
                }`}
                aria-label="عرض قائمة"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-8">
        {/* Sort Options */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            {products.length} منتج في هذه الفئة
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="ترتيب المنتجات"
          >
            <option value="name">ترتيب حسب الاسم</option>
            <option value="price_low">السعر: من الأقل إلى الأعلى</option>
            <option value="price_high">السعر: من الأعلى إلى الأقل</option>
            <option value="newest">الأحدث أولاً</option>
          </select>
        </div>

        {/* Products Grid/List */}
        {products.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => {
                  // Will implement cart functionality
                  console.log('Added to cart:', p);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-600">لا توجد منتجات في هذه الفئة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
}
