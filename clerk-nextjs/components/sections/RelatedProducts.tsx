"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductSkeleton from '../ui/ProductSkeleton';
import { Product } from '@/lib/data/products';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '../ui/Toast';

interface RelatedProductsProps {
    currentProductId: string;
    categorySlug?: string;
}

export default function RelatedProducts({ currentProductId, categorySlug }: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { addToast } = useToast();

    useEffect(() => {
        async function loadRelatedProducts() {
            try {
                // Fetch best sellers or related products depending on API support. Here we fetch general products and filter out current
                const url = categorySlug ? `/api/products?limit=5&category=${categorySlug}` : '/api/products?limit=5';
                const response = await fetch(url);
                const result = await response.json();
                if (result.success && result.data?.products) {
                    const filtered = result.data.products.filter((p: Product) => p.id !== currentProductId).slice(0, 4);
                    setProducts(filtered);
                }
            } catch (error) {
                console.error("Failed to load related products", error);
            } finally {
                setLoading(false);
            }
        }
        loadRelatedProducts();
    }, [currentProductId, categorySlug]);

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
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

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 md:w-4 md:h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ));
    };

    if (!loading && products.length === 0) {
        return null;
    }

    return (
        <section className="py-12 mt-16 border-t border-gray-100 bg-gray-50/50">
            <div className="container mx-auto px-4">
                <div className="mb-10 text-right">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 relative inline-block">
                        منتجات ذات صلة
                        <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-emerald-500 rounded-full"></span>
                    </h2>
                    <p className="text-gray-500 mt-4">منتجات أخرى قد تنال إعجابك</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ProductSkeleton count={4} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Link href={`/products/${product.slug || product.id}`} className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative h-full">
                                    <div className="relative h-48 w-full mb-4 overflow-hidden rounded-xl bg-gray-50">
                                        <Image
                                            src={(product.images && product.images.length > 0) ? product.images[0] : '/images/products/product-placeholder.jpg'}
                                            alt={product.name_ar || product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-relaxed group-hover:text-emerald-600 transition-colors">
                                            {product.name_ar || product.name}
                                        </h3>
                                        <div className="flex items-center mb-3">
                                            {renderStars(5)}
                                            <span className="text-xs text-gray-500 mr-1">(0)</span>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between">
                                            <p className="text-lg font-black text-emerald-600">
                                                {product.price} درهم
                                            </p>
                                            <button
                                                onClick={(e) => handleAddToCart(product, e)}
                                                className="p-2.5 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white transition-colors"
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
