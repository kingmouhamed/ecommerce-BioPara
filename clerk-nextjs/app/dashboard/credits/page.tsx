"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { CreditCard, Plus, TrendingUp, Gift } from "lucide-react";

export default function CreditsPage() {
  const { user } = useUser();
  const [credits] = useState({
    balance: 250,
    pending: 50,
    totalEarned: 500,
    transactions: [
      {
        id: 1,
        type: "earned",
        amount: 100,
        description: "مكافأة التسجيل",
        date: "2024-01-15"
      },
      {
        id: 2,
        type: "earned",
        amount: 50,
        description: "مكافأة الشراء الأول",
        date: "2024-01-20"
      },
      {
        id: 3,
        type: "used",
        amount: -75,
        description: "استخدام في طلب #123",
        date: "2024-01-25"
      }
    ]
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">الرصيد</h1>
            <p className="text-gray-600 mb-8">يجب تسجيل الدخول لعرض الرصيد</p>
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
          <h1 className="text-3xl font-bold text-gray-900">الرصيد</h1>
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <Plus className="w-4 h-4" />
            شحن الرصيد
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">الرصيد الحالي</span>
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{credits.balance} درهم</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">رصيد معلق</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{credits.pending} درهم</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">إجمالي المكتسب</span>
              <Gift className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{credits.totalEarned} درهم</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">سجل المعاملات</h2>
          
          {credits.transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">لا توجد معاملات بعد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {credits.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.date}</p>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'earned' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'earned' ? '+' : ''}{transaction.amount} درهم
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-emerald-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">كيف تكسب رصيد؟</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• 100 درهم مكافأة عند التسجيل</li>
            <li>• 50 درهم عند أول عملية شراء</li>
            <li>• 5% من قيمة كل عملية شراء</li>
            <li>• مكافآت خاصة في المناسبات</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
