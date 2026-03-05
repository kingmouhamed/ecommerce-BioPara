"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Eye, ArrowLeft, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductSkeleton from '../ui/ProductSkeleton';
import { Product } from '@/lib/data/products';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '../ui/Toast';

export default function BestSellers() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { addToast } = useToast();

    useEffect(() => {
        async function loadBestSellers() {
            try {
                const response = await fetch('/api/products?limit=8');
                const result = await response.json();
                if (result.success && result.data?.products) {
                    setProducts(result.data.products);
                }
            } catch (error) {
                console.error("Failed to load best sellers", error);
            } finally {
                setLoading(false);
            }
        }
        loadBestSellers();
    }, []);

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart({
            id: product.id,
            title: product.name_ar || product.name,
            price: product.price,
            image: (product.images && product.images.length > 0) ? product.images[0] : '/images/products/product-placeholder.jpg',
            brand: 'BioPara',
            inStock: product.stock > 0,
            slug: product.slug
        }, 1);

        addToast({
            type: 'success',
            title: 'تمت الإضافة للسلة',
            message: `${product.name_ar || product.name} تمت إضافته بنجاح`
        });
    };

    const getCategoryBadgeInfo = (category: string) => {
        const catLower = category?.toLowerCase() || '';
        if (catLower.includes('herb')) return { label: 'أعشاب طبية', color: 'bg-green-100 text-green-800' };
        if (catLower.includes('oil')) return { label: 'زيوت طبية', color: 'bg-amber-100 text-amber-800' };
        if (catLower.includes('supplement')) return { label: 'مكملات غذائية', color: 'bg-blue-100 text-blue-800' };
        return { label: 'منتج مميز', color: 'bg-gray-100 text-gray-800' };
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 md:w-4 md:h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ));
    };

    // Conditional Rendering - hide section entirely if array is empty
    if (!loading && products.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-white bestsellers-background">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center relative z-10 bg-black/30 backdrop-blur-sm mx-auto max-w-3xl rounded-3xl p-6 border border-white/10 shadow-xl">
                    <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-md">الأكثر مبيعاً</h2>
                    <p className="text-gray-100 max-w-2xl mx-auto drop-shadow-sm font-medium">
                        اكتشف تشكيلتنا المتنوعة من الأعشاب الطبية، الزيوت الطبيعية والمكملات الغذائية الأكثر طلباً من عملائنا
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ProductSkeleton count={8} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => {
                            const badgeInfo = getCategoryBadgeInfo(product.categories?.name_ar || product.categories?.name || '');
                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative h-full">

                                        {/* Category Badge */}
                                        <div className={`absolute top-3 right-3 px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold z-20 ${badgeInfo.color}`}>
                                            {badgeInfo.label}
                                        </div>

                                        {/* Wishlist Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToast({ type: 'success', title: 'تمت الإضافة للمفضلة', message: 'تم حفظ المنتج في قائمة المفضلة' });
                                            }}
                                            className="absolute top-3 left-3 p-2 md:p-2.5 bg-white/90 backdrop-blur rounded-full text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all z-20 cursor-pointer pointer-events-auto"
                                            aria-label="أضف للمفضلة"
                                        >
                                            <Heart className="w-4 h-4" />
                                        </button>

                                        {/* Image */}
                                        <div className="relative h-40 md:h-48 w-full mb-4 overflow-hidden rounded-xl bg-gray-50 group">
                                            <Link href={`/products/${product.slug || product.id}`} className="absolute inset-0 z-0">
                                                <Image
                                                    src={(product.images && product.images.length > 0) ? product.images[0] : '/images/products/product-placeholder.jpg'}
                                                    alt={product.name_ar || product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </Link>
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col flex-1">
                                            <Link href={`/products/${product.slug || product.id}`} className="hover:text-green-600 transition-colors pointer-events-auto">
                                                <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-relaxed">
                                                    {product.name_ar || product.name}
                                                </h3>
                                            </Link>

                                            <div className="flex items-center mb-3">
                                                {renderStars(5)}
                                                <span className="text-[10px] md:text-xs text-gray-500 mr-1">
                                                    (0)
                                                </span>
                                            </div>

                                            <div className="mt-auto flex items-center justify-between">
                                                <p className="text-sm md:text-lg font-black text-green-600">
                                                    {product.price} درهم
                                                </p>

                                                <button
                                                    onClick={(e) => handleAddToCart(product, e)}
                                                    className="p-2 md:p-2.5 bg-green-50 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors cursor-pointer pointer-events-auto"
                                                    aria-label="أضف للسلة"
                                                >
                                                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {!loading && products.length > 0 && (
                    <div className="mt-12 text-center">
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-emerald-600 text-emerald-600 font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-colors shadow-sm group"
                        >
                            <span>عرض جميع المنتجات</span>
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}

