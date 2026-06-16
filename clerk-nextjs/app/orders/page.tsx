'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronLeft, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  products?: { name: string; name_ar?: string; images?: string[] };
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'قيد الانتظار', color: 'text-yellow-600 bg-yellow-50', icon: <Clock className="w-4 h-4" /> },
  processing: { label: 'قيد المعالجة', color: 'text-blue-600 bg-blue-50', icon: <Package className="w-4 h-4" /> },
  shipped: { label: 'تم الشحن', color: 'text-purple-600 bg-purple-50', icon: <Truck className="w-4 h-4" /> },
  delivered: { label: 'تم التسليم', color: 'text-green-600 bg-green-50', icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: 'ملغي', color: 'text-red-600 bg-red-50', icon: <XCircle className="w-4 h-4" /> },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.success) {
          setOrders(data.data || []);
        } else {
          setError(data.error || 'فشل في تحميل الطلبات');
        }
      } catch {
        setError('حدث خطأ في الاتصال');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">طلباتي</h1>
          <Link href="/products" className="flex items-center text-emerald-600 hover:text-emerald-700 font-medium gap-1">
            <ChevronLeft className="w-4 h-4" />
            متابعة التسوق
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-center">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">لا توجد طلبات حتى الآن</h2>
            <p className="text-gray-500 mb-6">لم تقم بإجراء أي طلبات سابقة. تصفح منتجاتنا وابدأ رحلة التسوق.</p>
            <Link href="/products" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition font-medium">
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = statusConfig[order.status] || { label: order.status, color: 'text-gray-600 bg-gray-50', icon: null };
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-900">طلب #{order.order_number}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </div>
                  </div>

                  {order.order_items?.length > 0 && (
                    <div className="border-t pt-4 space-y-2">
                      {order.order_items.map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">
                            {item.products?.name_ar || item.products?.name || `منتج #${item.product_id}`}
                            <span className="text-gray-400 mr-2">× {item.quantity}</span>
                          </span>
                          <span className="font-medium">{(item.unit_price * item.quantity).toFixed(2)} د.م</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t mt-4 pt-4 flex items-center justify-between">
                    <span className="text-gray-600 font-medium">المجموع الكلي</span>
                    <span className="text-lg font-bold text-emerald-700">{order.total_amount.toFixed(2)} د.م</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
