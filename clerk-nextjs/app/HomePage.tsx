"use client";

import React, { useState } from "react";
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
} from "lucide-react";

// --- البيانات التجريبية (Mock Data) ---
const categories = ["Visage", "Corps", "Cheveux", "Hygiène", "Bébé & Maman", "Hommes", "Solaire", "Bio"];

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    title: "La Roche-Posay Anthelios UVMune 400",
    category: "Solaire",
    price: 185.0,
    oldPrice: 220.0,
    image: "https://images.unsplash.com/photo-1556228720-19634e23387e?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 2,
    title: "Vichy Mineral 89 Booster Quotidien",
    category: "Visage",
    price: 210.0,
    oldPrice: 260.0,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 3,
    title: "CeraVe Gel Moussant 473ml",
    category: "Hygiène",
    price: 145.0,
    oldPrice: 180.0,
    image: "https://images.unsplash.com/photo-1556228578-8d85f5280b09?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 4,
    title: "Mustela Gel Lavant Doux",
    category: "Bébé",
    price: 95.0,
    oldPrice: 120.0,
    image: "https://images.unsplash.com/photo-1519681393784-d8e5b5a4570e?auto=format&fit=crop&q=80&w=300",
  },
];

// --- Components ---

const TopBar = () => (
  <div className="bg-gray-100 text-gray-600 text-xs py-2 px-4 hidden md:flex justify-between items-center border-b">
    <div className="flex gap-4">
      <span>Bienvenue chez BioPara</span>
      <span className="flex items-center gap-1">
        <Phone size={14} /> +212 600 000 000
      </span>
    </div>
    <div className="flex gap-4">
      <span>Livraison Gratuite à partir de 300 DHS</span>
      <Link href="/contact" className="cursor-pointer hover:text-emerald-700">Contactez-nous</Link>
    </div>
  </div>
);

