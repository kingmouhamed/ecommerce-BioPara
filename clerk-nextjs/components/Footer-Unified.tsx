"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Globe, 
  Shield, 
  Truck, 
  CreditCard, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Award,
  Users,
  Clock,
  Youtube
} from 'lucide-react';

// TypeScript Interface for Props
interface FooterProps {
  locale?: 'ar' | 'en' | 'fr';
  variant?: 'default' | 'global';
  showTrustSignals?: boolean;
  showPaymentMethods?: boolean;
  showShippingInfo?: boolean;
  showNewsletter?: boolean;
}

export default function Footer({ 
  locale = 'ar', 
  variant = 'default',
  showTrustSignals = true,
  showPaymentMethods = true,
  showShippingInfo = true,
  showNewsletter = true
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Localization Data
  const localization = {
    ar: {
      company: {
        name: 'BioPara',
        description: 'خبيرك في المنتجات شبه الصيدلية والعلاج بالنباتات في المغرب. نقدم أفضل المنتجات الطبيعية والعلاجية.',
        tagline: 'صنع بـ ❤️ في المغرب',
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
      trustSignals: [
        { icon: <Shield className="w-5 h-5" />, title: 'ISO معتمد', description: 'الجودة مضمونة' },
        { icon: <Award className="w-5 h-5" />, title: 'GMP معتمد', description: 'تصنيع جيد' },
        { icon: <Globe className="w-5 h-5" />, title: '50+ دولة', description: 'توصيل عالمي' },
        { icon: <Users className="w-5 h-5" />, title: '1M+ عميل', description: 'موثوق عالمياً' }
      ],
      paymentMethods: [
        { name: 'Visa', icon: '💳' },
        { name: 'MasterCard', icon: '💳' },
        { name: 'PayPal', icon: '💳' },
        { name: 'Apple Pay', icon: '🍎' },
        { name: 'Google Pay', icon: '🤖' }
      ],
      shippingInfo: [
        { country: 'أوروبا', time: '3-5 أيام', price: 'مجاني €50+' },
        { country: 'أمريكا', time: '5-7 أيام', price: 'مجاني $75+' },
        { country: 'الخليج', time: '4-6 أيام', price: 'مجاني 250 درهم+' },
        { country: 'المغرب', time: '1-2 أيام', price: 'مجاني 200 درهم+' }
      ],
      newsletter: {
        title: 'النشرة البريدية',
        placeholder: 'بريدك الإلكتروني',
        button: 'اشتراك',
        description: 'احصل على عروض حصرية ونصائح العافية'
      },
      copyright: `© ${currentYear} BioPara. جميع الحقوق محفوظة.`,
      footerLinks: [
        { name: 'سياسة الخصوصية', href: '/privacy' },
        { name: 'شروط الخدمة', href: '/terms' },
        { name: 'سياسة الكوكيز', href: '/cookies' },
        { name: 'خريطة الموقع', href: '/sitemap' }
      ]
    },
    en: {
      company: {
        name: 'BioPara',
        description: 'Premium natural wellness products delivered worldwide. From Morocco to world, bringing nature\'s best to your doorstep.',
        tagline: 'Made with ❤️ in Morocco',
        madeIn: 'Made in Morocco'
      },
      navigation: {
        quickLinks: {
          title: 'Shop',
          links: [
            { name: 'Our Story', href: '/about' },
            { name: 'All Products', href: '/products' },
            { name: 'Brands', href: '/brands' },
            { name: 'Special Offers', href: '/promotions' },
            { name: 'New Arrivals', href: '/new-arrivals' }
          ]
        },
        customerService: {
          title: 'Customer Care',
          links: [
            { name: 'Shipping Info', href: '/shipping' },
            { name: 'Payment Methods', href: '/payment' },
            { name: 'Returns & Exchanges', href: '/returns' },
            { name: 'FAQ', href: '/faq' },
            { name: 'Size Guide', href: '/size-guide' },
            { name: 'Track Order', href: '/track-order' }
          ]
        },
        contact: {
          title: 'Contact Us',
          phone: '+1-800-BIOPARA',
          email: 'support@biopara.com',
          address: 'New York, NY, USA',
          hours: '24/7 Customer Support'
        }
      },
      trustSignals: [
        { icon: <Shield className="w-5 h-5" />, title: 'ISO Certified', description: 'Quality Assured' },
        { icon: <Award className="w-5 h-5" />, title: 'GMP Certified', description: 'Good Manufacturing' },
        { icon: <Globe className="w-5 h-5" />, title: '50+ Countries', description: 'Global Delivery' },
        { icon: <Users className="w-5 h-5" />, title: '1M+ Customers', description: 'Trusted Worldwide' }
      ],
      paymentMethods: [
        { name: 'Visa', icon: '💳' },
        { name: 'MasterCard', icon: '💳' },
        { name: 'PayPal', icon: '💳' },
        { name: 'Apple Pay', icon: '🍎' },
        { name: 'Google Pay', icon: '🤖' }
      ],
      shippingInfo: [
        { country: 'Europe', time: '3-5 days', price: 'Free €50+' },
        { country: 'USA', time: '5-7 days', price: 'Free $75+' },
        { country: 'Gulf', time: '4-6 days', price: 'Free 250 AED+' },
        { country: 'Morocco', time: '1-2 days', price: 'Free 200 MAD+' }
      ],
      newsletter: {
        title: 'Global Newsletter',
        placeholder: 'Your email',
        button: 'Subscribe',
        description: 'Get exclusive offers & wellness tips'
      },
      copyright: `© ${currentYear} BioPara. All rights reserved. Premium Natural Wellness Worldwide.`,
      footerLinks: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Sitemap', href: '/sitemap' }
      ]
    },
    fr: {
      company: {
        name: 'BioPara',
        description: 'Produits de bien-être naturels premium livrés dans le monde entier. Du Maroc au monde, apportant le meilleur de la nature.',
        tagline: 'Fabriqué avec ❤️ au Maroc',
        madeIn: 'Fabriqué au Maroc'
      },
      navigation: {
        quickLinks: {
          title: 'Boutique',
          links: [
            { name: 'Notre Histoire', href: '/about' },
            { name: 'Tous les Produits', href: '/products' },
            { name: 'Marques', href: '/brands' },
            { name: 'Offres Spéciales', href: '/promotions' },
            { name: 'Nouveautés', href: '/new-arrivals' }
          ]
        },
        customerService: {
          title: 'Service Client',
          links: [
            { name: 'Infos Livraison', href: '/shipping' },
            { name: 'Moyens Paiement', href: '/payment' },
            { name: 'Retours & Échanges', href: '/returns' },
            { name: 'FAQ', href: '/faq' },
            { name: 'Guide Tailles', href: '/size-guide' },
            { name: 'Suivi Commande', href: '/track-order' }
          ]
        },
        contact: {
          title: 'Contactez-nous',
          phone: '+33 1 XXX XXX XXX',
          email: 'support@biopara.fr',
          address: 'Paris, France',
          hours: '24/7 Support Client'
        }
      },
      trustSignals: [
        { icon: <Shield className="w-5 h-5" />, title: 'Certifié ISO', description: 'Qualité Assurée' },
        { icon: <Award className="w-5 h-5" />, title: 'Certifié GMP', description: 'Bonne Fabrication' },
        { icon: <Globe className="w-5 h-5" />, title: '50+ Pays', description: 'Livraison Mondiale' },
        { icon: <Users className="w-5 h-5" />, title: '1M+ Clients', description: 'Confiance Mondiale' }
      ],
      paymentMethods: [
        { name: 'Visa', icon: '💳' },
        { name: 'MasterCard', icon: '💳' },
        { name: 'PayPal', icon: '💳' },
        { name: 'Apple Pay', icon: '🍎' },
        { name: 'Google Pay', icon: '🤖' }
      ],
      shippingInfo: [
        { country: 'Europe', time: '3-5 jours', price: 'Gratuit €50+' },
        { country: 'USA', time: '5-7 jours', price: 'Gratuit $75+' },
        { country: 'Golfe', time: '4-6 jours', price: 'Gratuit 250 AED+' },
        { country: 'Maroc', time: '1-2 jours', price: 'Gratuit 200 MAD+' }
      ],
      newsletter: {
        title: 'Newsletter Globale',
        placeholder: 'Votre email',
        button: 'S\'abonner',
        description: 'Offres exclusives & conseils bien-être'
      },
      copyright: `© ${currentYear} BioPara. Tous droits réservés. Bien-être Naturel Premium Mondial.`,
      footerLinks: [
        { name: 'Politique Confidentialité', href: '/privacy' },
        { name: 'Conditions Service', href: '/terms' },
        { name: 'Politique Cookies', href: '/cookies' },
        { name: 'Plan Site', href: '/sitemap' }
      ]
    }
  };

  const currentLang = localization[locale as keyof typeof localization] || localization.ar;

  // CSS Classes based on variant
  const getFooterClasses = () => {
    switch (variant) {
      case 'global':
        return "bg-neutral-dark text-neutral-white";
      case 'default':
        return "bg-gray-900 text-white";
      default:
        return "bg-gray-900 text-white";
    }
  };

  const getContainerClasses = () => {
    return variant === 'global' ? 'container mx-auto px-4' : 'container mx-auto px-4';
  };

  const getGridClasses = () => {
    switch (variant) {
      case 'global':
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8";
      case 'default':
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8";
    }
  };

  return (
    <footer className={getFooterClasses()} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Trust Signals Bar - Global Variant Only */}
      {showTrustSignals && variant === 'global' && (
        <div className="bg-emerald-700 py-4">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentLang.trustSignals.map((signal: { icon: React.ReactNode; title: string; description: string }, index: number) => (
                <div key={index} className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="text-emerald-200">{signal.icon}</div>
                  <div>
                    <div className="font-semibold text-sm">{signal.title}</div>
                    <div className="text-xs text-emerald-200">{signal.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className={getContainerClasses()}>
        <div className="py-12">
          <div className={getGridClasses()}>
            {/* Company Info */}
            <div className={variant === 'global' ? 'lg:col-span-2' : ''}>
              <div className="flex items-center gap-3 mb-4">
                {variant === 'global' ? (
                  <Image
                    src="/logo.png"
                    alt="BioPara"
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <img 
                    src="/images/logo.png" 
                    alt="BioPara Logo" 
                    className="w-10 h-10 object-contain"
                  />
                )}
                <span className="text-xl font-bold">{currentLang.company.name}</span>
              </div>
              <p className={`${variant === 'global' ? 'text-gray-300 mb-6 max-w-md' : 'text-gray-400 mb-4 leading-relaxed'}`}>
                {currentLang.company.description}
              </p>
              
              {/* Social Media */}
              <div className="flex gap-3 mb-6">
                <a href="#" className={`w-10 h-10 ${variant === 'global' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-800 hover:bg-emerald-600'} rounded-full flex items-center justify-center transition-colors`}>
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a href="#" className={`w-10 h-10 ${variant === 'global' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-800 hover:bg-emerald-600'} rounded-full flex items-center justify-center transition-colors`}>
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a href="#" className={`w-10 h-10 ${variant === 'global' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-800 hover:bg-emerald-600'} rounded-full flex items-center justify-center transition-colors`}>
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                {variant === 'global' && (
                  <a href="#" className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-500 transition-colors">
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                )}
                <a href="#" className={`w-10 h-10 ${variant === 'global' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-800 hover:bg-emerald-600'} rounded-full flex items-center justify-center transition-colors`}>
                  <Youtube className="w-5 h-5 text-white" />
                </a>
              </div>

              {/* Newsletter - Global Variant Only */}
              {showNewsletter && variant === 'global' && (
                <div className={`${variant === 'global' ? 'bg-emerald-800 p-4 rounded-lg' : 'bg-gray-800 p-4 rounded-lg'}`}>
                  <h4 className="font-semibold mb-2">{currentLang.newsletter.title}</h4>
                  <p className="text-sm text-gray-300 mb-3">{currentLang.newsletter.description}</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder={currentLang.newsletter.placeholder}
                      className={`flex-1 px-3 py-2 ${variant === 'global' ? 'bg-emerald-700 border-emerald-600' : 'bg-gray-700 border-gray-600'} rounded text-white placeholder-gray-300 focus:outline-none focus:border-emerald-400`}
                    />
                    <button className={`px-4 py-2 rounded ${variant === 'global' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-emerald-600 hover:bg-emerald-500'} transition-colors`}>
                      {currentLang.newsletter.button}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">{currentLang.navigation.quickLinks.title}</h3>
              <ul className="space-y-2">
                {currentLang.navigation.quickLinks.links.map((link: { name: string; href: string }, index: number) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className={`${variant === 'global' ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-400 hover:text-emerald-400'} transition-colors`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-bold text-lg mb-4">{currentLang.navigation.customerService.title}</h3>
              <ul className="space-y-2">
                {currentLang.navigation.customerService.links.map((link: { name: string; href: string }, index: number) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className={`${variant === 'global' ? 'text-gray-300 hover:text-emerald-400' : 'text-gray-400 hover:text-emerald-400'} transition-colors`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-lg mb-4">{currentLang.navigation.contact.title}</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className={`w-5 h-5 ${variant === 'global' ? 'text-emerald-400' : 'text-emerald-400'}`} />
                  <span className={variant === 'global' ? 'text-gray-300' : 'text-gray-400'}>{currentLang.navigation.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className={`w-5 h-5 ${variant === 'global' ? 'text-emerald-400' : 'text-emerald-400'}`} />
                  <span className={variant === 'global' ? 'text-gray-300' : 'text-gray-400'}>{currentLang.navigation.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className={`w-5 h-5 ${variant === 'global' ? 'text-emerald-400' : 'text-emerald-400'}`} />
                  <span className={variant === 'global' ? 'text-gray-300' : 'text-gray-400'}>{currentLang.navigation.contact.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${variant === 'global' ? 'text-emerald-400' : 'text-emerald-400'}`} />
                  <span className={variant === 'global' ? 'text-gray-300' : 'text-gray-400'}>{currentLang.navigation.contact.hours}</span>
                </div>
              </div>
            </div>

            {/* About Section - Global Variant Only */}
            {variant === 'global' && (
              <div>
                <h4 className="font-semibold text-lg mb-4">About</h4>
                <ul className="space-y-2">
                  <li><Link href="/about" className="text-gray-300 hover:text-emerald-400 transition-colors">Our Story</Link></li>
                  <li><Link href="/sustainability" className="text-gray-300 hover:text-emerald-400 transition-colors">Sustainability</Link></li>
                  <li><Link href="/certifications" className="text-gray-300 hover:text-emerald-400 transition-colors">Certifications</Link></li>
                  <li><Link href="/careers" className="text-gray-300 hover:text-emerald-400 transition-colors">Careers</Link></li>
                  <li><Link href="/press" className="text-gray-300 hover:text-emerald-400 transition-colors">Press</Link></li>
                  <li><Link href="/wholesale" className="text-gray-300 hover:text-emerald-400 transition-colors">Wholesale</Link></li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* International Shipping Info - Global Variant Only */}
        {showShippingInfo && variant === 'global' && (
          <div className="mt-12 pt-8 border-t border-gray-700">
            <h4 className="font-semibold text-lg mb-4 text-center">International Shipping</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {currentLang.shippingInfo.map((info: { country: string; time: string; price: string }, index: number) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg text-center">
                  <div className="font-semibold mb-1">{info.country}</div>
                  <div className="text-sm text-gray-300 mb-1">{info.time}</div>
                  <div className="text-emerald-400 font-medium">{info.price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods - Global Variant Only */}
        {showPaymentMethods && variant === 'global' && (
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-semibold mb-2">Secure Payment Methods</h4>
                <div className="flex gap-3">
                  {currentLang.paymentMethods.map((method: { name: string; icon: string }, index: number) => (
                    <div key={index} className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-sm">
                      {method.icon}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">SSL Secured Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">24/7 Customer Support</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer */}
      <div className={`border-t ${variant === 'global' ? 'border-gray-700' : 'border-gray-800'} mt-8 pt-8`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`${variant === 'global' ? 'text-gray-400' : 'text-gray-400'} text-sm`}>
            {currentLang.copyright}
          </p>
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="BioPara" className="w-5 h-5" />
            <span className={`${variant === 'global' ? 'text-gray-400' : 'text-gray-400'} text-sm`}>
              {currentLang.company.tagline}
            </span>
          </div>
          <div className="flex gap-6 text-sm">
            {currentLang.footerLinks.map((link: { name: string; href: string }, index: number) => (
              <Link key={index} href={link.href} className={`${variant === 'global' ? 'text-gray-400 hover:text-emerald-400' : 'text-gray-400 hover:text-emerald-400'} transition-colors`}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
