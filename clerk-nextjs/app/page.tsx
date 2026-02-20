'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { supabase, Tables } from '../lib/supabase-client';
import { Zap, Shield, Leaf, Heart } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Tables['products'][]>([]);
  const [categories, setCategories] = useState<Tables['categories'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('is_featured', true)
            .limit(6),
          supabase
            .from('categories')
            .select('*')
            .limit(6),
        ]);

        if (productsRes.data) setFeaturedProducts(productsRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: Leaf,
      title: 'منتجات طبيعية 100%',
      description: 'أعشاب وزيوت طبيعية نقية من أفضل المصادر',
    },
    {
      icon: Shield,
      title: 'ضمان الجودة',
      description: 'كل منتج خاضع للفحص والمراقبة الدقيقة',
    },
    {
      icon: Zap,
      title: 'توصيل سريع',
      description: 'توصيل لكل أنحاء المملكة خلال 24-48 ساعة',
    },
    {
      icon: Heart,
      title: 'دعم العملاء',
      description: 'فريق متخصص جاهز لمساعدتك 24/7',
    },
  ];

  return (
    <>
      <HeroSection 
        title="صيدليتك الطبيعية"
        subtitle="أعشاب ومنتجات عضوية عالية الجودة لحياة صحية."
      />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا تختار BioParaa</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              نحن نقدم لك أفضل جودة من الأعشاب الطبية الطبيعية مع ضمان الأصالة والفعالية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Icon size={32} className="text-primary-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">المنتجات المميزة</h2>
            <p className="text-gray-600">اختر من أفضل الأعشاب الطبية المختارة بعناية</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
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
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">الفئات</h2>
            <p className="text-gray-600">استكشف جميع فئات الأعشاب الطبية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.slug}`}
                className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <Image
                    src={category.image_url || 'https://images.pexels.com/photos/3962642/pexels-photo-3962642.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div>
                      <h3 className="text-white font-bold text-xl">{category.name}</h3>
                      <p className="text-gray-200 text-sm">{category.description}</p>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-4xl font-bold">ابدأ رحلتك نحو صحة أفضل</h2>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            اكتشف مجموعة واسعة من الأعشاب الطبية الطبيعية التي تساهم في تحسين صحتك وعافيتك
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all"
          >
            استكشف المنتجات الآن
          </a>
        </div>
      </section>
    </>
  );
}
