"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";

export default function AddressesPage() {
  const { user } = useUser();
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "المنزل",
      street: "شارع محمد الخامس",
      city: "الدار البيضاء",
      phone: "0612345678",
      isDefault: true
    },
    {
      id: 2,
      name: "العمل",
      street: "شارع الحسن الثاني",
      city: "الرباط",
      phone: "0623456789",
      isDefault: false
    }
  ]);

  const deleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const setDefaultAddress = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">العناوين</h1>
            <p className="text-gray-600 mb-8">يجب تسجيل الدخول لإدارة العناوين</p>
            <Link 
              href="/auth/login" 
              className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">العناوين</h1>
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <Plus className="w-4 h-4" />
            إضافة عنوان جديد
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">لا توجد عناوين محفوظة</h2>
            <p className="text-gray-600 mb-8">أضف عنوانك الأول لتسهيل عملية التوصيل</p>
            <button className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
              إضافة عنوان جديد
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{address.name}</h3>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                          الافتراضي
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-1">{address.street}</p>
                    <p className="text-gray-600 mb-1">{address.city}</p>
                    <p className="text-gray-600">{address.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteAddress(address.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {!address.isDefault && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => setDefaultAddress(address.id)}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                    >
                      تعيين كعنوان افتراضي
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
