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
}

export default function MasterComponent(props: MasterComponentProps): JSX.Element {
  const {
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
    showCountries = true
  } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItemCount, isCartOpen, setIsCartOpen } = useCart();
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
          tagline: 'صنع في المغرب',
          madeIn: 'صنع في المغرب'
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
        },
        copyright: '© 2024 بيوبارا. جميع الحقوق محفوظة.'
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
        },
        navigation: {
          quickLinks: {
            title: 'Quick Links',
            links: [
              { name: 'About', href: '/about' },
              { name: 'Products', href: '/products' },
              { name: 'Brands', href: '/brands' },
              { name: 'Special Offers', href: '/promotions' },
              { name: 'Contact', href: '/contact' }
            ]
          },
          customerService: {
            title: 'Customer Service',
            links: [
              { name: 'Delivery & Shipping', href: '/delivery' },
              { name: 'Payment Methods', href: '/payment' },
              { name: 'Terms & Conditions', href: '/terms' },
              { name: 'Privacy Policy', href: '/privacy' },
              { name: 'Favorites', href: '/dashboard/favorites' }
            ]
          },
          contact: {
            title: 'Contact Us',
            phone: '+212 5XX-XXXXXX',
            email: 'info@biopara.ma',
            address: 'Casablanca, Morocco',
            hours: '9:00 - 18:00 (Mon - Fri)'
          }
        },
        copyright: '© 2024 BioPara. All rights reserved.'
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
        },
        navigation: {
          quickLinks: {
            title: 'Liens rapides',
            links: [
              { name: 'À propos', href: '/about' },
              { name: 'Produits', href: '/products' },
              { name: 'Marques', href: '/brands' },
              { name: 'Offres spéciales', href: '/promotions' },
              { name: 'Contact', href: '/contact' }
            ]
          },
          customerService: {
            title: 'Service client',
            links: [
              { name: 'Livraison et expédition', href: '/delivery' },
              { name: 'Modes de paiement', href: '/payment' },
              { name: 'Termes et conditions', href: '/terms' },
              { name: 'Politique de confidentialité', href: '/privacy' },
              { name: 'Favoris', href: '/dashboard/favorites' }
            ]
          },
          contact: {
            title: 'Contactez-nous',
            phone: '+212 5XX-XXXXXX',
            email: 'info@biopara.ma',
            address: 'Casablanca, Maroc',
            hours: '9:00 - 18:00 (Lundi - Vendredi)'
          }
        },
        copyright: '© 2024 BioPara. Tous droits réservés.'
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
            {/* Parapharmacie Products */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Image
                  src="/images/parapharmacie/argan-oil-new.jpg"
                  alt="زيت الأرغان الفاخر"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">زيت الأرغان الفاخر</h3>
                <p className="text-emerald-600 font-bold">350.00 درهم</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Image
                  src="/images/parapharmacie/hyaluronic-serum-new.jpg"
                  alt="سيروم الهيالورونيك أسيد"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">سيروم الهيالورونيك أسيد</h3>
                <p className="text-emerald-600 font-bold">280.00 درهم</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Image
                  src="/images/parapharmacie/moisturizing-cream-new.jpg"
                  alt="كريم مرطب للبشرة"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">كريم مرطب للبشرة</h3>
                <p className="text-emerald-600 font-bold">220.00 درهم</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Image
                  src="/images/parapharmacie/sunscreen-spf50-new.jpg"
                  alt="واقي الشمس SPF50"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">واقي الشمس SPF50</h3>
                <p className="text-emerald-600 font-bold">180.00 درهم</p>
              </div>
            </div>
            
            {/* Medical Herbs */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Image
                  src="/images/medical-herbs/camomile-herb.jpg"
                  alt="البابونج الطبي"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">البابونج الطبي</h3>
                <p className="text-emerald-600 font-bold">45.00 درهم</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Image
                  src="/images/medical-herbs/lavender-herb.jpg"
                  alt="الخزامى الطبي"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">الخزامى الطبي</h3>
                <p className="text-emerald-600 font-bold">55.00 درهم</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Image
                  src="/images/medical-herbs/mint-herb.jpg"
                  alt="النعناع الطبي"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">النعناع الطبي</h3>
                <p className="text-emerald-600 font-bold">35.00 درهم</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <Image
                  src="/images/medical-herbs/rosemary-herb.jpg"
                  alt="إكليل الجبل"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">إكليل الجبل</h3>
                <p className="text-emerald-600 font-bold">40.00 درهم</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">{currentLang.footer?.company?.name || 'BioPara'}</h3>
              <p className="text-gray-400 mb-4">{currentLang.footer?.company?.description || 'Premium natural wellness products'}</p>
              <div className="flex gap-4 mb-4">
                <a href="#" aria-label="Facebook" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a href="#" aria-label="Instagram" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="#" aria-label="Twitter" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-300">{currentLang.footer.navigation?.quickLinks?.title || 'Quick Links'}</h4>
                <ul className="space-y-2">
                  {currentLang.footer.navigation?.quickLinks?.links?.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="text-gray-400 hover:text-emerald-400 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-300">{currentLang.footer.navigation?.customerService?.title || 'Customer Service'}</h4>
                <ul className="space-y-2">
                  {currentLang.footer.navigation?.customerService?.links?.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="text-gray-400 hover:text-emerald-400 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-300">{currentLang.footer.navigation?.contact?.title || 'Contact Us'}</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-600">{currentLang.footer.navigation?.contact?.phone || '+212 5XX-XXXXXX'}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-600">{currentLang.footer.navigation?.contact?.email || 'info@biopara.ma'}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-600">{currentLang.footer.navigation?.contact?.address || 'Casablanca, Morocco'}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-emerald-400" />
                    <span className="text-gray-600">{currentLang.footer.navigation?.contact?.hours || '9:00 - 18:00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                {currentLang.footer?.copyright || '© 2024 BioPara. All rights reserved.'}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{currentLang.footer?.company?.madeIn || 'Made with ❤️ in Morocco'}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart Dropdown */}
      {isCartOpen && (
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
      )}
    </div>
  );
}
