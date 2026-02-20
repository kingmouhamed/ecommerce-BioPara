'use client';

import { User, LogOut, Heart, ShoppingBag, Settings } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="bg-primary-600 w-20 h-20 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                اسم المستخدم
              </h1>
              <p className="text-gray-600">user@bioparaa.com</p>
            </div>
            <button className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all">
              <LogOut size={20} />
              تسجيل خروج
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
            {[
              { id: 'info', label: 'البيانات الشخصية', icon: User },
              { id: 'orders', label: 'طلباتي', icon: ShoppingBag },
              { id: 'favorites', label: 'المفضلة', icon: Heart },
              { id: 'settings', label: 'الإعدادات', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600 font-bold'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">البيانات الشخصية</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      defaultValue="اسم المستخدم"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      defaultValue="user@bioparaa.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      placeholder="+966 50 xxx xxxx"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      المدينة
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      placeholder="المدينة"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      العنوان
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                      placeholder="العنوان الكامل"
                    />
                  </div>
                </div>

                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 transition-all">
                  حفظ التغييرات
                </button>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">طلباتي</h2>
                <p className="text-gray-600 text-center py-12">
                  لا توجد طلبات بعد
                </p>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">المفضلة</h2>
                <p className="text-gray-600 text-center py-12">
                  لا توجد منتجات في المفضلة
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">الإعدادات</h2>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4">الإشعارات</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-gray-700">إشعارات البريد الإلكتروني</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-gray-700">إشعارات الرسائل القصيرة</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4">الخصوصية</h3>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-gray-700">السماح بعرض ملفي الشخصي</span>
                  </label>
                </div>

                <button className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 transition-all">
                  حفظ الإعدادات
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
