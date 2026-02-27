"use client";

import { useState, useEffect } from 'react';
import { User, ShoppingBag, Heart, Settings, LogOut, Edit2, Camera, Mail, Phone, MapPin } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const { cartItemCount } = useCart();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', href: '/' },
            { label: 'حسابي', href: '/profile' },
          ]}
        />

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">حسابي</h1>
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">{cartItemCount} منتج</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Heart className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">المفضلة</span>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">المستخدم الافتراضي</h2>
                  <p className="text-gray-600">user@example.com</p>
                  <p className="text-sm text-gray-500">عضو منذ يناير 2024</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات الحساب</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                      <p className="font-medium">user@example.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">رقم الهاتف</p>
                      <p className="font-medium">+966 50 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">العنوان</p>
                      <p className="font-medium">الرياض، المملكة العربية السعودية</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">الإعدادات</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">الإشعارات البريد الإلكتروني</span>
                    <button className="text-emerald-600 hover:text-emerald-700">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">اللغة</span>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>العربية</option>
                      <option>English</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">العملة</span>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>فاتح</option>
                      <option>داكن</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <ShoppingBag className="w-8 h-8 text-emerald-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">طلباتي</h3>
              <p className="text-gray-600 text-sm mb-4">عرض تاريخ طلباتك وحالتها</p>
              <button className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                عرض الطلبات
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">المفضلة</h3>
              <p className="text-gray-600 text-sm mb-4">المنتجات التي أعجبتها للمفضلة</p>
              <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
                عرض المفضلة
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <Settings className="w-8 h-8 text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">الإعدادات</h3>
              <p className="text-gray-600 text-sm mb-4">تخصيصص إعدادات حسابك</p>
              <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors">
                الإعدادات
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">النشاط الأخير</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 space-x-reverse text-sm">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">تم إضافة منتج للسلة</p>
                  <p className="text-gray-500">منذ 5 دقائق</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse text-sm">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">تصفح المنتجات</p>
                  <p className="text-gray-500">منذ 15 دقيقة</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse text-sm">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">إزالة منتج من السلة</p>
                  <p className="text-gray-500">منذ 30 دقيقة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
