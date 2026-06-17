"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';
import { useCart } from '@/contexts/CartContext';
import LiveSearch from '@/components/search/LiveSearch';
import {
    ShoppingCart, Menu, X, ChevronDown,
    Leaf, Heart, Truck, Shield, MessageCircle, UserSquare2
} from 'lucide-react';

const categories = [
    { slug: 'supplements', name: 'المكملات الغذائية', icon: '💊' },
    { slug: 'herbs', name: 'الأعشاب الطبية', icon: '🌿' },
    { slug: 'oils', name: 'الزيوت العلاجية', icon: '💧' },
    { slug: 'honey', name: 'العسل الطبيعي', icon: '🍯' }
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    setIsVisible(false); // Scroll down -> hide
                } else {
                    setIsVisible(true);  // Scroll up -> show
                }
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);
            return () => window.removeEventListener('scroll', controlNavbar);
        }
    }, [lastScrollY]);

    const { cartItemCount, setIsCartOpen } = useCart();
    const openCart = () => setIsCartOpen(true);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const closeMenus = () => {
        setCategoriesOpen(false);
        setMobileMenuOpen(false);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStartX;
        
        // If swiped right by more than 50px (closing the drawer in RTL context)
        if (diff > 50) {
            closeMenus();
            setTouchStartX(null);
        }
    };

    const handleTouchEnd = () => {
        setTouchStartX(null);
    };

    return (
        <>
            {/* Trust Bar */}
            <div className="bg-emerald-600 text-white py-2 px-4 shadow-sm relative z-50">
                <div className="container mx-auto flex flex-wrap justify-center sm:justify-between items-center gap-2 text-xs sm:text-sm">
                    <div className="hidden sm:flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4" />
                            <span>توصيل سريع خلال 24 ساعة</span>
                        </div>
                        <div className="flex items-center gap-2 border-r border-emerald-500 pr-6">
                            <Shield className="w-4 h-4" />
                            <span>دفع عند الاستلام</span>
                        </div>
                        <div className="flex items-center gap-2 border-r border-emerald-500 pr-6">
                            <Leaf className="w-4 h-4" />
                            <span>منتجات طبيعية 100%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/track-order" className="flex items-center gap-1.5 text-white hover:text-yellow-300 transition-colors bg-white/25 hover:bg-white/35 border border-white/40 px-4 py-1.5 rounded-full font-bold ml-4 shadow-sm">
                            <Truck className="w-4 h-4" />
                            <span className="text-sm">تتبع طلبي</span>
                        </Link>
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline" dir="rtl">دعم مباشر عبر واتساب: <span dir="ltr">06 73 02 02 64</span></span>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <header className={`bg-white shadow-md sticky top-0 z-40 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link href="/" onClick={closeMenus} className="flex items-center space-x-2 space-x-reverse flex-shrink-0">
                            <Image
                                src="/images/logo.png"
                                alt="BioPara"
                                width={48}
                                height={48}
                                className="rounded-xl shadow-sm"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                            <span className="text-2xl font-bold bg-gradient-to-l from-emerald-600 to-green-500 bg-clip-text text-transparent">BioPara</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8 mr-8">
                            <Link href="/" className="text-gray-900 hover:text-emerald-600 transition-colors font-bold">الرئيسية</Link>

                            {/* Categories Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setCategoriesOpen(true)}
                                onMouseLeave={() => setCategoriesOpen(false)}
                            >
                                <button
                                    className="flex items-center gap-1 text-gray-900 hover:text-emerald-600 transition-colors font-bold py-2"
                                    onClick={() => router.push('/products')}
                                >
                                    المنتجات
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                <div
                                    className={`absolute top-full right-0 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 transition-all duration-200 transform origin-top ${categoriesOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                                        }`}
                                >
                                    {categories.map((category) => (
                                        <Link
                                            key={category.slug}
                                            href={`/products?category=${category.slug}`}
                                            className="flex items-center gap-3 px-5 py-3 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-colors"
                                            onClick={closeMenus}
                                        >
                                            <span className="text-xl">{category.icon}</span>
                                            <span className="font-medium">{category.name}</span>
                                        </Link>
                                    ))}
                                    <div className="border-t border-gray-100 my-2"></div>
                                    <Link
                                        href="/products"
                                        className="flex justify-center px-5 py-2 text-emerald-600 font-bold hover:text-emerald-700 transition-colors text-sm"
                                        onClick={closeMenus}
                                    >
                                        عرض كل المنتجات &larr;
                                    </Link>
                                </div>
                            </div>

                            <Link href="/blog" className="text-gray-900 hover:text-emerald-600 transition-colors font-bold">المدونة</Link>
                            <Link href="/about" className="text-gray-900 hover:text-emerald-600 transition-colors font-bold">من نحن</Link>
                            <Link href="/contact" className="text-gray-900 hover:text-emerald-600 transition-colors font-bold">اتصل بنا</Link>
                        </nav>

                        {/* Search Bar (Desktop) */}
                        <div className="hidden lg:flex items-center flex-1 max-w-sm mx-10">
                            <LiveSearch />
                        </div>

                        {/* Desktop & Mobile Actions */}
                        <div className="flex items-center gap-3">
                            {/* Wishlist Mobile/Desktop */}
                            <Link href="/wishlist" className="hidden sm:flex items-center justify-center relative bg-gray-100 text-gray-800 rounded-full border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm min-w-[44px] min-h-[44px]">
                                <Heart className="w-5 h-5" />
                            </Link>

                            {/* Cart */}
                            <button onClick={openCart} className="relative flex items-center justify-center bg-gray-100 text-gray-800 rounded-full border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm min-w-[44px] min-h-[44px]">
                                <ShoppingCart className="w-5 h-5" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce border border-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>

                            {/* Auth Buttons */}
                            <div className="hidden sm:block">
                                <SignedIn>
                                    <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-emerald-100" } }} />
                                </SignedIn>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-md shadow-emerald-200">
                                            <UserSquare2 className="w-5 h-5" />
                                            <span>تسجيل الدخول</span>
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden flex items-center justify-center bg-gray-100 text-gray-800 rounded-full border border-gray-200 focus:outline-none hover:bg-emerald-50 hover:text-emerald-600 shadow-sm min-w-[44px] min-h-[44px]"
                                aria-label="القائمة"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-600" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    <div className="lg:hidden pb-4">
                        <div className="relative w-full z-40">
                            <LiveSearch />
                        </div>
                    </div>
                </div>
            </header>

            {/* Announcement Bar */}
            <div className="bg-emerald-50 border-b border-emerald-100 py-2 hidden sm:block">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-emerald-800 text-sm font-bold flex items-center justify-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        توصيل مجاني للطلبات فوق 200 درهم | التوصيل خلال 2-4 أيام عمل
                    </p>
                </div>
            </div>

            {/* Mobile Sidebar Menu */}
            <div className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={closeMenus}>
                <div
                    className={`fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out transform overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={e => e.stopPropagation()}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-2xl font-bold text-emerald-700">القائمة</span>
                            <button onClick={closeMenus} className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"><X className="w-5 h-5" /></button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-col gap-4 border-b border-gray-100 pb-6">
                                <Link href="/" onClick={closeMenus} className="text-lg font-medium text-gray-800 hover:text-emerald-600">الرئيسية</Link>
                                <Link href="/products" onClick={closeMenus} className="text-lg font-medium text-gray-800 hover:text-emerald-600 flex items-center justify-between">
                                    المنتجات
                                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">الكل</span>
                                </Link>

                                {/* Categories indented */}
                                <div className="pr-4 flex flex-col gap-3 border-r-2 border-emerald-100 mr-2">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.slug}
                                            href={`/products?category=${category.slug}`}
                                            className="text-gray-600 hover:text-emerald-600 flex items-center gap-2"
                                            onClick={closeMenus}
                                        >
                                            <span>{category.icon}</span>
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 border-b border-gray-100 pb-6">
                                <Link href="/blog" onClick={closeMenus} className="text-lg font-medium text-gray-800 hover:text-emerald-600">المدونة</Link>
                                <Link href="/about" onClick={closeMenus} className="text-lg font-medium text-gray-800 hover:text-emerald-600">من نحن</Link>
                                <Link href="/contact" onClick={closeMenus} className="text-lg font-medium text-gray-800 hover:text-emerald-600">اتصل بنا</Link>
                                <Link href="/track-order" onClick={closeMenus} className="text-lg font-bold text-gray-800 hover:text-emerald-600 flex items-center gap-2">تتبع الطلب <Truck className="w-4 h-4 text-emerald-600" /></Link>
                                <Link href="/wishlist" onClick={closeMenus} className="text-lg font-medium text-gray-800 hover:text-emerald-600 flex items-center gap-2">المفضلة <Heart className="w-4 h-4 text-red-500" /></Link>
                            </div>

                            <div className="pt-2">
                                <SignedIn>
                                    <div className="flex flex-col gap-4">
                                        <span className="text-gray-500 text-sm">حسابك</span>
                                        <UserButton appearance={{ elements: { userButtonBox: "flex-row-reverse" } }} showName={true} />
                                    </div>
                                </SignedIn>
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-xl hover:bg-emerald-700 font-bold">
                                            <UserSquare2 className="w-5 h-5" />
                                            تسجيل الدخول
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
