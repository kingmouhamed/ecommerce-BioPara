'use client';

import EmptyState from '@/components/EmptyState';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">طلباتي</h1>

                <EmptyState
                    title="لا توجد طلبات حتى الآن"
                    description="لم تقم بإجراء أي طلبات سابقة. تصفح منتجاتنا وابدأ رحلة التسوق."
                    action={{
                        label: "تصفح المنتجات",
                        onClick: () => { }
                    }}
                />

                {/* Helper link for Server Component EmptyState action */}
                <div className="text-center mt-6">
                    <Link href="/products" className="text-emerald-600 hover:text-emerald-700 font-medium">العودة للمتجر</Link>
                </div>
            </div>
        </div>
    );
}
