"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase, Tables } from '../lib/supabase-client';
import { Zap, Shield, Leaf, Heart, Star, ShoppingCart, ChevronLeft, Menu, X, Search, User, Truck, Lock, RefreshCw, Award, Clock, TrendingUp, CheckCircle, MessageCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Tables['products'][]>([]);
  const [categories, setCategories] = useState<Tables['categories'][]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [bestSellers, setBestSellers] = useState<Tables['products'][]>([]);
  
  interface Testimonial {
    id: number;
    name: string;
    rating: number;
    comment: string;
    avatar: string;
  }
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, bestSellersRes] = await Promise.all([
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
          supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('rating', { ascending: false })
            .limit(6),
        ]);

        if (productsRes.data) setFeaturedProducts(productsRes.data);
        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (bestSellersRes.data) setBestSellers(bestSellersRes.data);
        
        // Mock testimonials data
        setTestimonials([
          {
            id: 1,
            name: "فاطمة أحمد",
            rating: 5,
            comment: "منتجات ممتازة وجودة عالية. استخدمت زيت الأرغان وكانت النتائج رائعة!",
            avatar: "/images/avatars/avatar1.jpg"
          },
          {
            id: 2,
            name: "محمد العلي",
            rating: 5,
            comment: "خدمة سريعة ومنتجات أصلية 100%. أنصح بالتعامل معهم",
            avatar: "/images/avatars/avatar2.jpg"
          },
          {
            id: 3,
            name: "نورا سعيد",
            rating: 4,
            comment: "الأعشاب الطبية ساعدتني كثيراً في تحسين صحتي. شكراً لكم",
            avatar: "/images/avatars/avatar3.jpg"
          },
          {
            id: 4,
            name: "عبدالله خالد",
            rating: 5,
            comment: "أسعار مناسبة وجودة ممتازة. سأستمر في الشراء من هذا المتجر",
            avatar: "/images/avatars/avatar4.jpg"
          }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, [mounted]);

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
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                  width={48}
                                  height={48}
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

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm font-bold flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            عرض خاص: خصم 20% على جميع المنتجات هذا الأسبوع فقط!
            <span className="bg-white text-red-600 px-2 py-1 rounded text-xs font-bold">محدود الوقت</span>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0">
          <Image
            src="/images/backgrounds/hero-bg.jpg"
            alt="خلفية الأعشاب الطبية"
            className="w-full h-full object-cover"
            layout="fill"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-emerald-900/80"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-white font-bold">4.8/5</span>
                  <span className="text-green-200">(2,156 تقييم)</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  أعشاب طبية
                  <span className="block text-green-300">طبيعية 100%</span>
                </h1>
              </div>
              <p className="text-lg text-green-100 mb-8 leading-relaxed">
                نقدم أفضل أنواع الأعشاب الطبية الطبيعية من مصادر موثوقة لضمان صحتك وسعادتك
              </p>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <Lock className="w-6 h-6 mx-auto mb-1 text-green-300" />
                  <p className="text-xs text-white">دفع آمن</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <Truck className="w-6 h-6 mx-auto mb-1 text-green-300" />
                  <p className="text-xs text-white">توصيل سريع</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <RefreshCw className="w-6 h-6 mx-auto mb-1 text-green-300" />
                  <p className="text-xs text-white">ضمان استرجاع</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
                >
                  <ShoppingCart size={20} />
                  تسوق الآن
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-green-600 transition-all"
                >
                  <Leaf size={20} />
                  المزيد
                </Link>
              </div>
            </div>
            
            {/* Featured Product in Hero */}
            <div className="relative">
              {bestSellers.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="absolute -top-3 -right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    الأكثر مبيعاً
                  </div>
                  <div className="relative">
                    <Image
                      src={bestSellers[0].image_url}
                      alt={bestSellers[0].name}
                      width={400}
                      height={400}
                      className="w-full h-80 object-cover rounded-xl mb-4"
                    />
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {bestSellers[0].stock_quantity < 10 ? `متبقي ${bestSellers[0].stock_quantity} فقط` : 'متوفر'}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{bestSellers[0].name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-green-200">{bestSellers[0].rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">{bestSellers[0].price} درهم</span>
                      <span className="text-green-200 line-through text-sm mr-2">{Math.round(bestSellers[0].price * 1.2)} درهم</span>
                    </div>
                    <Link
                      href={`/products/${bestSellers[0].id}`}
                      className="bg-white text-green-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-all"
                    >
                      اطلب الآن
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">الأكثر مبيعاً</h2>
            </div>
            <p className="text-gray-600 text-lg">المنتجات التي يفضلها عملاؤنا</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.slice(0, 6).map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="relative">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                    الأكثر مبيعاً
                  </div>
                  {product.stock_quantity < 10 && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                      متبقي {product.stock_quantity} فقط
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{product.rating}</span>
                    <span className="text-sm text-gray-500">({Math.floor(Math.random() * 200) + 50} تقييم)</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xl font-bold text-green-600">{product.price} درهم</span>
                      <span className="text-gray-400 line-through text-sm mr-2">{Math.round(product.price * 1.2)} درهم</span>
                    </div>
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    أضف للسلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">آراء العملاء</h2>
            </div>
            <p className="text-gray-600 text-lg">ماذا يقول عملاؤنا عنا</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ml-3"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">&ldquo;{testimonial.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Award className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">دليل الصحة</h2>
            </div>
            <p className="text-gray-600 text-lg">مقالات وإرشادات حول الأعشاب الطبية والصحة الطبيعية</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <Image
                src="/images/blog/herbs-guide.jpg"
                alt="دليل الأعشاب"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">فوائد الأعشاب الطبية</h3>
                <p className="text-gray-600 mb-4">اكتشف الفوائد الصحية للأعشاب الطبية وكيفية استخدامها بشكل آمن وفعال</p>
                <Link href="/blog/herbs-benefits" className="text-green-600 font-bold hover:text-green-700 transition-colors">
                  اقرأ المزيد →
                </Link>
              </div>
            </article>
            
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <Image
                src="/images/blog/natural-remedies.jpg"
                alt="علاجات طبيعية"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">علاجات طبيعية للمناعة</h3>
                <p className="text-gray-600 mb-4">أفضل الأعشاب لتعزيز جهاز المناعة وحماية الجسم من الأمراض</p>
                <Link href="/blog/immunity-herbs" className="text-green-600 font-bold hover:text-green-700 transition-colors">
                  اقرأ المزيد →
                </Link>
              </div>
            </article>
            
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <Image
                src="/images/blog/herbal-tea.jpg"
                alt="شاي الأعشاب"
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">فن تحضير شاي الأعشاب</h3>
                <p className="text-gray-600 mb-4">طرق مثالية لتحضير شاي الأعشاب للحصول على أقصى فائدة صحية</p>
                <Link href="/blog/herbal-tea-guide" className="text-green-600 font-bold hover:text-green-700 transition-colors">
                  اقرأ المزيد →
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Trust & Certification Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">ضمان الجودة والثقة</h2>
            </div>
            <p className="text-gray-600 text-lg">نلتزم بأعلى معايير الجودة والسلامة</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">منتجات عضوية معتمدة</h3>
              <p className="text-gray-600 text-sm">جميع منتجاتنا حاصلة على شهادات الجودة العضوية</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">دفع آمن ومشفر</h3>
              <p className="text-gray-600 text-sm">نستخدم أحدث تقنيات التشفير لحماية بياناتك</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">شحن سريع ومضمون</h3>
              <p className="text-gray-600 text-sm">توصيل لكل أنحاء المملكة خلال 24-48 ساعة</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">ضمان استرجاع 100%</h3>
              <p className="text-gray-600 text-sm">استرجاع كامل المبلغ خلال 30 يوم في حال عدم الرضا</p>
            </div>
          </div>
          
          {/* Payment Icons */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">نقبل جميع وسائل الدفع الآمنة</p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs font-bold">VISA</span>
              </div>
              <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs font-bold">MC</span>
              </div>
              <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs font-bold">MADA</span>
              </div>
              <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs font-bold">STC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href="https://wa.me/966500000000"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all transform hover:scale-110"
          aria-label="تواصل معنا عبر واتساب"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>

      {/* Free Shipping Banner */}
      <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-40">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4" />
          <span className="text-sm font-bold">شحن مجاني للطلبات فوق 200 درهم</span>
        </div>
      </div>

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
                  <Image
                    src={category.image_url || 'https://images.pexels.com/photos/3962642/pexels-photo-3962642.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    layout="fill"
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
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
                required
              />
              <button
                type="submit"
                className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                اشترك الآن
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
              <h3 className="text-xl font-bold mb-4">BioPara</h3>
              <p className="text-gray-400">أفضل الأعشاب الطبية الطبيعية لصحتك وسعادتك</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
              <ul className="space-y-2">
                <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">المنتجات</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">من نحن</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">الدعم</h4>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">الخصوصية</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">الشروط</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">تواصل معنا</h4>
              <div className="space-y-2">
                <p className="text-gray-400">info@biopara.com</p>
                <p className="text-gray-400">+966 50 000 000</p>
                <div className="flex gap-2 mt-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 BioPara. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}