"use client";

import { useState, useEffect } from 'react';
import { User, ShoppingBag, Heart, Settings, LogOut, Edit2, Camera, Mail, Phone, MapPin } from 'lucide-react';
import { supabase, Tables } from '../../../lib/supabase-client';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Tables['orders'][]>([]);
  const [favorites, setFavorites] = useState<Tables['favorites'][]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'orders' | 'favorites' | 'settings'>('info');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          // Redirect to login if not authenticated
          window.location.href = '/sign-in';
          return;
        }

        setUser(currentUser);

        // Fetch user's orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
        } else {
          setOrders(ordersData || []);
        }

        // Fetch user's favorites
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('*, products(*)')
          .eq('user_id', currentUser.id);

        if (favoritesError) {
          console.error('Error fetching favorites:', favoritesError);
        } else {
          setFavorites(favoritesData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">يرجى تسجيل الدخول</h1>
          <p className="text-gray-600 mb-6">يجب تسجيل الدخول للوصول إلى صفحة الملف الشخصي</p>
          <a
            href="/sign-in"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            تسجيل الدخول
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <Breadcrumbs
            items={[
              { label: 'الرئيسية', href: '/' },
              { label: 'الملف الشخصي', href: '/profile' }
            ]}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-emerald-600" />
                  </div>
                  <button className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {user.user_metadata?.full_name || user.email}
                </h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'info' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  معلوماتي
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'orders' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  طلباتي
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'favorites' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  المفضلة
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'settings' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  الإعدادات
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  تسجيل الخروج
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Personal Information Tab */}
            {activeTab === 'info' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">معلوماتي الشخصية</h3>
                  <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700">
                    <Edit2 className="w-4 h-4" />
                    تعديل
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      value={user.user_metadata?.full_name || ''}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      aria-label="الاسم الكامل"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={user.email || ''}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      aria-label="البريد الإلكتروني"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      placeholder="أدخل رقم الهاتف"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label="رقم الهاتف"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      العنوان
                    </label>
                    <input
                      type="text"
                      placeholder="أدخل العنوان"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label="العنوان"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">طلباتي</h3>
                
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-semibold">طلب #{order.order_number}</span>
                            <span className="mr-4 text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status === 'delivered' ? 'تم التسليم' :
                             order.status === 'processing' ? 'قيد المعالجة' :
                             order.status === 'pending' ? 'في الانتظار' :
                             order.status}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-emerald-600">
                          {order.total_amount} ر.س
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h4>
                    <p className="text-gray-600 mb-6">لم تقم بعمل أي طلبات بعد</p>
                    <a
                      href="/products"
                      className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      تسوق الآن
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">المفضلة</h3>
                
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((favorite) => (
                      <div key={favorite.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-4"></div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {(favorite as any).products?.name || 'منتج'}
                        </h4>
                        <div className="text-lg font-bold text-emerald-600">
                          {(favorite as any).products?.price || 0} ر.س
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">لا توجد مفضلة</h4>
                    <p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات للمفضلة بعد</p>
                    <a
                      href="/products"
                      className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      استكشف المنتجات
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">الإعدادات</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">الإشعارات</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          defaultChecked
                          aria-label="إشعارات البريد الإلكتروني"
                        />
                        <span className="text-gray-700">إشعارات البريد الإلكتروني</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          defaultChecked
                          aria-label="إشعارات الطلبات"
                        />
                        <span className="text-gray-700">إشعارات الطلبات</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          aria-label="إشعارات العروض"
                        />
                        <span className="text-gray-700">إشعارات العروض والتخفيضات</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">الخصوصية</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          defaultChecked
                          aria-label="إظهار الملف الشخصي"
                        />
                        <span className="text-gray-700">إظهار الملف الشخصي للعامة</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                          aria-label="مشاركة البيانات"
                        />
                        <span className="text-gray-700">مشاركة البيانات مع الشركاء</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                      حفظ التغييرات
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
