"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Leaf,
  Droplets,
  Search
} from "lucide-react";

// --- 1. إعدادات مولد المنتجات (Product Generator Config) ---

interface Product {
  id: number;
  title: string;
  category: string;
  type: "para" | "herbal";
  price: number;
  oldPrice?: number;
  image: string;
  isNew?: boolean;
}

const brands = ["La Roche-Posay", "Vichy", "CeraVe", "Bioderma", "Nuxe", "Avène", "Mustela", "Eucerin", "SVR", "Filorga"];
const herbalBrands = ["BioOriental", "Atlas Herbs", "NatureBio", "ArganOil", "HerboristerieDuMaroc", "RacinesPure", "GreenLife"];

const paraTypes = ["Crème Hydratante", "Gel Nettoyant", "Sérum Anti-âge", "Ecran Solaire SPF50+", "Shampoing Fortifiant", "Lotion Tonique", "Eau Micellaire", "Baume Réparateur"];
const herbalTypes = ["Huile d'Argan Pure", "Miel d'Eucalyptus", "Tisane Digestion", "Savon Noir Beldi", "Ghassoul Naturel", "Huile de Pépin de Figue", "Gingembre Moulu", "Safran Taliouine"];

const paraCategories = ["Visage", "Corps", "Cheveux", "Hygiène", "Solaire", "Bébé & Maman"];
const herbalCategories = ["Huiles Essentielles", "Tisanes & Infusions", "Miel & Ruche", "Cosmétique Bio", "Compléments Bio"];

const productImages = [
  "https://picsum.photos/300/300?random=1",
  "https://picsum.photos/300/300?random=2",
  "https://picsum.photos/300/300?random=3",
  "https://picsum.photos/300/300?random=4",
  "https://picsum.photos/300/300?random=5",
  "https://picsum.photos/300/300?random=6",
  "https://picsum.photos/300/300?random=7",
  "https://picsum.photos/300/300?random=8"
];

// دالة توليد الأرقام والعناصر العشوائية
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// --- الدالة التي تنشئ 300 منتج ---
const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  let idCounter = 1;

  // 150 منتج بارافارماسيا
  for (let i = 0; i < 150; i++) {
    const brand = randomItem(brands);
    const type = randomItem(paraTypes);
    products.push({
      id: idCounter++,
      title: `${brand} ${type} - ${randomInt(50, 400)}ml`,
      category: randomItem(paraCategories),
      type: "para",
      price: parseFloat((Math.random() * 300 + 50).toFixed(2)),
      oldPrice: Math.random() > 0.5 ? parseFloat((Math.random() * 100 + 350).toFixed(2)) : undefined,
      image: productImages[i % 6],
      isNew: Math.random() > 0.8
    });
  }

  // 150 منتج أعشاب
  for (let i = 0; i < 150; i++) {
    const brand = randomItem(herbalBrands);
    const type = randomItem(herbalTypes);
    products.push({
      id: idCounter++,
      title: `${type} ${brand} - ${randomInt(100, 500)}g`,
      category: randomItem(herbalCategories),
      type: "herbal",
      price: parseFloat((Math.random() * 200 + 30).toFixed(2)),
      oldPrice: Math.random() > 0.3 ? parseFloat((Math.random() * 50 + 230).toFixed(2)) : undefined,
      image: productImages[randomInt(6, 7)],
      isNew: Math.random() > 0.8
    });
  }

  return products;
};

// --- 2. المكونات (Components) ---

const TopBar = () => (
  <div className="bg-gray-100 text-gray-600 text-xs py-2 px-4 hidden md:flex justify-between items-center border-b">
    <div className="flex gap-4">
      <span>Bienvenue chez BioPara</span>
      <span className="flex items-center gap-1"><Phone size={14}/> +212 600 000 000</span>
    </div>
    <div className="flex gap-4">
      <span>Livraison Gratuite à partir de 300 DHS</span>
      <Link href="/contact" className="hover:text-emerald-700">Contactez-nous</Link>
    </div>
  </div>
);

