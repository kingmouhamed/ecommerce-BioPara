"use client";

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Addresses() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center" dir="rtl">
        <h1 className="text-3xl font-bold mb-6">عناويني</h1>
        <p>المرجو <Link href="/auth/login" className="text-green-700 hover:underline">تسجيل الدخول</Link> لإدارة عناوينك.</p>
      </div>
    );
  }

  // This is mock data. In a real application, you would fetch this from your database.
  const addresses = [
    {
      id: 1,
      type: 'المنزل',
      name: user.fullName || 'المستخدم',
      address: '123 الشارع الرئيسي، الدار البيضاء',
      phone: '+212 600 000 000',
      isDefault: true
    },
    {
      id: 2,
      type: 'العمل',
      name: user.fullName || 'المستخدم',
      address: '456 شارع الأعمال، الرباط',
      phone: '+212 600 000 001',
      isDefault: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-right">عناويني</h1>
      <div className="max-w-4xl">
        <div className="mb-6 text-right">
          <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
            إضافة عنوان جديد
          </button>
        </div>

        {addresses.length === 0 ? (
          <p className="text-gray-600 text-right">لا توجد عناوين محفوظة.</p>
        ) : (
          <div className="grid gap-4">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2 mb-2 justify-end">
                      {address.isDefault && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                          الافتراضي
                        </span>
                      )}
                      <h3 className="font-semibold">{address.type}</h3>
                    </div>
                    <p className="font-medium">{address.name}</p>
                    <p className="text-gray-600">{address.address}</p>
                    <p className="text-gray-600">{address.phone}</p>
                  </div>
                  <div className="flex gap-4 ml-4">
                    <button className="text-blue-600 hover:underline">تعديل</button>
                    <button className="text-red-600 hover:underline">حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
