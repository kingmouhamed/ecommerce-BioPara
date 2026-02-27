"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductSkeleton from '../ui/ProductSkeleton';
import { Product } from '../../types';
import { getMixedBestSellers } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../ui/Toast';

export default function BestSellers() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { addToast } = useToast();

    useEffect(() => {
        async function loadBestSellers() {
            try {
                // Fetch 8 mixed products
                const data = await getMixedBestSellers(8);
                setProducts(data);
            } catch (error) {
                console.error("Failed to load best sellers", error);
            } finally {
                setLoading(false);
            }
        }
        loadBestSellers();
    }, []);

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.preventDefault(); // prevent navigation 
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            brand: product.brand,
            inStock: product.inStock
        }, 1);
        addToast({
            type: 'success',
            title: 'تمت الإضافة للسلة',
            message: `${product.title} تمت إضافته بنجاح`
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
        <section className="py-16 bg-white" style={{
            backgroundImage: 'url(/images/backgrounds/hero-herbs.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">الأكثر مبيعاً</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
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
                            const badgeInfo = getCategoryBadgeInfo(product.category);
                            return (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Link href={`/products/${product.id}`} className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative h-full">
                                        {/* Category Badge */}
                                        <div className={`absolute top-3 right-3 px-2 py-1 md:px-3 rounded-full text-[10px] md:text-xs font-bold z-10 ${badgeInfo.color}`}>
                                            {badgeInfo.label}
                                        </div>

                                        {/* Image */}
                                        <div className="relative h-40 md:h-48 w-full mb-4 overflow-hidden rounded-xl bg-gray-50">
                                            <Image
                                                src={product.image || '/images/placeholder.svg'}
                                                alt={product.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col flex-1">
                                            <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-relaxed group-hover:text-green-600 transition-colors">
                                                {product.title}
                                            </h3>

                                            <div className="flex items-center mb-3">
                                                {renderStars(product.rating || 5)}
                                                <span className="text-[10px] md:text-xs text-gray-500 mr-1">
                                                    ({product.sales_count || product.reviewCount || 0})
                                                </span>
                                            </div>

                                            <div className="mt-auto flex items-center justify-between">
                                                <p className="text-sm md:text-lg font-black text-green-600">
                                                    {product.price} ر.س
                                                </p>

                                                <button
                                                    onClick={(e) => handleAddToCart(product, e)}
                                                    className="p-2 md:p-2.5 bg-green-50 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors"
                                                    aria-label="أضف للسلة"
                                                >
                                                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
