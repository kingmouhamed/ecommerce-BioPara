"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Zap, Shield, Leaf, Heart, Star, ShoppingCart, ChevronLeft, Menu, X, Search, User, 
  Truck, Lock, RefreshCw, Award, Clock, TrendingUp, CheckCircle, MessageCircle, 
  Instagram, Facebook, Twitter, Mail, Phone, MapPin, ArrowLeft, ArrowRight,
  ChevronRight, Eye, Heart as HeartIcon, Plus, Minus
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  old_price?: number;
  image_url: string;
  rating: number;
  review_count: number;
  stock_quantity: number;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new?: boolean;
  category_id?: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url: string;
}

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
}

interface BlogArticle {
  id: number;
  title: string;
  description: string;
  image_url: string;
  slug: string;
  date: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "فاطمة أحمد",
      rating: 5,
      comment: "منتجات ممتازة وجودة عالية. استخدمت زيت الأرغان وكانت النتائج مذهلة! أنصح الجميع بالتعامل معكم.",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      id: 2,
      name: "محمد العلي",
      rating: 5,
      comment: "خدمة توصيل سريعة ومنتجات أصلية 100%. سعر مناسب وجودة عالية. سأعود للشراء مراراً.",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      id: 3,
      name: "نورة سعيد",
      rating: 5,
      comment: "الأعشاب الطبية ساعدتني كثيراً في تحسين صحتي. شكراً لفريق BioPara على التوجيه والخدمة المميزة.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      id: 4,
      name: "عبدالله خالد",
      rating: 5,
      comment: "تجربة تسوق ممتازة. المنتجات طبيعية وآمنة. أنصح الجميع بتجربة مكملات BioPara.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      id: 5,
      name: "أميرة عمر",
      rating: 4,
      comment: "منتجات عالية الجودة وخدمة عملاء ممتازة. الشحن كان سريعاً والعبوة كانت محكمة.",
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
  ];

  const blogArticles: BlogArticle[] = [
    {
      id: 1,
      title: "فوائد الأعشاب الطبية للصحة",
      description: "اكتشف أسرار الأعشاب الطبية وفوائدها المذهلة للصحة والحياة.",
      image_url: "https://images.pexels.com/photos/3962642/pexels-photo-3962642.jpeg?auto=compress&cs=tinysrgb&w=600",
      slug: "herbs-benefits",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "كيف تقوي مناعتك طبيعيا",
      description: "أفضل الطرق الطبيعية لتعزيز جهاز المناعة وحماية الجسم.",
      image_url: "https://images.pexels.com/photos/40815/immunology-blood-lymphocyte-40815.jpeg?auto=compress&cs=tinysrgb&w=600",
      slug: "boost-immunity",
      date: "2024-01-10"
    },
    {
      id: 3,
      title: "فن تحضير شاي الأعشاب",
      description: "طرق مثالية لتحضير شاي الأعشاب للحصول على أقصى فائدة.",
      image_url: "https://images.pexels.com/photos/1793388/pexels-photo-1793388.jpeg?auto=compress&cs=tinysrgb&w=600",
      slug: "herbal-tea",
      date: "2024-01-05"
    }
  ];

  const socialImages = [
    "https://images.pexels.com/photos/4113834/pexels-photo-4113834.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/5061428/pexels-photo-5061428.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/4029935/pexels-photo-4029935.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/3764645/pexels-photo-3764645.jpeg?auto=compress&cs=tinysrgb&w=400"
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Testimonial auto-scroll
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for demonstration
        const mockProducts: Product[] = [
          {
            id: 1,
            name: "زيت الأرgano العضوي",
            description: "زيت طبيعي 100% للوجه والشعر",
            price: 189,
            old_price: 249,
            image_url: "https://images.pexels.com/photos/159581/pexels-photo-159581.jpeg?auto=compress&cs=tinysrgb&w=400",
            rating: 4.9,
            review_count: 256,
            stock_quantity: 15,
            is_bestseller: true,
            is_featured: true
          },
          {
            id: 2,
            name: "شاي الزنجبيل الأخضر",
            description: "مزيج فريد من الأعشاب الطبيعية",
            price: 79,
            old_price: 99,
            image_url: "https://images.pexels.com/photos/1793388/pexels-photo-1793388.jpeg?auto=compress&cs=tinysrgb&w=400",
            rating: 4.8,
            review_count: 189,
            stock_quantity: 25,
            is_new: true
          },
          {
            id: 3,
            name: "مستخلص البابونج",
            description: "للتخلص من الأرق والقلق",
            price: 129,
            image_url: "https://images.pexels.com/photos/4113834/pexels-photo-4113834.jpeg?auto=compress&cs=tinysrgb&w=400",
            rating: 4.7,
            review_count: 145,
            stock_quantity: 8,
            is_bestseller: true
          },
          {
            id: 4,
            name: "زيت اللافندر الأساسي",
            description: "للاسترخاء والتأمل",
            price: 99,
            old_price: 149,
            image_url: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400",
            rating: 4.9,
            review_count: 312,
            stock_quantity: 30,
            is_featured: true
          },
          {
            id: 5,
            name: "خلاصة الكركم",
            description: "مضاد طبيعي للالتهابات",
            price: 159,
            old_price: 199,
            image_url: "https://images.pexels.com/photos/4769140/pexels-photo-4769140.jpeg?auto=compress&cs=tinysrgb&w=400",
            rating: 4.8,
            review_count: 198,
            stock_quantity: 5,
            is_bestseller: true,
            is_new: true
          },
          {
            id: 6,
            name: "شاي الأعشاب المتعددة",
            description: "خليط الأعشاب السبعة",
            price: 89,
            image_url: "https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=400",
            rating: 4.6,
            review_count: 87,
            stock_quantity: 20,
            is_new: true
          },
          {
            id: 7,
            name: "زيت النعناع",
            description: "منعش ومفتح للجهاز التنفسي",
            price: 69,
            old_price: 89,
            image_url: "https://images.pexels.com/photos/4029935/pexels-photo-4029935.jpeg?auto=compress&cs=tinysrgb&w=400",
            rating: 4.7,
            review_count: 156,
            stock_quantity: 35,
            is_featured: true
          },
          {
            id: 8,
            name: "مستخلص إشنسا",
            description: "لتقوية المناعة",
            price: 119,
            old_price: 159,
            image_url: "https://images.pexels.com/photos/40815/immunology-blood-lymphocyte-40815.jpeg?auto=compress&cs=tinysrgb&w=400",
            rating: 4.9,
            review_count: 234,
            stock_quantity: 12,
            is_bestseller: true
          }
        ];

        const mockCategories: Category[] = [
          {
            id: 1,
            name: "الزيوت الطبيعية",
            slug: "oils",
            description: "أفضل أنواع زيوت الأعشاب",
            image_url: "https://images.pexels.com/photos/159581/pexels-photo-159581.jpeg?auto=compress&cs=tinysrgb&w=400"
          },
          {
            id: 2,
            name: "أعشاب شاي",
            slug: "teas",
            description: "شاي الأعشاب الطبيعية",
            image_url: "https://images.pexels.com/photos/1793388/pexels-photo-1793388.jpeg?auto=compress&cs=tinysrgb&w=400"
          },
          {
            id: 3,
            name: "مكملات غذائية",
            slug: "supplements",
            description: "مكملات صحية طبيعية",
            image_url: "https://images.pexels.com/photos/40815/immunology-blood-lymphocyte-40815.jpeg?auto=compress&cs=tinysrgb&w=400"
          }
        ];

        setProducts(mockProducts);
        setFeaturedProducts(mockProducts.filter(p => p.is_featured));
        setBestSellers(mockProducts.filter(p => p.is_bestseller));
        setCategories(mockCategories);

        // Initialize quantities
        const initialQuantities: Record<number, number> = {};
        mockProducts.forEach(p => {
          initialQuantities[p.id] = 1;
        });
        setQuantities(initialQuantities);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
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

  const handleAddToCart = useCallback((product: Product) => {
    const quantity = quantities[product.id] || 1;
    const newItem = { ...product };
    
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, stock_quantity: item.stock_quantity + quantity }
            : item
        );
      }
      return [...prev, { ...newItem, stock_quantity: quantity }];
    });
  }, [quantities]);

  const updateQuantity = (productId: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const nextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white font-sans" dir="rtl">
      {/* Promotional Banner */}
      <div className="promo-banner">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">عرض خاص: خصم 20% على جميع المنتجات هذا الأسبوع!</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm">ينتهي خلال:</span>
              <div className="flex gap-1">
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-bold">
                  {String(countdown.hours).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-bold">
                  {String(countdown.minutes).padStart(2, '0')}
                </span>
                <span>:</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-bold">
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`sticky-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl md:text-3xl">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="gradient-text">BioPara</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-primary font-medium transition-colors">الرئيسية</Link>
              <Link href="/products" className="text-gray-700 hover:text-primary font-medium transition-colors">المنتجات</Link>
              <Link href="/category" className="text-gray-700 hover:text-primary font-medium transition-colors">الفئات</Link>
              <Link href="/consultation" className="text-gray-700 hover:text-primary font-medium transition-colors">حجز استشارة</Link>
              <Link href="/about" className="text-gray-700 hover:text-primary font-medium transition-colors">من نحن</Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary font-medium transition-colors">اتصل بنا</Link>
            </nav>

            {/* Search, Cart, User */}
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <button 
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-gray-600 hover:text-primary transition-colors"
                  aria-label="بحث عن المنتجات"
                >
                  <Search className="w-5 h-5" />
                </button>
                
                {searchOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-fade-in-up">
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث عن منتج..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                      >
                        بحث
                      </button>
                    </form>
                  </div>
                )}
              </div>

              <Link href="/sign-in" className="p-2 text-gray-600 hover:text-primary transition-colors hidden md:block">
                <User className="w-5 h-5" />
              </Link>

              <Link href="/cart" className="p-2 text-gray-600 hover:text-primary transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors"
                aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4 animate-fade-in-up">
            <div className="container mx-auto px-4">
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>الرئيسية</Link>
                <Link href="/products" className="text-gray-700 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>المنتجات</Link>
                <Link href="/category" className="text-gray-700 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>الفئات</Link>
                <Link href="/consultation" className="text-gray-700 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>حجز استشارة</Link>
                <Link href="/about" className="text-gray-700 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>من نحن</Link>
                <Link href="/contact" className="text-gray-700 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>اتصل بنا</Link>
                <Link href="/sign-in" className="text-gray-700 hover:text-primary font-medium py-2" onClick={() => setMobileMenuOpen(false)}>تسجيل الدخول</Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/4113834/pexels-photo-4113834.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="خلفية الأعشاب الطبية"
            className="w-full h-full object-cover"
            layout="fill"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 via-green-800/85 to-emerald-700/80"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-right animate-fade-in-up">
              {/* Rating Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-white font-bold">4.9/5</span>
                <span className="text-green-200 text-sm">(2,156 تقييم)</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                اكتشف قوة
                <span className="block text-green-300">الأعشاب الطبيعية</span>
              </h1>
              <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed max-w-xl">
                نقدم أفضل أنواع الأعشاب الطبية الطبيعية والمنتجات الصحية من مصادر موثوقة لضمان صحتك وسعادتك
              </p>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8 max-w-md mx-auto lg:mx-0">
                <div className="trust-badge">
                  <Lock className="w-5 h-5 text-primary" />
                  <p className="text-xs text-gray-700 font-medium">دفع آمن</p>
                </div>
                <div className="trust-badge">
                  <Truck className="w-5 h-5 text-primary" />
                  <p className="text-xs text-gray-700 font-medium">توصيل سريع</p>
                </div>
                <div className="trust-badge">
                  <RefreshCw className="w-5 h-5 text-primary" />
                  <p className="text-xs text-gray-700 font-medium">ضمان استرجاع</p>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  تسوق الآن
                </Link>
                <Link
                  href="/about"
                  className="btn-secondary inline-flex items-center justify-center gap-2 border-white text-white hover:bg-white hover:text-green-700"
                >
                  <Leaf size={20} />
                  اعرف المزيد
                </Link>
              </div>
            </div>
            
            {/* Featured Product */}
            <div className="relative mt-8 lg:mt-0 animate-slide-in-right">
              {bestSellers.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-4 md:p-6 border border-white/20 max-w-md mx-auto">
                  <div className="absolute -top-3 -right-3 badge-bestseller flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    الأكثر مبيعاً
                  </div>
                  
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={bestSellers[0].image_url}
                      alt={bestSellers[0].name}
                      fill
                      className="object-cover"
                    />
                  {bestSellers[0].stock_quantity < 10 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse-soft">
                       Only {bestSellers[0].stock_quantity} left!
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{bestSellers[0].name}</h3>
                  <p className="text-green-200 text-sm mb-3">{bestSellers[0].description}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-green-200 text-sm">{bestSellers[0].rating} ({bestSellers[0].review_count} تقييم)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">{bestSellers[0].price}₽</span>
                      {bestSellers[0].old_price && (
                        <>
                          <span className="text-green-300 line-through text-sm">{bestSellers[0].old_price}₽</span>
                          <span className="price-discount">-{Math.round((1 - bestSellers[0].price / bestSellers[0].old_price) * 100)}%</span>
                        </>
                      )}
                    </div>
                    <Link
                      href={`/products/${bestSellers[0].id}`}
                      className="bg-white text-green-700 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition-all"
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
      <section className="section bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
              <TrendingUp className="w-4 h-4" />
              الأكثر مبيعاً
            </div>
            <h2 className="section-title">الأكثر مبيعاً</h2>
            <p className="section-subtitle">المنتجات المفضلة لدى عملائنا</p>
          </div>
          
          <div className="product-grid">
            {bestSellers.slice(0, 8).map((product, index) => (
              <div 
                key={product.id} 
                className="premium-card group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Badges */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                  {product.is_bestseller && (
                    <span className="badge-bestseller">الأكثر مبيعاً</span>
                  )}
                  {product.is_new && (
                    <span className="badge-new">جديد</span>
                  )}
                  {product.old_price && (
                    <span className="badge-sale">
                      -{Math.round((1 - product.price / product.old_price) * 100)}%
                    </span>
                  )}
                </div>
                
                {/* Low Stock Warning */}
                {product.stock_quantity < 10 && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      متبقي {product.stock_quantity} فقط
                    </span>
                  </div>
                )}
                
                {/* Image */}
                <div className="relative aspect-square img-hover-zoom bg-gray-100">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <Link
                      href={`/products/${product.id}`}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-500">({product.review_count})</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="price-tag">{product.price}₽</span>
                      {product.old_price && (
                        <span className="price-old">{product.old_price}₽</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-primary text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    أضف للسلة
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/products" className="btn-secondary inline-flex items-center gap-2">
              عرض جميع المنتجات
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
              <MessageCircle className="w-4 h-4" />
              آراء العملاء
            </div>
            <h2 className="section-title">ماذا يقول عملاؤنا</h2>
            <p className="section-subtitle">شكراً لثقتكم بنا</p>
          </div>
          
          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="testimonial-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover ml-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">&ldquo;{testimonial.comment}&rdquo;</p>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonialIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentTestimonialIndex ? 'bg-primary w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Health Guide / Blog Section */}
      <section className="section bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Award className="w-4 h-4" />
              دليل الصحة
            </div>
            <h2 className="section-title">أحدث المقالات</h2>
            <p className="section-subtitle">نصائح وإرشادات للحياة الصحية</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogArticles.map((article, index) => (
              <article 
                key={article.id} 
                className="premium-card group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-video img-hover-zoom">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{article.description}</p>
                  <Link 
                    href={`/blog/${article.slug}`} 
                    className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                  >
                    اقرأ المزيد
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="section bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Instagram className="w-4 h-4" />
              تابعنا
            </div>
            <h2 className="section-title">على إنستغرام</h2>
            <p className="section-subtitle">شاهد أحدث المنتجات والنصائح</p>
          </div>
          
          <div className="social-grid">
            {socialImages.map((img, index) => (
              <div 
                key={index} 
                className="relative aspect-square cursor-pointer group overflow-hidden rounded-xl"
              >
                <Image
                  src={img}
                  alt={`إنستغرام ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Certification Section */}
      <section className="section bg-gradient-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title text-white">ضمان الجودة والثقة</h2>
            <p className="text-green-100 text-lg">نلتزم بأعلى معايير الجودة والسلامة</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <CheckCircle className="w-10 h-10 text-green-300" />
              </div>
              <h3 className="font-bold mb-2">ISO 9001</h3>
              <p className="text-green-200 text-sm">شهادة الجودة الدولية</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Shield className="w-10 h-10 text-green-300" />
              </div>
              <h3 className="font-bold mb-2">Organic Certified</h3>
              <p className="text-green-200 text-sm">منتجات عضوية معتمدة</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Leaf className="w-10 h-10 text-green-300" />
              </div>
              <h3 className="font-bold mb-2">100% Natural</h3>
              <p className="text-green-200 text-sm">مكونات طبيعية نقية</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Award className="w-10 h-10 text-green-300" />
              </div>
              <h3 className="font-bold mb-2">GMP Certified</h3>
              <p className="text-green-200 text-sm">معايير التصنيع الجيد</p>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="text-center mb-6">
              <p className="text-green-200">نقبل جميع وسائل الدفع الآمنة</p>
            </div>
            <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
              <div className="w-16 h-10 bg-white/10 rounded flex items-center justify-center text-xs font-bold">VISA</div>
              <div className="w-16 h-10 bg-white/10 rounded flex items-center justify-center text-xs font-bold">MasterCard</div>
              <div className="w-16 h-10 bg-white/10 rounded flex items-center justify-center text-xs font-bold">MADA</div>
              <div className="w-16 h-10 bg-white/10 rounded flex items-center justify-center text-xs font-bold">Apple Pay</div>
              <div className="w-16 h-10 bg-white/10 rounded flex items-center justify-center text-xs font-bold">STC Pay</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">اشترك في نشرتنا الإخبارية</h2>
            <p className="text-gray-400 mb-8">احصل على أحدث العروض والمنتجات الجديدة مباشرة في بريدك الإلكتروني</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                required
              />
              <button
                type="submit"
                className="btn-primary whitespace-nowrap"
              >
                اشترك الآن
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 font-bold text-2xl mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span>BioPara</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                متجرك الأول للأعشاب الطبية الطبيعية والمنتجات الصحية 100%
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">المنتجات</Link></li>
                <li><Link href="/category" className="text-gray-400 hover:text-white transition-colors">الفئات</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">عن المتجر</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</Link></li>
                <li><Link href="/consultation" className="text-gray-400 hover:text-white transition-colors">حجز استشارة</Link></li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="font-bold text-lg mb-4">السياسات</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">سياسة الخصوصية</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">شروط الاستخدام</Link></li>
                <li><Link href="/delivery" className="text-gray-400 hover:text-white transition-colors">سياسة التوصيل</Link></li>
                <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">سياسة الاسترجاع</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">تواصل معنا</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>+966 50 123 4567</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-5 h-5 text-primary" />
                  <span>info@biopara.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>الرياض، المملكة العربية السعودية</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-center text-sm text-gray-400">
                © 2024 BioPara. جميع الحقوق محفوظة.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/966500000000"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="تواصل معنا عبر واتساب"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Free Shipping Banner */}
      <div className="free-shipping-bar">
        <Truck className="w-5 h-5" />
        <span className="text-sm font-bold">شحن مجاني للطلبات فوق 200₽</span>
      </div>
    </div>
  );
}
