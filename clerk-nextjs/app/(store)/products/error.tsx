'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ProductsError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the unexpected error to an error reporting service
        console.error('🚨 [Products Error Boundary]:', error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
            <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                    ⚠️
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">عذراً، حدث خطأ غير متوقع</h2>
                <p className="text-gray-600 mb-6 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {error.message || 'تعذر تحميل قائمة المنتجات. يرجى المحاولة مرة أخرى.'}
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-green-200"
                    >
                        حاول مرة أخرى
                    </button>
                    <Link
                        href="/"
                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors border border-gray-200"
                    >
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        </div>
    )
}
