"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ProductSkeletonProps {
    count?: number;
}

export default function ProductSkeleton({ count = 1 }: ProductSkeletonProps) {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col"
                >
                    {/* Image Placeholder */}
                    <div className="relative h-48 w-full mb-4 bg-gray-200 rounded-xl overflow-hidden animate-pulse"></div>

                    {/* Title Placeholder */}
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>

                    {/* Rating Placeholder */}
                    <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, j) => (
                            <div key={j} className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                        ))}
                    </div>

                    {/* Price & Action Placeholder */}
                    <div className="mt-auto flex items-center justify-between">
                        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </motion.div>
            ))}
        </>
    );
}
