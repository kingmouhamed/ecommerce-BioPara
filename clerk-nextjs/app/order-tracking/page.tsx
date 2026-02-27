import React from 'react';
import { Package, Truck, Search } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'تتبع الطلبات | BioPara',
    description: 'تتبع حالة طلبك بسهولة من خلال إدخال رقم الطلب.',
};

export default function OrderTrackingPage() {
    return (
        <div className="min-h-screen py-16 bg-gray-50 flex items-center justify-center">
            <div className="container mx-auto px-4 max-w-2xl text-center">
                <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-100">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-6">
                        <Package className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">تتبع الطلبات</h1>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        أدخل رقم الطلب الذي تم إرساله إلى بريدك الإلكتروني لمعرفة حالة الشحنة الخاصة بك.
                    </p>

                    <form className="space-y-4 mb-8">
                        <div>
                            <input
                                type="text"
                                placeholder="رقم الطلب (مثال: ORD-123456)"
                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-right"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="البريد الإلكتروني المستخدم في الطلب"
                                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none text-right"
                            />
                        </div>
                        <button
                            type="button"
                            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Search className="w-5 h-5" />
                            تتبع الطلب
                        </button>
                    </form>

                    <Link href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-2">
                        هل تواجه مشكلة في تتبع طلبك؟ تواصل معنا
                    </Link>
                </div>
            </div>
        </div>
    );
}
