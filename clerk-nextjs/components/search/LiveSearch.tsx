'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
}

export default function LiveSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const debouncedQuery = useDebounce(query, 300);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch results when debounced query changes
    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            setIsSearching(true);
            setIsOpen(true);

            try {
                // Assume an API route exists at /api/products/search
                const res = await fetch(`/api/products?q=${encodeURIComponent(debouncedQuery)}`);
                const data = await res.json();
                // Adjust depending on your actual API response structure
                // Assuming data.data.products is our array
                setResults(data.data?.products || []);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setIsSearching(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    return (
        <div ref={searchRef} className="relative w-full max-w-md" dir="rtl">
            <div className="relative flex items-center w-full">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder="ابحث عن منتج، عشب، زيت..."
                    className="w-full pl-4 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {isSearching ? <Loader2 className="w-5 h-5 animate-spin text-emerald-600" /> : <Search className="w-5 h-5" />}
                </div>
            </div>

            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute top-full right-0 left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {results.length > 0 ? (
                        <ul className="max-h-96 overflow-y-auto py-2">
                            {results.map((product) => (
                                <li key={product.id}>
                                    <Link
                                        href={`/products/${product.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-4 px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <Image
                                                src={product.image || '/images/products/product-placeholder.jpg'}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                                            <p className="text-sm font-bold text-emerald-600">{product.price.toFixed(2)} MAD</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !isSearching && query.length >= 2 && (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                لم يتم العثور على نتائج لـ "{query}"
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