function Header({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
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
        <Link href="/" className="text-3xl font-bold text-emerald-700 tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-700 text-white rounded-full flex items-center justify-center text-lg">B</div>
          BioPara<span className="text-gray-400 text-sm font-normal">.ma</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:flex relative">
          <input
            type="text"
            placeholder="Rechercher un produit, une marque..."
            className="w-full border-2 border-emerald-600 rounded-l-md py-2.5 px-4 focus:outline-none"
          />
          <button className="bg-emerald-700 text-white px-6 rounded-r-md font-medium hover:bg-emerald-800 transition">
            RECHERCHER
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-600">
          <Link href="/login" className="flex flex-col items-center cursor-pointer hover:text-emerald-700 group">
            <User size={24} />
            <span className="text-xs mt-1 group-hover:underline">Compte</span>
          </Link>

          <Link href="/favorites" className="flex flex-col items-center cursor-pointer hover:text-emerald-700 group">
            <Heart size={24} />
            <span className="text-xs mt-1 group-hover:underline">Favoris</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center cursor-pointer hover:text-emerald-700 group relative">
            <div className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </div>
            <span className="text-xs mt-1 group-hover:underline">Panier</span>
          </Link>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-emerald-700 text-white hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 text-sm font-medium py-3">
            <li>
              <Link href="/products" className="flex items-center gap-2 cursor-pointer hover:text-emerald-200">
                <Menu size={18} /> TOUS LES RAYONS
              </Link>
            </li>
            {categories.slice(0, 6).map((cat) => (
              <li key={cat}>
                <Link href={`/category/${cat.toLowerCase()}`} className="cursor-pointer hover:text-emerald-200 uppercase tracking-wide">
                  {cat}
                </Link>
              </li>
            ))}
            <li className="ml-auto">
              <Link href="/promotions" className="cursor-pointer text-orange-300 font-bold hover:text-white">PROMOTIONS</Link>
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

        <div className="space-y-2">
          <Link href="/login" onClick={onClose} className="flex items-center justify-between p-3 rounded hover:bg-emerald-50">
            <span className="flex items-center gap-2">
              <User size={18} /> Compte
            </span>
            <ChevronRight size={16} />
          </Link>

          <Link href="/favorites" onClick={onClose} className="flex items-center justify-between p-3 rounded hover:bg-emerald-50">
            <span className="flex items-center gap-2">
              <Heart size={18} /> Favoris
            </span>
            <ChevronRight size={16} />
          </Link>

          <Link href="/cart" onClick={onClose} className="flex items-center justify-between p-3 rounded hover:bg-emerald-50">
            <span className="flex items-center gap-2">
              <ShoppingCart size={18} /> Panier
            </span>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="mt-6">
          <h3 className="font-bold text-gray-800 mb-2">Catégories</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {categories.map((cat) => (
              <li key={cat}>
                <Link href={`/category/${cat.toLowerCase()}`} onClick={onClose} className="flex justify-between items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
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
  <div className="bg-gray-100 py-8">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Sidebar Menu */}
      <div className="hidden md:block col-span-1 bg-white rounded-md shadow-sm p-4">
        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Nos Catégories</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                href={`/category/${cat.toLowerCase()}`}
                className="flex justify-between items-center cursor-pointer hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded transition"
              >
                {cat} <ChevronRight size={14} />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Banner */}
      <div className="col-span-1 md:col-span-3 bg-emerald-100 rounded-md flex items-center justify-center min-h-[300px] relative overflow-hidden group cursor-pointer">
        <Image
          src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000&auto=format&fit=crop"
          alt="Promo"
          fill
          className="object-cover opacity-90 transition transform group-hover:scale-105"
          sizes="100vw"
        />
        <div className="relative z-10 bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center border-l-4 border-emerald-600">
          <h2 className="text-3xl font-bold text-emerald-800 mb-2">Promotions d'Hiver</h2>
          <p className="text-gray-700 mb-4">Jusqu&apos;à -50% sur les soins visage</p>
          <button className="bg-emerald-700 text-white px-6 py-2 rounded font-medium hover:bg-emerald-800">J&apos;EN PROFITE</button>
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

const ProductCard = ({ product }: { product: Product }) => (
  <div className="bg-white border rounded-lg p-4 hover:shadow-lg transition group relative">
    {product.oldPrice && (
      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
        -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
      </span>
    )}
    <div className="relative mb-4 overflow-hidden h-48 flex items-center justify-center">
      <Image src={product.image} alt={product.title} width={192} height={192} className="h-full object-contain group-hover:scale-105 transition duration-300" />
      <button className="absolute bottom-0 w-full bg-emerald-700 text-white py-2 translate-y-full group-hover:translate-y-0 transition duration-300 font-medium">
        AJOUTER AU PANIER
      </button>
    </div>

    <div className="text-xs text-gray-500 mb-1">{product.category}</div>
    <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2 min-h-[40px]" title={product.title}>
      {product.title}
    </h3>

    <div className="flex items-end gap-2 mt-2">
      <span className="text-lg font-bold text-emerald-700">{product.price.toFixed(2)} DH</span>
      {product.oldPrice && <span className="text-sm text-gray-400 line-through mb-1">{product.oldPrice.toFixed(2)} DH</span>}
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white pt-12 pb-6 mt-12">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div>
        <h4 className="font-bold text-lg mb-4 text-emerald-400">BioPara.ma</h4>
        <p className="text-gray-400 text-sm leading-relaxed">
          Votre parapharmacie en ligne de confiance au Maroc. Retrouvez les plus grandes marques aux meilleurs prix.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-4">Informations</h4>
        <ul className="text-sm text-gray-400 space-y-2">
          <li><Link href="/about" className="hover:text-white cursor-pointer">Qui sommes-nous ?</Link></li>
          <li><Link href="/delivery" className="hover:text-white cursor-pointer">Livraison et retour</Link></li>
          <li><Link href="/terms" className="hover:text-white cursor-pointer">Conditions générales</Link></li>
          <li><Link href="/contact" className="hover:text-white cursor-pointer">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Catégories</h4>
        <ul className="text-sm text-gray-400 space-y-2">
          {categories.slice(0, 4).map((cat) => (
            <li key={cat}>
              <Link href={`/category/${cat.toLowerCase()}`} className="hover:text-white cursor-pointer">
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4">Newsletter</h4>
        <p className="text-xs text-gray-400 mb-4">Inscrivez-vous pour recevoir nos promos.</p>
        <div className="flex">
          <input
            type="email"
            placeholder="Votre email"
            className="bg-gray-700 text-white px-3 py-2 text-sm rounded-l w-full focus:outline-none"
          />
          <button className="bg-emerald-600 px-4 py-2 rounded-r text-sm font-bold hover:bg-emerald-700">OK</button>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-700 pt-6 text-center text-xs text-gray-500">© 2026 BioPara. Tous droits réservés.</div>
  </footer>
);

// --- الصفحة الرئيسية ---
export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans" dir="ltr">
      <Header onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      <main>
        <HeroSection />
        <FeaturesStrip />

        <section className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-emerald-600 pl-3">Meilleures Ventes</h2>
            <a href="#" className="text-emerald-700 text-sm font-medium hover:underline">
              Voir tout
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-6">
          <div className="bg-emerald-800 rounded-lg p-8 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Nouveautés Bio &amp; Naturel</h2>
              <p className="mb-6 max-w-2xl mx-auto">
                Découvrez notre nouvelle gamme de produits 100% naturels pour le soin de votre peau.
              </p>
              <button className="bg-white text-emerald-800 px-8 py-3 rounded font-bold hover:bg-gray-100 transition">
                DÉCOUVRIR
              </button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
