"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, Tables } from '../lib/supabase-client';
import { Zap, Shield, Leaf, Heart, Star, ShoppingCart, ChevronLeft, Menu, X, Search, User } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Tables['products'][]>([]);
  const [categories, setCategories] = useState<Tables['categories'][]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .eq('is_featured', true)
            .limit(8),
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

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
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

  const stats = [
    { number: '15+', label: 'سنة خبرة' },
    { number: '500+', label: 'منتج طبي' },
    { number: '10K+', label: 'عميل راض' },
    { number: '24/7', label: 'دعم فني' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const filteredProducts = featuredProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-white font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <Leaf className="w-8 h-8" />
              BioPara
            </Link>
            
            <nav className="hidden md:flex items-center space-x-reverse space-x-8">
              <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">الرئيسية</Link>
              <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors">المنتجات</Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">من نحن</Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">اتصل بنا</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-reverse space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                  aria-label="بحث عن المنتجات"
                >
                  <Search className="w-5 h-5" />
                </button>
                
                {searchOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث عن منتج..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        بحث
                      </button>
                    </form>
                    
                    {searchQuery && (
                      <div className="mt-3 max-h-64 overflow-y-auto">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.id}`}
                              className="block p-3 hover:bg-gray-50 border-b border-gray-100"
                              onClick={() => {
                                setSearchOpen(false);
                                setSearchQuery('');
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                                  <p className="text-sm text-gray-600">{product.price} درهم</p>
                                </div>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">لا توجد نتائج</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link href="/auth/login" className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                <User className="w-5 h-5" />
              </Link>

              <Link href="/cart" className="p-2 text-gray-600 hover:text-green-600 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">الرئيسية</Link>
                <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors">المنتجات</Link>
                <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">من نحن</Link>
                <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors">اتصل بنا</Link>
                <Link href="/cart" className="text-gray-700 hover:text-green-600 transition-colors">سلة التسوق</Link>
                <Link href="/auth/login" className="text-gray-700 hover:text-green-600 transition-colors">تسجيل الدخول</Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0">
          <img
            src="/images/backgrounds/hero-bg.jpg"
            alt="خلفية الأعشاب الطبية"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-emerald-900/80"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                أعشاب طبية
                <span className="block text-green-300">طبيعية 100%</span>
              </h1>
              <p className="text-lg text-green-100 mb-8 leading-relaxed">
                نقدم أفضل أنواع الأعشاب الطبية الطبيعية من مصادر موثوقة لضمان صحتك وسعادتك
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
                >
                  تسوق الآن
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-green-900 transition-colors"
                >
                  معرفة المزيد
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-3 gap-2">
                <img src="/images/medical-herbs/mint-herb.jpg" alt="نعناع" className="w-full h-24 object-cover rounded-lg shadow-lg" />
                <img src="/images/medical-herbs/camomile-herb.jpg" alt="البابونج" className="w-full h-24 object-cover rounded-lg shadow-lg" />
                <img src="/images/medical-herbs/lavender-herb.jpg" alt="خزامى" className="w-full h-24 object-cover rounded-lg shadow-lg" />
                <img src="/images/medical-herbs/ginger-herb.jpg" alt="زنجبيل" className="w-full h-24 object-cover rounded-lg shadow-lg" />
                <img src="/images/medical-herbs/turmeric-herb.jpg" alt="كركم" className="w-full h-24 object-cover rounded-lg shadow-lg" />
                <img src="/images/medical-herbs/rosemary-herb.jpg" alt="إكليل الجبل" className="w-full h-24 object-cover rounded-lg shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">منتجاتنا المميزة</h2>
            <p className="text-gray-600 text-lg">اكتشف أفضل الأعشاب الطبية التي اخترناها لك</p>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(p) => {
                      console.log('Added to cart:', p);
                    }}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  عرض كل المنتجات
                  <ChevronLeft className="w-5 h-5" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">لماذا تختار BioPara؟</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              نقدم لكم أفضل جودة وأسعار تنافسية في الأعشاب الطبية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 transition-colors">
                    <Icon className="w-10 h-10 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">الفئات</h2>
            <p className="text-gray-600">استكشف جميع فئات الأعشاب الطبية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={category.image_url || 'https://images.pexels.com/photos/3962642/pexels-photo-3962642.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <div>
                      <h3 className="text-white font-bold text-xl">{category.name}</h3>
                      <p className="text-gray-200 text-sm">{category.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">اشترك في نشرتنا الإخبارية</h2>
            <p className="text-green-100 mb-8">احصل على أحدث العروض والمنتجات الجديدة</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('شكراً لاشتراكك في نشرتنا الإخبارية!');
              }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                اشتراك
              </button>
            </form>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Leaf className="w-6 h-6" />
                BioPara
              </h3>
              <p className="text-gray-400 text-sm">متخصصون في الأعشاب الطبية الطبيعية</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/products" className="hover:text-white transition-colors">المنتجات</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">من نحن</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">اتصل بنا</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">خدماتنا</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/shipping" className="hover:text-white transition-colors">الشحن</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">الإرجاع</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>+212 673020264</li>
                <li>info@biopara.ma</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} BioPara. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
