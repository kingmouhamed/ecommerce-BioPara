"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../contexts/CartContext";
import {
  ShoppingCart,
  User,
  Heart,
  Phone,
  Menu,
  X,
  ChevronRight,
  Truck,
  ShieldCheck,
  CreditCard,
  Star,
  Leaf, // أيقونة للأعشاب
  Droplets // أيقونة للبارا
} from "lucide-react";

// --- تقسيم البيانات (Data Separation) ---

// تصنيفات البارافارماسيا
const paraCategories = [
  "Visage", "Corps", "Cheveux", "Hygiène", "Bébé & Maman", "Solaire", "Hommes"
];

// تصنيفات الأعشاب والبيو
const herbalCategories = [
  "Huiles Essentielles", "Tisanes & Infusions", "Miel & Ruche", "Compléments Bio", "Cosmétique Bio"
];

interface Product {
  id: number;
  title: string;
  category: string;
  type: "para" | "herbal"; // لتحديد نوع المنتج
  price: number;
  oldPrice?: number;
  image: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    title: "La Roche-Posay Anthelios UVMune 400",
    category: "Solaire",
    type: "para",
    price: 185.0,
    oldPrice: 220.0,
    image: "https://images.unsplash.com/photo-1556228720-19634e23387e?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 2,
    title: "Huile d'Argan Bio Pure - 100ml",
    category: "Huiles Essentielles",
    type: "herbal",
    price: 120.0,
    oldPrice: 150.0,
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&q=80&w=300", // صورة زيت
  },
  {
    id: 3,
    title: "CeraVe Gel Moussant 473ml",
    category: "Hygiène",
    type: "para",
    price: 145.0,
    oldPrice: 180.0,
    image: "https://images.unsplash.com/photo-1556228578-8d85f5280b09?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 4,
    title: "Miel d'Eucalyptus Pur - 500g",
    category: "Miel & Ruche",
    type: "herbal",
    price: 180.0,
    oldPrice: 200.0,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=300", // صورة عسل
  },
];

// --- Components ---

const TopBar = () => (
  <div className="bg-gray-100 text-gray-600 text-xs py-2 px-4 hidden md:flex justify-between items-center border-b" dir="rtl">
    <div className="flex gap-4">
      <Link href="/routes" className="hover:text-emerald-700">خريطة الموقع</Link>
      <span className="flex items-center gap-1">
        <Phone size={14} /> +212 600 000 000
      </span>
    </div>
    <div className="flex gap-4">
      <span>شحن مجاني للطلبات فوق 300 درهم</span>
      <Link href="/contact" className="hover:text-emerald-700">اتصل بنا</Link>
    </div>
  </div>
);

