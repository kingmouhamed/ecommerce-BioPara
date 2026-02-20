'use client';

import { useEffect, useState } from 'react';
import { supabase, Tables } from '@/lib/supabase-client';

export default function CategoryPage() {
  const [categories, setCategories] = useState<Tables['categories'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase.from('categories').select('*');
        if (data) setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">جميع الفئات</h1>
          <p className="text-xl text-gray-600">
            استكشف جميع فئات الأعشاب الطبية والمنتجات الصحية
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                  <div className="relative h-56 overflow-hidden bg-gray-200">
                    <img
                      src={category.image_url || 'https://images.pexels.com/photos/3962642/pexels-photo-3962642.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                  <div className="px-6 pb-6">
                    <button className="w-full py-2 bg-primary-500 text-white rounded-lg font-bold hover:bg-primary-600 transition-all">
                      عرض المنتجات
                    </button>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
