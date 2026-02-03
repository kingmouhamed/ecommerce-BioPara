"use client";

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Credits() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center" dir="rtl">
        <h1 className="text-3xl font-bold mb-6">رصيدي</h1>
        <p>المرجو <Link href="/login" className="text-green-700 hover:underline">تسجيل الدخول</Link> لعرض رصيدك.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-right">رصيدي</h1>
      <div className="max-w-2xl">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-right">الرصيد المتاح</h2>
          <div className="text-3xl font-bold text-green-700 mb-4 text-right">150.00 درهم</div>
          <p className="text-gray-600 mb-4 text-right">
            يمكنك استخدام رصيدك في عمليات الشراء المستقبلية. الرصيد لا تنتهي صلاحيته أبداً.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>200.00 درهم</span>
              <span>مجموع الرصيد المكتسب:</span>
            </div>
            <div className="flex justify-between">
              <span>50.00 درهم</span>
              <span>المستخدم:</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>150.00 درهم</span>
              <span>المتاح:</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
