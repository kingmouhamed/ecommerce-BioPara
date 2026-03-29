'use client';

import { Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function CartDrawer() {
    const {
        isOpen,
        closeCart,
        items,
        removeItem,
        updateQuantity,
        getCartTotal
    } = useCartStore();

    // Prevent hydration mismatch errors caused by localStorage persistence
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    return (
        <Fragment>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 bottom-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                dir="rtl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-xl font-bold text-gray-900">سلة التسوق</h2>
                        <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-2.5 py-0.5 rounded-full">
                            {items.length}
                        </span>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <ShoppingBag className="w-20 h-20 mb-6 text-gray-200" />
                            <p className="text-xl font-bold text-gray-900 mb-2">سلة التسوق فارغة</p>
                            <p className="text-gray-500 text-center mb-6">لم تقم بإضافة أي منتجات طبيعية إلى سلتك بعد.</p>
                            <button
                                onClick={closeCart}
                                className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-100 transition-colors"
                            >
                                تصفح المنتجات
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-colors group">
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                            sizes="96px"
                                        />
                                    </div>

                                    <div className="flex flex-col flex-1 justify-between py-1">
                                        <div className="flex justify-between items-start">
                                            <Link
                                                href={`/products/${item.slug}`}
                                                onClick={closeCart}
                                                className="font-bold text-gray-900 hover:text-emerald-600 line-clamp-2 text-sm leading-tight pl-2"
                                            >
                                                {item.name}
                                            </Link>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-center mt-3">
                                            <span className="font-bold text-emerald-600 text-lg">
                                                {item.price.toFixed(2)} د.م
                                            </span>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-white rounded-md shadow-sm transition-colors"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-white rounded-md shadow-sm transition-colors disabled:opacity-40"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 p-6 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 font-medium">المجموع الفرعي</span>
                            <span className="text-2xl font-bold text-gray-900">
                                {getCartTotal().toFixed(2)} د.م
                            </span>
                        </div>

                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="w-full flex justify-center items-center py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
                        >
                            إتمام الطلب
                        </Link>

                        <button
                            onClick={closeCart}
                            className="w-full mt-3 py-3 text-gray-500 font-medium hover:text-gray-900 transition-colors"
                        >
                            متابعة التسوق
                        </button>
                    </div>
                )}
            </div>
        </Fragment>
    );
}
