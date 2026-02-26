"use client";

import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Heart, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../ui/Toast';
import { cn } from '@/lib/utils';

interface CartItem {
  id: string | number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  brand?: string;
  inStock?: boolean;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { cart, removeFromCart, updateQuantity, calculateTotal } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setCartItems(cart);
    }
  }, [cart, isOpen]);

  const handleRemoveItem = (id: string | number) => {
    removeFromCart(id);
    setCartItems(prev => prev.filter(item => item.id !== id));
    addToast({
      type: 'success',
      title: 'تمت الإزالة',
      message: 'تمت إزالة المنتج من السلة'
    });
  };

  const handleQuantityChange = (id: string | number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    updateQuantity(id, newQuantity);
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal >= 300 ? 0 : 30;
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={cn(
        'fixed top-0 left-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">سلة التسوق</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">سلة التسوق فارغة</h3>
              <p className="text-gray-600 mb-6">أضف بعض المنتجات للبدء</p>
              <Link
                href="/products"
                onClick={onClose}
                className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                تصفح المنتجات
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate mb-1">
                        {item.title}
                      </h3>
                      {item.brand && (
                        <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-emerald-600">
                          {item.price.toFixed(2)} د.م
                        </span>
                        <span className="text-sm text-gray-500">
                          المجموع: {(item.price * item.quantity).toFixed(2)} د.م
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">المجموع الفرعي</span>
                <span className="font-medium">{subtotal.toFixed(2)} د.م</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">الشحن</span>
                <span className="font-medium">
                  {shipping === 0 ? 'مجاني' : `${shipping.toFixed(2)} د.م`}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>المجموع</span>
                  <span className="text-emerald-600">{total.toFixed(2)} د.م</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            {subtotal < 300 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 space-x-reverse text-emerald-700 text-sm">
                  <Truck className="w-4 h-4" />
                  <span>أضف {(300 - subtotal).toFixed(2)} د.م للحصول على شحن مجاني</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-center"
              >
                إتمام الطلب
              </Link>
              <button
                onClick={onClose}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                متابعة التسوق
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-4 space-x-reverse text-xs text-gray-500">
              <div className="flex items-center space-x-1 space-x-reverse">
                <Shield className="w-3 h-3" />
                <span>آمن</span>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <RefreshCw className="w-3 h-3" />
                <span>إرجاع</span>
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <Truck className="w-3 h-3" />
                <span>شحن سريع</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
