"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronLeft,
  Globe, 
  Shield, 
  Award, 
  Truck, 
  Star,
  Heart,
  Clock,
  Phone,
  MapPin,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  CreditCard,
  Check
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

// TypeScript Interface for Props
interface MasterComponentProps {
  locale?: 'ar' | 'en' | 'fr';
  variant?: 'default' | 'premium' | 'global';
  showLanguageSelector?: boolean;
  showCurrencySelector?: boolean;
  showShippingBanner?: boolean;
  showStats?: boolean;
  showTrustBadges?: boolean;
  showVideo?: boolean;
  showNewsletter?: boolean;
  showPaymentMethods?: boolean;
  showShippingInfo?: boolean;
  showCountries?: boolean;
  maxReviews?: number;
}

export default function MasterComponent({ 
  locale = 'ar', 
  variant = 'default',
  showLanguageSelector = false,
  showCurrencySelector = false,
  showShippingBanner = false,
  showStats = true,
  showTrustBadges = true,
  showVideo = false,
  showNewsletter = true,
  showPaymentMethods = true,
  showShippingInfo = true,
  showCountries = true,
  maxReviews = 6
}: MasterComponentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItemCount, setIsCartOpen } = useCart();
  const pathname = usePathname();

  const categories = [
    { name: locale === 'ar' ? 'الأعشاب الطبية' : 'Herbal Medicine', href: '/products?category=الأعشاب الطبية' },
    { name: locale === 'ar' ? 'Parapharmacie' : 'Parapharmacie', href: '/products?category=Parapharmacie' }
  ];

  const brands = [
    { name: 'La Roche-Posay', href: '/brands/la-roche-posay' },
    { name: 'Vichy', href: '/brands/vichy' },
    { name: 'CeraVe', href: '/brands/cerave' },
    { name: 'Bioderma', href: '/brands/bioderma' },
    { name: 'Avène', href: '/brands/avene' },
    { name: 'Nuxe', href: '/brands/nuxe' },
    { name: 'Uriage', href: '/brands/uriage' },
    { name: 'Mustela', href: '/brands/mustela' },
    { name: 'Eucerin', href: '/brands/eucerin' },
    { name: 'SVR', href: '/brands/svr' },
    { name: 'Filorga', href: '/brands/filorga' },
    { name: 'BioOriental', href: '/brands/bio-oriental' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (window.scrollY > 50) {
          navbar.classList.add('shadow-lg');
        } else {
          navbar.classList.remove('shadow-lg');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Localization Data
  const localization = {
    ar: {
      nav: {
        home: 'الرئيسية',
        products: 'المنتجات',
        about: 'من نحن',
        contact: 'اتصل بنا',
        brands: 'الماركات',
        promotions: 'العروض'
      },
      hero: {
        title: 'العافية الطبيعية الفاخرة',
        subtitle: 'تصل لكل العالم',
        description: 'استمتع بأجود منتجات العافية الطبيعية من المغرب، الموثوقة من قبل أكثر من مليون عميل حول العالم. من زيت الأرغان الفاخر إلى العلاجات العشبية التقليدية، نقدم أفضل الطبيعة لباب منزلك.',
        trustBadge: 'موثوق في أكثر من 50 دولة',
        ctaPrimary: 'تسوق الآن',
        ctaSecondary: 'اعرف المزيد',
        searchPlaceholder: 'ابحث...',
        popularSearches: ['زيت الأرغان', 'شاي الأعشاب', 'العناية الطبيعية', 'منتجات عضوية']
      },
      footer: {
        company: {
          name: 'بيوبارا',
          description: 'خبيرك في المنتجات شبه الصيدلية والعلاج بالنباتات في المغرب. نقدم أفضل المنتجات الطبيعية والعلاجية.',
          tagline: 'صنع في المغرب'
        },
        navigation: {
          quickLinks: {
            title: 'روابط سريعة',
            links: [
              { name: 'من نحن', href: '/about' },
              { name: 'المنتجات', href: '/products' },
              { name: 'الماركات', href: '/brands' },
              { name: 'العروض', href: '/promotions' },
              { name: 'اتصل بنا', href: '/contact' }
            ]
          },
          customerService: {
            title: 'خدمة العملاء',
            links: [
              { name: 'التوصيل والشحن', href: '/delivery' },
              { name: 'طرق الدفع', href: '/payment' },
              { name: 'الشروط والأحكام', href: '/terms' },
              { name: 'سياسة الخصوصية', href: '/privacy' },
              { name: 'المفضلة', href: '/dashboard/favorites' }
            ]
          },
          contact: {
            title: 'تواصل معنا',
            phone: '+212 5XX-XXXXXX',
            email: 'info@biopara.ma',
            address: 'الدار البيضاء، المغرب',
            hours: '9:00 - 18:00 (السبت - الخميس)'
          }
        }
      },
      reviews: {
        header: {
          title: 'آراء العملاء',
          subtitle: 'من حول العالم'
        },
        stats: {
          totalReviews: '45,678',
          averageRating: '4.9/5',
          verifiedPurchases: '98%',
          countriesServed: '52'
        },
        cta: {
          title: 'انضم إلى مجتمعنا العالمي',
          description: 'استمتع بالعافية الطبيعية الفاخرة الموثوقة من قبل العملاء حول العالم. شحن سريع وآمن لباب منزلك.',
          primaryButton: 'تسوق المجموعة الفاخرة',
          secondaryButton: 'عرض جميع المراجعات'
        },
        countries: [
          { flag: '🇸🇦', name: 'المملكة العربية السعودية', count: 12543 },
          { flag: '🇲🇦', name: 'المغرب', count: 18976 },
          { flag: '🇦🇦', name: 'الإمارات العربية المتحدة', count: 8934 },
          { flag: '🇩🇶', name: 'قطر', count: 7654 },
          { flag: '🇩🇦', name: 'الكويت', count: 5678 },
          { flag: '🇹🇳', name: 'تونس', count: 6789 },
          { flag: '🇪🇸', name: 'عُمان', count: 9876 },
          { flag: '🇪🇸', name: 'البحرين', count: 4567 }
        ],
        reviews: [
          {
            id: 1,
            name: 'سارة أحمد',
            country: '🇸🇦 المملكة العربية السعودية',
            flag: '🇸🇦',
            rating: 5,
            date: 'منذ أسبوعين',
            comment: 'جودة فائقة حقاً! زيت الأرغان نقي وأصيل. شحن سريع إلى الرياض، وصل في حالة مثالية. سأطلب بالتأكيد مرة أخرى!',
            product: 'زيت الأرغان الفاخر',
            verified: true
          },
          {
            id: 2,
            name: 'محمد الشمري',
            country: '🇲🇦 المغرب',
            flag: '🇲🇦',
            rating: 5,
            date: 'منذ شهر',
            comment: 'جودة ممتازة ومنتجات مغربية أصيلة. خدمة العملاء ممتازة والشحن إلى الدار البيضاء كان سريعاً ومغلفاً بشكل جيد.',
            product: 'مجموعة الشاي العشبي',
            verified: true
          },
          {
            id: 3,
            name: 'فاطمة الزهراء',
            country: '🇦🇦 الإمارات العربية المتحدة',
            flag: '🇦🇦',
            rating: 5,
            date: 'منذ 3 أسابيع',
            comment: 'منتجات رائعة ومكونات طبيعية 100%. أحببت التغليف الفاخر والشحن السريع إلى دبي.',
            product: 'مجموعة العناية الطبيعية',
            verified: true
          },
          {
            id: 4,
            name: 'نور الدين قاسم',
            country: '🇩🇶 قطر',
            flag: '🇩🇶',
            rating: 5,
            date: 'منذ أسبوعين',
            comment: 'تجربة شراء ممتازة! منتجات عالية الجودة وخدمة عملاء ممتازة. الشحن إلى الدوحة كان سريعاً وآمناً.',
            product: 'زيت الأرغان العضوي',
            verified: true
          },
          {
            id: 5,
            name: 'خديجة محمد',
            country: '🇹🇳 تونس',
            flag: '🇹🇳',
            rating: 5,
            date: 'منذ 3 أسابيع',
            comment: 'منتجات جيدة وجودة معتمدة. التغليف أنيق والشحن إلى تونس كان معقولاً. أوصي به!',
            product: 'مجموعة الجمال الفاخرة',
            verified: true
          },
          {
            id: 6,
            name: 'عبدالله السعيد',
            country: '🇪🇸 عُمان',
            flag: '🇪🇸',
            rating: 5,
            date: 'منذ شهر',
            comment: 'منتجات طبيعية فاخرة وأصلية. خدمة عملاء ممتازة وشحن موثوق إلى مسقط.',
            product: 'مجموعة العافية المتكاملة',
            verified: true
          }
        ],
        trustBadges: [
          { icon: <Shield className="w-6 h-6" />, text: 'دفع آمن' },
          { icon: <Award className="w-6 h-6" />, text: 'عضوي معتمد' },
          { icon: <Truck className="w-6 h-6" />, text: 'شحن عالمي' },
          { icon: <Check className="w-6 h-6" />, text: 'إرجاع 30 يوم' }
        ]
      }
    },
    en: {
      nav: {
        home: 'Home',
        products: 'Products',
        about: 'About',
        contact: 'Contact',
        brands: 'Brands',
        promotions: 'Special Offers'
      },
      hero: {
        title: 'Premium Natural Wellness',
        subtitle: 'Delivered Worldwide',
        description: 'Experience premium natural wellness products from Morocco, trusted by over 1 million customers worldwide. From premium argan oil to traditional herbal remedies, we bring the best of nature to your doorstep.',
        trustBadge: 'Trusted in 50+ Countries',
        ctaPrimary: 'Shop Premium Collection',
        ctaSecondary: 'Watch Our Story',
        searchPlaceholder: 'Search for premium natural products...',
        popularSearches: ['Argan Oil', 'Herbal Tea', 'Natural Care', 'Organic Products']
      },
      footer: {
        company: {
          name: 'BioPara',
          description: 'Premium natural wellness products delivered worldwide. From Morocco to world, bringing nature\'s best to your doorstep.',
          tagline: 'Made with ❤️ in Morocco',
          madeIn: 'Made in Morocco'
        }
      }
    },
    fr: {
      nav: {
        home: 'Accueil',
        products: 'Produits',
        about: 'À propos',
        contact: 'Contact',
        brands: 'Marques',
        promotions: 'Offres spéciales'
      },
      hero: {
        title: 'Bien-être Naturel Premium',
        subtitle: 'Livraison Mondiale',
        description: 'Découvrez les meilleurs produits de bien-être naturel du Maroc, approuvés par plus d\'un million de clients dans le monde entier. Du Maroc au monde, apportant le meilleur de la nature.',
        trustBadge: 'Approuvé dans 50+ Pays',
        ctaPrimary: 'Collection Premium',
        ctaSecondary: 'Notre Histoire',
        searchPlaceholder: 'Rechercher des produits naturels premium...',
        popularSearches: ['Huile d\'Argan', 'Thé aux Herbes', 'Soins Naturels', 'Produits Bio']
      },
      footer: {
        company: {
          name: 'BioPara',
          description: 'Produits de bien-être naturels premium livrés dans le monde entier. Du Maroc au monde, apportant le meilleur de la nature.',
          tagline: 'Fabriqué avec ❤️ au Maroc',
          madeIn: 'Fabriqué au Maroc'
        }
      }
    }
  };

  const currentLang = localization[locale as keyof typeof localization] || localization.ar;

  // CSS Classes based on variant
  const getNavbarClasses = () => {
    return variant === 'global' ? 'bg-[var(--color-surface)] border-b border-gray-100 sticky top-0 z-50 shadow-premium' : 'bg-white sticky top-0 z-50 transition-shadow duration-300';
  };

  const getContainerClasses = () => {
    return variant === 'global' ? 'container-premium' : 'container mx-auto px-4';
  };

  return (
    <div className="min-h-screen bg-gray-50" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Navigation */}
      <nav id="navbar" className={getNavbarClasses()}>
        <div className={getContainerClasses()}>
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">ب</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">بيوبارا</h1>
                <p className="text-sm text-gray-600">العافية الطبيعية الفاخرة</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <Link
                href="/"
                className={`font-medium transition-colors ${pathname === '/' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
              >
                {currentLang.nav.home}
              </Link>
              <Link
                href="/products"
                className={`font-medium transition-colors ${pathname === '/products' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
              >
                {currentLang.nav.products}
              </Link>
              <Link
                href="/about"
                className={`font-medium transition-colors ${pathname === '/about' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
              >
                {currentLang.nav.about}
              </Link>
              <Link
                href="/contact"
                className={`font-medium transition-colors ${pathname === '/contact' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
              >
                {currentLang.nav.contact}
              </Link>
              <Link
                href="/brands"
                className={`font-medium transition-colors ${pathname === '/brands' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
              >
                {currentLang.nav.brands}
              </Link>
              <Link
                href="/promotions"
                className={`font-medium transition-colors ${pathname === '/promotions' ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
              >
                {currentLang.nav.promotions}
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-full max-w-md">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={currentLang.hero.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
              <button
                onClick={handleSearch}
                className="ml-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors"
              >
                {locale === 'ar' ? 'بحث' : 'Search'}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <Link href="/dashboard/profile" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <User className="w-5 h-5 text-gray-700" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  {currentLang.nav.home}
                </Link>
                <Link href="/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  {currentLang.nav.products}
                </Link>
                <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  {currentLang.nav.about}
                </Link>
                <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  {currentLang.nav.contact}
                </Link>
                <Link href="/brands" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  {currentLang.nav.brands}
                </Link>
                <Link href="/promotions" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  {currentLang.nav.promotions}
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-right space-y-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {currentLang.hero.title}
                <span className="block text-emerald-600">{currentLang.hero.subtitle}</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl">
                {currentLang.hero.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-500 transition-colors">
                  {currentLang.hero.ctaPrimary}
                </button>
                <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                  {currentLang.hero.ctaSecondary}
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="lg:order-1">
              <div className="aspect-square bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl font-bold text-emerald-600">ب</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% طبيعي</h3>
              <p className="text-gray-600">منتجات طبيعية نقية</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">شحن عالمي</h3>
              <p className="text-gray-600">توصيل سريع وآمن</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">دفع آمن</h3>
              <p className="text-gray-600">طرق دفع متعددة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {currentLang.nav.products}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-400">منتج {item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {currentLang.reviews.header.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentLang.reviews.reviews.slice(0, maxReviews).map((review, index) => (
              <div key={review.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-emerald-600">⭐</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-600">{review.country}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="text-sm text-gray-600">{review.rating}.0</span>
                </div>
                <p className="text-gray-600 mb-4">{review.comment}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-600">{review.product}</span>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{currentLang.footer.company.name}</h3>
              <p className="text-gray-400 mb-4">{currentLang.footer.company.description}</p>
              <div className="flex gap-4 mb-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-300">{currentLang.footer.navigation.quickLinks.title}</h4>
                <ul className="space-y-2">
                  {currentLang.footer.navigation.quickLinks.links.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="text-gray-400 hover:text-emerald-400 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-300">{currentLang.footer.navigation.customerService.title}</h4>
                <ul className="space-y-2">
                  {currentLang.footer.navigation.customerService.links.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="text-gray-400 hover:text-emerald-400 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-300">{currentLang.footer.navigation.contact.title}</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-600">{currentLang.footer.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-600">{currentLang.footer.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-600">{currentLang.footer.contact.address}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-600">{currentLang.footer.contact.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                {currentLang.footer.copyright}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{currentLang.footer.company.tagline}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">سلة التسوق</h3>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              إغلاق السلة
            </button>
          </div>
          <div className="text-sm text-gray-600">
            {cartItemCount} منتجات - {locale === 'ar' ? 'درهم' : 'MAD'}
          </div>
        </div>
      </div>
    </div>
  );
}