function Header({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <TopBar />
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <button type="button" onClick={onOpenMobileMenu} className="md:hidden p-2 rounded hover:bg-gray-100" aria-label="Ouvrir le menu mobile">
          <Menu size={22} className="text-gray-700" />
        </button>

        <Link href="/" className="shrink-0 flex items-center gap-2">
           {/* استبدل المسار أدناه بمسار اللوجو الخاص بك إذا كان مختلفاً */}
           <div className="w-10 h-10 bg-emerald-700 text-white rounded-full flex items-center justify-center font-bold text-xl">B</div>
        </Link>

        <div className="flex-1 max-w-2xl hidden md:flex relative">
          <input 
            type="text" 
            placeholder="Rechercher un produit, une marque..." 
            className="w-full border-2 border-emerald-600 rounded-l-md py-2.5 px-4 focus:outline-none"
          />
          <button className="bg-emerald-700 text-white px-6 rounded-r-md font-medium hover:bg-emerald-800 transition" aria-label="Rechercher">
            <Search size={20}/>
          </button>
        </div>

        <div className="flex items-center gap-6 text-gray-600">
          <Link href="/login" className="flex flex-col items-center hover:text-emerald-700 group">
            <User size={24} />
            <span className="text-xs mt-1 group-hover:underline">Compte</span>
          </Link>
          <Link href="/favorites" className="flex flex-col items-center hover:text-emerald-700 group">
            <Heart size={24} />
            <span className="text-xs mt-1 group-hover:underline">Favoris</span>
          </Link>
          <Link href="/cart" className="flex flex-col items-center hover:text-emerald-700 group relative">
            <div className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </div>
            <span className="text-xs mt-1 group-hover:underline">Panier</span>
          </Link>
        </div>
      </div>

      <nav className="bg-emerald-700 text-white hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-6 text-sm font-medium py-3 overflow-x-auto no-scrollbar">
            <li className="flex items-center gap-2 px-2 whitespace-nowrap"><Menu size={18}/> TOUS LES RAYONS</li>
            <li className="w-px h-4 bg-emerald-600 mx-2"></li>
            {paraCategories.slice(0, 4).map((cat) => (
              <li key={cat}><Link href={`/category/${cat.toLowerCase()}`} className="hover:text-emerald-200 uppercase whitespace-nowrap">{cat}</Link></li>
            ))}
            <li className="w-px h-4 bg-emerald-600 mx-2"></li>
            {herbalCategories.slice(0, 3).map((cat) => (
              <li key={cat}><Link href={`/category/${cat.toLowerCase()}`} className="hover:text-green-200 uppercase text-green-100 whitespace-nowrap">{cat}</Link></li>
            ))}
            <li className="ml-auto"><Link href="/promotions" className="text-orange-300 font-bold hover:text-white">PROMOTIONS</Link></li>
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
          <Link href="/" onClick={onClose} className="text-xl font-bold text-emerald-700">BioPara.ma</Link>
          <button aria-label="Fermer le menu" onClick={onClose}>
    <X size={22} />
</button>
        </div>
        <div className="mb-6"><input type="text" placeholder="Rechercher..." className="w-full border p-2 rounded" /></div>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-emerald-800 mb-2 border-b pb-1 flex gap-2"><Droplets size={16}/> Parapharmacie</h3>
            <ul className="space-y-2 pl-4 text-sm text-gray-700">
              {paraCategories.map(cat => <li key={cat}>{cat}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-green-700 mb-2 border-b pb-1 flex gap-2"><Leaf size={16}/> Herboristerie</h3>
            <ul className="space-y-2 pl-4 text-sm text-gray-700">
              {herbalCategories.map(cat => <li key={cat}>{cat}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-white border rounded-lg p-3 hover:shadow-lg transition group relative flex flex-col h-full">
    {product.isNew && <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10">NOUVEAU</span>}
    {product.oldPrice && (
      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded z-10">
        -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
      </span>
    )}
    
    <div className="relative mb-3 overflow-hidden h-40 flex items-center justify-center p-2">
      <Image src={product.image} alt={product.title} width={150} height={150} className="h-full object-contain group-hover:scale-105 transition duration-300" />
      <button className="absolute bottom-0 w-full bg-emerald-700 text-white py-2 translate-y-full group-hover:translate-y-0 transition duration-300 font-bold text-sm">
        AJOUTER
      </button>
    </div>

    <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-wide truncate">{product.category}</div>
    <h3 className="font-bold text-gray-800 text-xs sm:text-sm mb-2 line-clamp-2 min-h-[32px] leading-tight" title={product.title}>
      {product.title}
    </h3>

    <div className="flex flex-wrap items-end gap-2 mt-auto">
      <span className="text-base font-bold text-emerald-700">{product.price.toFixed(0)} DH</span>
      {product.oldPrice && <span className="text-xs text-gray-400 line-through mb-1">{product.oldPrice.toFixed(0)} DH</span>}
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white pt-12 pb-6 mt-12">
    <div className="container mx-auto px-4 text-center md:text-left grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h4 className="font-bold text-lg mb-4 text-emerald-400">BioPara.ma</h4>
        <p className="text-gray-400 text-sm">Votre expert en parapharmacie et phytothérapie au Maroc.</p>
      </div>
      <div>
        <h4 className="font-bold mb-4">Informations</h4>
        <ul className="text-sm text-gray-400 space-y-2">
          <li><Link href="/about">Qui sommes-nous ?</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Catégories</h4>
        <ul className="text-sm text-gray-400 space-y-2">
          <li>Visage</li>
          <li>Cheveux</li>
          <li>Huiles Bio</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Newsletter</h4>
        <div className="flex">
          <input type="email" placeholder="Email" className="bg-gray-700 text-white px-3 py-2 text-sm rounded-l w-full outline-none" />
          <button className="bg-emerald-600 px-3 rounded-r text-sm font-bold">OK</button>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-700 pt-6 mt-8 text-center text-xs text-gray-500">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-6 h-6 bg-emerald-700 text-white rounded-full flex items-center justify-center font-bold text-xs">B</div>
      </div>
      © 2026 BioPara. Tous droits réservés.
    </div>
  </footer>
);

// --- الصفحة الرئيسية ---
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // توليد المنتجات في useEffect لتجنب مشاكل الـ hydration
  useEffect(() => {
    const products = generateMockProducts();
    setAllProducts(products);
  }, []);

  // نأخذ عينة من المنتجات للعرض (مثلاً أول 8 من كل نوع)
  // يمكنك زيادة الرقم 8 إلى 20 أو 50 لعرض المزيد
  const displayPara = allProducts.filter(p => p.type === "para").slice(0, 8);
  const displayHerbal = allProducts.filter(p => p.type === "herbal").slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="ltr">
      <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main>
        {/* Hero Banner */}
        <div className="bg-gray-100 py-6">
          <div className="container mx-auto px-4">
             <div className="bg-emerald-100 rounded-xl overflow-hidden relative min-h-[300px] md:min-h-[400px] flex items-center justify-center text-center p-6 cursor-pointer group">
                <Image src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1200" alt="Banner" fill className="object-cover opacity-90 group-hover:scale-105 transition duration-700"/>
                <div className="relative z-10 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-lg border-l-4 border-emerald-600">
                   <h2 className="text-3xl md:text-5xl font-bold text-emerald-800 mb-2">Nature & Science</h2>
                   <p className="text-gray-700 mb-6 text-lg">Découvrez +300 produits authentiques pour votre bien-être.</p>
                   <button className="bg-emerald-700 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-800 transition shadow-lg">J&apos;EN PROFITE</button>
                </div>
             </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white border-b py-6 mb-8">
           <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center"><Truck className="text-emerald-600 mb-2"/><span className="text-xs font-bold text-gray-700">Livraison 24h</span></div>
              <div className="flex flex-col items-center"><ShieldCheck className="text-emerald-600 mb-2"/><span className="text-xs font-bold text-gray-700">Authentique</span></div>
              <div className="flex flex-col items-center"><CreditCard className="text-emerald-600 mb-2"/><span className="text-xs font-bold text-gray-700">Paiement Sécurisé</span></div>
              <div className="flex flex-col items-center"><Star className="text-emerald-600 mb-2"/><span className="text-xs font-bold text-gray-700">Service Client</span></div>
           </div>
        </div>

        {/* Parapharmacie Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-end mb-6">
            <div>
               <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                 <Droplets className="text-emerald-600"/> Parapharmacie
               </h2>
               <p className="text-sm text-gray-500">Les meilleures marques dermo-cosmétiques</p>
            </div>
            <Link href="/category/parapharmacie" className="text-emerald-700 font-bold text-sm hover:underline">Voir tout ({allProducts.filter(p=>p.type==='para').length})</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayPara.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        {/* Banner Separator */}
        <section className="container mx-auto px-4 py-8">
           <div className="bg-green-800 rounded-xl p-8 text-white text-center relative overflow-hidden">
              <div className="relative z-10">
                 <h2 className="text-3xl font-bold mb-2">L&apos;Univers Herboristerie</h2>
                 <p className="mb-4 text-green-100">Huiles pures, Miels, et Plantes médicinales.</p>
                 <button className="bg-white text-green-800 px-6 py-2 rounded-full font-bold hover:bg-green-50">Découvrir le Bio</button>
              </div>
              <Leaf className="absolute top-4 right-4 text-green-600 w-32 h-32 opacity-30"/>
           </div>
        </section>

        {/* Herbal Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-end mb-6">
            <div>
               <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                 <Leaf className="text-green-600"/> Herboristerie & Bio
               </h2>
               <p className="text-sm text-gray-500">Retour aux sources naturelles</p>
            </div>
            <Link href="/category/herboristerie" className="text-green-700 font-bold text-sm hover:underline">Voir tout ({allProducts.filter(p=>p.type==='herbal').length})</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayHerbal.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}