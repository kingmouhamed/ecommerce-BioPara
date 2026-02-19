"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Phone, MessageCircle, User, ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "../../contexts/CartContext";

type NavCategory = {
  id: string;
  label: string;
};

interface CategoryHeaderProps {
  categoryKey: "medical-herbs";
  categoryLabel: string;
  navCategories: NavCategory[];
  query: string;
  onQueryChange: (value: string) => void;
  cartItemCount: number;
  phoneNumber: string;
  whatsappNumber: string;
}

export default function CategoryHeader({
  categoryKey,
  categoryLabel,
  navCategories,
  query,
  onQueryChange,
  cartItemCount,
  phoneNumber,
  whatsappNumber
}: CategoryHeaderProps) {
  const { cart, calculateTotal } = useCart();
  const router = useRouter();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const cartDropdownRef = useRef<HTMLDivElement | null>(null);

  const waHref = useMemo(() => {
    const normalized = whatsappNumber.replace(/\s+/g, "").replace(/^\+/, "");
    return `https://wa.me/${normalized}`;
  }, [whatsappNumber]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams();
    params.set("category", categoryKey);
    if (trimmed) params.set("search", trimmed);
    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => {
    if (!isCartDropdownOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartDropdownOpen(false);
    };

    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!cartDropdownRef.current) return;
      if (cartDropdownRef.current.contains(target)) return;
      setIsCartDropdownOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
    };
  }, [isCartDropdownOpen]);

  const NavLinks = (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsCategoriesOpen((v) => !v);
            setIsInfoOpen(false);
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
          aria-haspopup="menu"
          aria-expanded={isCategoriesOpen}
        >
          الأقسام
          <ChevronDown className="w-4 h-4" />
        </button>
        {isCategoriesOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 z-50">
            {navCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${categoryKey}&section=${cat.id}`}
                className="block px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                onClick={() => {
                  setIsCategoriesOpen(false);
                  setIsMobileMenuOpen(false);
                }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link
        href={`/products?category=${categoryKey}`}
        className="text-sm font-semibold text-gray-700 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {categoryLabel}
      </Link>

      <Link
        href="/promotions"
        className="text-sm font-semibold text-gray-700 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        العروض
      </Link>

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setIsInfoOpen((v) => !v);
            setIsCategoriesOpen(false);
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
          aria-haspopup="menu"
          aria-expanded={isInfoOpen}
        >
          معلومات
          <ChevronDown className="w-4 h-4" />
        </button>
        {isInfoOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 z-50">
            <Link
              href="/delivery"
              className="block px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              onClick={() => {
                setIsInfoOpen(false);
                setIsMobileMenuOpen(false);
              }}
            >
              التوصيل
            </Link>
            <Link
              href="/payment"
              className="block px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              onClick={() => {
                setIsInfoOpen(false);
                setIsMobileMenuOpen(false);
              }}
            >
              طرق الدفع
            </Link>
            <Link
              href="/faq"
              className="block px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              onClick={() => {
                setIsInfoOpen(false);
                setIsMobileMenuOpen(false);
              }}
            >
              الأسئلة الشائعة
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              onClick={() => {
                setIsInfoOpen(false);
                setIsMobileMenuOpen(false);
              }}
            >
              اتصل بنا
            </Link>
          </div>
        )}
      </div>
    </>
  );

  const CartButton = (
    <div className="relative" ref={cartDropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsCartDropdownOpen((v) => !v);
          setIsCategoriesOpen(false);
          setIsInfoOpen(false);
          setIsMobileMenuOpen(false);
        }}
        className="relative inline-flex items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="السلة"
        aria-haspopup="dialog"
        aria-expanded={isCartDropdownOpen}
      >
        <ShoppingCart className="w-5 h-5 text-gray-700" />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -left-2 min-w-6 h-6 px-1 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </button>

      {isCartDropdownOpen && (
        <div className="absolute left-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-2xl shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="text-sm font-extrabold text-gray-900">سلة التسوق</div>
            <div className="text-xs text-gray-500 mt-1">عدد المنتجات: {cartItemCount}</div>
          </div>

          <div className="max-h-72 overflow-auto">
            {cart.length === 0 ? (
              <div className="p-4 text-sm text-gray-600">سلتك فارغة حالياً.</div>
            ) : (
              <div className="p-3 space-y-2">
                {cart
                  .slice(-3)
                  .reverse()
                  .map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-2">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-gray-900 truncate">{item.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">الكمية: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-extrabold text-gray-900 whitespace-nowrap">{(item.price * item.quantity).toFixed(2)} DH</div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="text-sm font-semibold text-gray-700">الإجمالي</div>
              <div className="text-sm font-extrabold text-gray-900">{calculateTotal()} DH</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/cart"
                className="h-11 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors inline-flex items-center justify-center text-sm font-bold text-gray-900"
                onClick={() => setIsCartDropdownOpen(false)}
              >
                السلة
              </Link>
              <Link
                href="/checkout"
                className="h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 transition-colors inline-flex items-center justify-center text-sm font-bold text-white"
                onClick={() => setIsCartDropdownOpen(false)}
              >
                إتمام الطلب
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-4 text-gray-700">
            <a href={`tel:${phoneNumber.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2 hover:text-emerald-600 transition-colors">
              <Phone className="w-4 h-4" />
              <span>{phoneNumber}</span>
            </a>
            <a href={waHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-emerald-600 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>واتساب</span>
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <Link href="/auth/login" className="text-gray-700 hover:text-emerald-600 transition-colors inline-flex items-center gap-2">
              <User className="w-4 h-4" />
              تسجيل الدخول
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/auth/signup" className="text-gray-700 hover:text-emerald-600 transition-colors">
              التسجيل
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="text-2xl font-extrabold text-gray-900 tracking-tight">
              BioPara
            </Link>

            <div className="flex items-center gap-2 lg:hidden">
              {CartButton}

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="inline-flex items-center justify-center w-11 h-11 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <form onSubmit={submitSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="ابحث داخل هذا القسم..."
                className="w-full h-12 pr-12 pl-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </form>

          <div className="hidden lg:block">{CartButton}</div>
        </div>
      </div>

      <div className="border-t">
        <div className="container mx-auto px-4">
          <nav className="hidden lg:flex items-center gap-2 py-3">
            {NavLinks}
          </nav>

          {isMobileMenuOpen && (
            <nav className="lg:hidden py-3 space-y-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500">روابط</div>
                  <Link
                    href={`/products?category=${categoryKey}`}
                    className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {categoryLabel}
                  </Link>
                  <Link
                    href="/promotions"
                    className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    العروض
                  </Link>
                  <Link
                    href="/delivery"
                    className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    التوصيل
                  </Link>
                  <Link
                    href="/payment"
                    className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    طرق الدفع
                  </Link>
                  <Link
                    href="/faq"
                    className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    الأسئلة الشائعة
                  </Link>
                  <Link
                    href="/contact"
                    className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    اتصل بنا
                  </Link>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500">الأقسام</div>
                  {navCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products?category=${categoryKey}&section=${cat.id}`}
                      className="px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-3 px-3 pt-2">
                  <Link
                    href="/auth/login"
                    className="text-sm font-semibold text-gray-700 hover:text-emerald-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    تسجيل الدخول
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link
                    href="/auth/signup"
                    className="text-sm font-semibold text-gray-700 hover:text-emerald-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    التسجيل
                  </Link>
                </div>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
