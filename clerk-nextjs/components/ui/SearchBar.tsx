"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/data/products';

export default function SearchBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [debouncedQuery] = useDebounce(query, 500); // 500ms debounce
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close dropdown on outside click
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (debouncedQuery.trim().length === 0) {
            setResults([]);
            setLoading(false);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`);
                const data = await response.json();

                if (data.products) {
                    setResults(data.products);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            window.location.href = `/products?search=${encodeURIComponent(query)}`;
        }
    };

    return (
        <div className="relative w-full max-w-sm hidden md:block" ref={wrapperRef}>
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="ابحث عن الأعشاب والمنتجات الطبيعية..."
                        className="w-full pr-12 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    />
                    <button type="submit" title="Search" className="absolute right-3 text-gray-400 hover:text-emerald-600 transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </form>

            <AnimatePresence>
                {isOpen && query.trim().length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center py-8 text-emerald-600">
                                <Loader2 className="w-6 h-6 animate-spin" />
                            </div>
                        ) : results.length > 0 ? (
                            <ul className="py-2">
                                {results.map((product) => (
                                    <li key={product.id}>
                                        <Link
                                            href={`/products/${product.id}`}
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-4 px-4 py-3 hover:bg-emerald-50/50 transition-colors"
                                        >
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                <Image
                                                    src={(product.images && product.images.length > 0) ? product.images[0] : '/images/products/product-placeholder.jpg'}
                                                    alt={product.name_ar || product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-900 truncate">{product.name_ar || product.name}</h4>
                                                <p className="text-xs text-gray-500 truncate">{product.categories?.name_ar || product.categories?.name}</p>
                                            </div>
                                            <div className="text-emerald-600 font-bold text-sm whitespace-nowrap">
                                                {product.price} درهم
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                                <li className="border-t border-gray-100 mt-2">
                                    <Link
                                        href={`/products?search=${encodeURIComponent(query)}`}
                                        onClick={() => setIsOpen(false)}
                                        className="block text-center text-sm text-emerald-600 font-bold py-3 hover:bg-emerald-50 transition-colors"
                                    >
                                        عرض جميع النتائج لـ &quot;{query}&quot;
                                    </Link>
                                </li>
                            </ul>
                        ) : (
                            <div className="py-8 text-center text-gray-500 text-sm">
                                لا توجد نتائج مطابقة لـ &quot;{query}&quot;
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