function Header({ onOpenMobileMenu, cartItemCount }: { onOpenMobileMenu: () => void; cartItemCount: number }) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <TopBar />

      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Left: Mobile menu button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu size={22} className="text-gray-700" />
        </button>

        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-2">
          <Leaf className="w-8 h-8 text-emerald-700" />
          <span className="text-2xl font-bold text-emerald-700">BioPara</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:flex relative">
          <input
            type="text"
            placeholder="ابحث عن: فيتامين سي، زيت الأركان..."
            className="w-full border-2 border-emerald-600 rounded-r-md py-2.5 px-4 focus:outline-none text-right"
          />
          <button className="bg-emerald-700 text-white px-6 rounded-l-md font-medium hover:bg-emerald-800 transition">
            بحث
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-600">
          <Link href="/login" className="flex flex-col items-center hover:text-emerald-700 group">
            <User size={24} />
            <span className="text-xs mt-1 group-hover:underline">حسابي</span>
          </Link>

          <Link href="/favorites" className="flex flex-col items-center hover:text-emerald-700 group">
            <Heart size={24} />
            <span className="text-xs mt-1 group-hover:underline">المفضلة</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center hover:text-emerald-700 group relative">
            <div className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            </div>
            <span className="text-xs mt-1 group-hover:underline">السلة</span>
          </Link>
        </div>
      </div>

      {/* Navigation Bar - مقسمة بوضوح */}
      <nav className="bg-emerald-700 text-white hidden md:block" dir="rtl">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 text-sm font-medium py-3">
            <li>
              <Link href="/products" className="flex items-center gap-2 hover:text-emerald-200 font-bold">
                <Menu size={18} /> كل الأقسام
              </Link>
            </li>
            
            {/* قسم البارافارماسيا */}
            <li className="flex items-center gap-1 opacity-80 px-2 border-r border-emerald-600 pr-4">
                <Droplets size={16} className="text-emerald-300"/> <span className="text-xs uppercase tracking-wider text-emerald-200">شبه صيدلية</span>
            </li>
            {paraCategories.slice(0, 3).map((cat) => (
              <li key={cat}>
                <Link href={`/category/${cat.toLowerCase()}`} className="hover:text-emerald-200 uppercase tracking-wide">
                  {cat}
                </Link>
              </li>
            ))}

             {/* قسم الأعشاب */}
            <li className="flex items-center gap-1 opacity-80 px-2 border-r border-emerald-600 pr-4">
                <Leaf size={16} className="text-green-300"/> <span className="text-xs uppercase tracking-wider text-green-200">الأعشاب</span>
            </li>
            {herbalCategories.slice(0, 2).map((cat) => (
               <li key={cat}>
               <Link href={`/category/${cat.toLowerCase()}`} className="hover:text-emerald-200 uppercase tracking-wide">
                 {cat}
               </Link>
             </li>
            ))}

            <li className="mr-auto">
              <Link href="/promotions" className="text-orange-300 font-bold hover:text-white">العروض</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl p-4 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" onClick={onClose} className="text-xl font-bold text-emerald-700">
            BioPara.ma
          </Link>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="mt-6">
          {/* قسم البارا في الموبايل */}
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 border-b pb-2">
            <Droplets size={18} className="text-blue-500"/> Parapharmacie
          </h3>
          <ul className="space-y-1 text-sm text-gray-700 mb-6 pl-4">
            {paraCategories.map((cat) => (
              <li key={cat}>
                <Link href={`/category/${cat.toLowerCase()}`} onClick={onClose} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                  {cat} <ChevronRight size={14} />
                </Link>
              </li>
            ))}
          </ul>

          {/* قسم الأعشاب في الموبايل */}
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 border-b pb-2">
             <Leaf size={18} className="text-green-600"/> Herboristerie & Bio
          </h3>
          <ul className="space-y-1 text-sm text-gray-700 pl-4">
            {herbalCategories.map((cat) => (
              <li key={cat}>
                <Link href={`/category/${cat.toLowerCase()}`} onClick={onClose} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                  {cat} <ChevronRight size={14} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const HeroSection = () => (
  <div className="bg-gray-100 py-8" dir="rtl">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Sidebar Menu */}
      <div className="hidden md:block col-span-1 bg-white rounded-md shadow-sm p-4 h-full">
        
        {/* Parapharmacie Section */}
        <div className="mb-6">
            <h3 className="font-bold text-emerald-800 mb-3 border-b pb-2 flex items-center gap-2">
                <Droplets size={16}/> شبه صيدلية
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
            {paraCategories.map((cat) => (
                <li key={cat}>
                <Link
                    href={`/category/${cat.toLowerCase()}`}
                    className="flex justify-between items-center hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded transition"
                >
                    <span>{cat}</span> <ChevronRight size={14} />
                </Link>
                </li>
            ))}
            </ul>
        </div>

        {/* Herboristerie Section */}
        <div>
            <h3 className="font-bold text-green-700 mb-3 border-b pb-2 flex items-center gap-2">
                <Leaf size={16}/> الأعشاب والمنتجات الطبيعية
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
            {herbalCategories.map((cat) => (
                <li key={cat}>
                <Link
                    href={`/category/${cat.toLowerCase()}`}
                    className="flex justify-between items-center hover:text-green-700 hover:bg-green-50 p-2 rounded transition"
                >
                    <span>{cat}</span> <ChevronRight size={14} />
                </Link>
                </li>
            ))}
            </ul>
        </div>

      </div>

      {/* Main Banner */}
      <div className="col-span-1 md:col-span-3 bg-emerald-100 rounded-md flex items-center justify-center min-h-[400px] relative overflow-hidden group cursor-pointer">
        <Image
          src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop"
          alt="Promo"
          fill
          className="object-cover opacity-90 transition transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 75vw"
          priority
        />
        <div className="relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center border-r-4 border-emerald-600 max-w-md">
          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">جديد</span>
          <h2 className="text-4xl font-bold text-emerald-800 mb-2">الطبيعة والعلم</h2>
          <p className="text-gray-700 mb-6 text-lg">اكتشف أفضل ما في المنتجات شبه الصيدلية والعلاجات الطبيعية بنقرة واحدة.</p>
          <div className="flex gap-4 justify-center">
             <button className="bg-emerald-700 text-white px-6 py-2 rounded font-medium hover:bg-emerald-800">
                منتجات شبه صيدلية
            </button>
             <button className="bg-white text-emerald-700 border border-emerald-700 px-6 py-2 rounded font-medium hover:bg-emerald-50">
                منتجات طبيعية
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FeaturesStrip = () => (
  <div className="bg-white border-b py-6">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-center divide-x divide-gray-100">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <Truck />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">Livraison Rapide</h4>
        <p className="text-xs text-gray-500">Partout au Maroc en 24/48h</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <ShieldCheck />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">Produits Authentiques</h4>
        <p className="text-xs text-gray-500">100% garantis par nos labos</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <CreditCard />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">Paiement Sécurisé</h4>
        <p className="text-xs text-gray-500">Carte bancaire ou à la livraison</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
          <Star />
        </div>
        <h4 className="font-bold text-gray-800 text-sm">Service Client</h4>
        <p className="text-xs text-gray-500">Disponible 7j/7 pour vous</p>
      </div>
    </div>
  </div>
);

const ProductCard = ({ product, addToCart }: { product: Product; addToCart: (product: Product) => void }) => (
  <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition group relative flex flex-col h-full" dir="rtl">
    {/* Badge نوع المنتج */}
    <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded text-white z-10 ${product.type === 'herbal' ? 'bg-green-600' : 'bg-blue-600'}`}>
        {product.type === 'herbal' ? 'طبيعي / عضوي' : 'شبه صيدلية'}
    </span>

    {product.oldPrice && (
      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
        -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
      </span>
    )}
    <div className="relative mb-4 overflow-hidden h-48 flex items-center justify-center">
      <Image src={product.image} alt={product.title} width={192} height={192} className="h-full object-contain group-hover:scale-105 transition duration-300" />
      <button
        onClick={() => addToCart(product)}
        className="absolute bottom-0 w-full bg-emerald-700 text-white py-2 translate-y-full group-hover:translate-y-0 transition duration-300 font-medium"
      >
        أضف إلى السلة
      </button>
    </div>

    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide text-right">{product.category}</div>
    <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 min-h-[40px] text-right" title={product.title}>
      {product.title}
    </h3>

    <div className="flex items-end gap-2 mt-auto justify-end">
      <span className="text-lg font-bold text-emerald-700">{product.price.toFixed(2)} د.م</span>
      {product.oldPrice && <span className="text-sm text-gray-400 line-through mb-1">{product.oldPrice.toFixed(2)} د.م</span>}
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white pt-12 pb-6 mt-12" dir="rtl">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-right">
      <div>
        <h4 className="font-bold text-lg mb-4 text-emerald-400">BioPara.ma</h4>
        <p className="text-gray-400 text-sm leading-relaxed">
          خبيرك في المنتجات شبه الصيدلية والعلاج بالنباتات في المغرب. التحالف المثالي بين العلم والطبيعة.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-4">معلومات</h4>
        <ul className="text-sm text-gray-400 space-y-2">
          <li><Link href="/about" className="hover:text-white">من نحن؟</Link></li>
          <li><Link href="/delivery" className="hover:text-white">التوصيل والإرجاع</Link></li>
          <li><Link href="/terms" className="hover:text-white">الشروط العامة</Link></li>
          <li><Link href="/contact" className="hover:text-white">اتصل بنا</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">أقسامنا</h4>
        <ul className="text-sm text-gray-400 space-y-2">
          <li className="font-bold text-white mt-2">شبه صيدلية</li>
          {paraCategories.slice(0, 3).map((cat) => (
            <li key={cat}><Link href={`/category/${cat.toLowerCase()}`} className="hover:text-emerald-300 mr-2">- {cat}</Link></li>
          ))}
          <li className="font-bold text-white mt-2">الأعشاب</li>
          {herbalCategories.slice(0, 3).map((cat) => (
            <li key={cat}><Link href={`/category/${cat.toLowerCase()}`} className="hover:text-green-300 mr-2">- {cat}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">النشرة الإخبارية</h4>
        <p className="text-xs text-gray-400 mb-4">اشترك لتلقي عروضنا.</p>
        <div className="flex">
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            className="bg-gray-700 text-white px-3 py-2 text-sm rounded-r w-full focus:outline-none text-right"
          />
          <button className="bg-emerald-600 px-4 py-2 rounded-l text-sm font-bold hover:bg-emerald-700">موافق</button>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">© 2026 BioPara. جميع الحقوق محفوظة.</div>
  </footer>
);

// --- الصفحة الرئيسية ---
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { addToCart, cartItemCount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} cartItemCount={cartItemCount} />
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main>
        <HeroSection />
        <FeaturesStrip />

        {/* Section: Top Parapharmacie */}
        <section className="container mx-auto px-4 py-12" dir="rtl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-emerald-600 pr-3">
                الأكثر مبيعاً في شبه الصيدلية
            </h2>
            <Link href="/products" className="text-emerald-700 text-sm font-medium hover:underline">
              عرض الكل
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {mockProducts.filter(p => p.type === 'para').map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </section>

        {/* Banner فاصل */}
        <section className="container mx-auto px-4 py-6" dir="rtl">
          <div className="bg-green-800 rounded-lg p-8 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 flex justify-center items-center gap-3">
                 <Leaf size={32}/> عالم الأعشاب والمنتجات الطبيعية
              </h2>
              <p className="mb-6 max-w-2xl mx-auto">
                زيوت عطرية نقية، أعسال نادرة ونباتات طبية. قوة الطبيعة في خدمتك.
              </p>
              <Link href="/products">
                <button className="bg-white text-green-800 px-8 py-3 rounded font-bold hover:bg-gray-100 transition">
                  اكتشف المنتجات الطبيعية
                </button>
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
          </div>
        </section>

        {/* Section: Top Herboristerie */}
        <section className="container mx-auto px-4 py-12" dir="rtl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-green-600 pr-3">
                مختارات طبيعية وعضوية
            </h2>
            <Link href="/category/herboristerie" className="text-green-700 text-sm font-medium hover:underline">
              عرض الكل
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {mockProducts.filter(p => p.type === 'herbal').map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}