"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, Tables } from '../../lib/supabase-client';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Star, Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';

// بيانات الأعشاب الطبية مع الصور
const medicalHerbsProducts = [
  {
    id: '1',
    name: 'نعناع طازج',
    description: 'نعناع عضوي طازج غني بالزيوت العطرية، مثالي للشاي والعلاج الطبيعي',
    long_description: null,
    price: 25.99,
    rating: 4.8,
    review_count: 156,
    image_url: '/images/medical-herbs/mint-herb.jpg',
    images: ['/images/medical-herbs/mint-herb.jpg'],
    category_id: 'medical-herbs',
    stock_quantity: 50,
    sku: null,
    is_featured: true,
    is_active: true,
    benefits: ['يساعد على الهضم', 'يطرد الانتفاخ', 'يخفف الصداع', 'منعش طبيعي'],
    usage_instructions: 'يمكن استخدامه طازجاً أو مجففاً لإعداد الشاي أو كتوابل للطعام',
    ingredients: 'نعناع طازج 100% عضوي',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'البابونج العلاجي',
    description: 'أزهار البابونج الطبيعية المفيدة للاسترخاء والنوم الجيد',
    long_description: null,
    price: 32.50,
    rating: 4.9,
    review_count: 203,
    image_url: '/images/medical-herbs/camomile-herb.jpg',
    images: ['/images/medical-herbs/camomile-herb.jpg'],
    category_id: 'medical-herbs',
    stock_quantity: 75,
    sku: null,
    is_featured: true,
    is_active: true,
    benefits: ['يساعد على النوم', 'يخفف التوتر', 'مضاد للالتهابات', 'هادئ للأعصاب'],
    usage_instructions: 'ينقع ملعقة صغيرة من الأزهار في ماء ساخن لمدة 5-10 دقائق',
    ingredients: 'أزهار البابونج 100% طبيعية',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'خزامى عطري',
    description: 'زهور الخزامى العطرية ذات الفوائد العلاجية والاسترخائية',
    price: 45.00,
    rating: 4.7,
    review_count: 89,
    image_url: '/images/medical-herbs/lavender-herb.jpg',
    category_id: 'medical-herbs',
    stock_quantity: 60,
    is_featured: true,
    is_active: true,
    benefits: ['يخفف القلق', 'يساعد على النوم', 'طارد للحشرات', 'عطري جميل'],
    usage_instructions: 'يستخدم في الزيوت العطرية أو كأكياس شاي عشبي',
    ingredients: 'زهور الخزامى 100% طبيعية',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'زنجبيل عضوي',
    description: 'زنجبيل طازج عضوي غني بالمواد الفعالة للعلاج الطبيعي',
    price: 28.75,
    rating: 4.6,
    review_count: 142,
    image_url: '/images/medical-herbs/ginger-herb.jpg',
    category_id: 'medical-herbs',
    stock_quantity: 80,
    is_featured: true,
    is_active: true,
    benefits: ['يخفف الغثيان', 'مضاد للالتهابات', 'يحسن الهضم', 'يخفف الآلام'],
    usage_instructions: 'يضاف للطعام أو المشروبات الساخنة كمنشط طبيعي',
    ingredients: 'جذور الزنجبيل 100% عضوية',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'كركم ذهبي',
    description: 'كركم عضوي عالي الجودة غني بالكركمين ومضادات الأكسدة',
    price: 38.90,
    rating: 4.8,
    review_count: 178,
    image_url: '/images/medical-herbs/turmeric-herb.jpg',
    category_id: 'medical-herbs',
    stock_quantity: 45,
    is_featured: true,
    is_active: true,
    benefits: ['مضاد للأكسدة', 'مضاد للالتهابات', 'يحسن المناعة', 'صحي للقلب'],
    usage_instructions: 'يضاف للطعام أو المشروبات الصحية',
    ingredients: 'مسحوق الكركم 100% عضوي',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'إكليل الجبل',
    description: 'إكليل الجبل الطازج المعروف بفوائده العلاجية والعطرية',
    price: 26.50,
    rating: 4.5,
    review_count: 96,
    image_url: '/images/medical-herbs/rosemary-herb.jpg',
    category_id: 'medical-herbs',
    stock_quantity: 55,
    is_featured: true,
    is_active: true,
    benefits: ['يحسن الذاكرة', 'يخفف التوتر', 'طارد للحشرات', 'عطري منعش'],
    usage_instructions: 'يستخدم طازجاً في الطهي أو كتوابل عطرية',
    ingredients: 'أوراق إكليل الجبل 100% طبيعية',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'زعتر بري',
    description: 'زعتر بري عضوي عطري ومفيد للصحة',
    price: 24.50,
    rating: 4.6,
    review_count: 124,
    image_url: '/images/medical-herbs/thyme-herb.jpg',
    category_id: 'medical-herbs',
    stock_quantity: 65,
    is_featured: false,
    is_active: true,
    benefits: ['مضاد للميكروبات', 'يحسن التنفس', 'طارد للحشرات', 'عطري جميل'],
    usage_instructions: 'يستخدم في الطهي أو كشاي عشبي',
    ingredients: 'أوراق الزعتر 100% طبيعية',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'حكيم طبي',
    description: 'حكيم طازج عضوي ذو فوائد علاجية متعددة',
    price: 23.00,
    rating: 4.3,
    review_count: 54,
    image_url: '/images/medical-herbs/sage-herb.jpg',
    category_id: 'medical-herbs',
    stock_quantity: 45,
    is_featured: false,
    is_active: true,
    benefits: ['يحسن الذاكرة', 'يخفف التوتر', 'طارد للحشرات', 'عطري منعش'],
    usage_instructions: 'يستخدم طازجاً في الطهي أو كشاي عشبي',
    ingredients: 'أوراق الحكيم 100% طبيعية',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '9',
    name: 'يانسون طبي',
    description: 'يانسون عضوي عطري ومفيد للاسترخاء والنوم',
    price: 29.00,
    rating: 4.5,
    review_count: 78,
    image_url: '/images/medical-herbs/anise-herb.jpg',
    category_id: 'medical-herbs',
    stock_quantity: 50,
    is_featured: false,
    is_active: true,
    benefits: ['يساعد على النوم', 'يخفف التوتر', 'يحسن الهضم', 'طارد للغازات'],
    usage_instructions: 'ينقع في ماء ساخن لتحضير الشاي العشبي',
    ingredients: 'بذور اليانسون 100% طبيعية',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '10',
    name: 'قرفة طبية',
    description: 'قرفة عضوية عالية الجودة ذات فوائد صحية متعددة',
    price: 31.50,
    rating: 4.8,
    review_count: 145,
    image_url: '/images/medical-herbs/cinnamon-herb.jpg',
    category_id: 'medical-herbs',
    stock_quantity: 70,
    is_featured: false,
    is_active: true,
    benefits: ['تنظم السكر', 'مضاد للأكسدة', 'تخفف الالتهابات', 'تحسن الهضم'],
    usage_instructions: 'تضاف للمشروبات الساخنة أو الحلويات',
    ingredients: 'لحاء القرفة 100% عضوي',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '11',
    name: 'قرنفل طبي',
    description: 'قرنفل عضوي طازج ذو فوائد طبية وعطرية',
    price: 35.00,
    rating: 4.7,
    review_count: 87,
    image_url: '/images/medical-herbs/clove-herb.jpg',
    category_id: 'medical-herbs',
    stock_quantity: 30,
    is_featured: false,
    is_active: true,
    benefits: ['مخدر للألم', 'مضاد للبكتيريا', 'يحسن صحة الفم', 'طارد للحشرات'],
    usage_instructions: 'يستخدم في الطهي أو كعلاج طبيعي',
    ingredients: 'براعم القرنفل 100% طبيعي',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '12',
    name: 'مردقوش طبي',
    description: 'مردقوش طازج عضوي ذو فوائد علاجية متعددة',
    price: 22.00,
    rating: 4.4,
    review_count: 67,
    image_url: '/images/medical-herbs/mint-herb.jpg',
    category_id: 'medical-herbs',
    stock_quantity: 40,
    is_featured: false,
    is_active: true,
    benefits: ['مضاد للبكتيريا', 'يحسن الهضم', 'يخفف السعال', 'غني بمضادات الأكسدة'],
    usage_instructions: 'يضاف للطعام الإيطالي أو كشاي عشبي',
    ingredients: 'أوراق المردقوش 100% عضوية',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Tables['products'][]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // استخدام بيانات الأعشاب الطبية المحلية
    setProducts(medicalHerbsProducts as Tables['products'][]);
    setLoading(false);
  }, []);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              { label: 'الأعشاب الطبية', href: '/products' }
            ]}
          />
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الأعشاب الطبية</h1>
          <p className="text-gray-600">اكتشف مجموعة واسعة من الأعشاب الطبية الطبيعية 100%</p>
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
                  placeholder="ابحث عن عشب طبي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

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
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(p) => {
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
            <p className="text-gray-600">لم يتم العثور على منتجات تطابق بحثك</p>
          </div>
        )}
      </div>
    </div>
  );
}
