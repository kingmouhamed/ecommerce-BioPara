"use client";

import React from 'react';
import Cart from '../../components/Cart';
import { useCart } from '../../contexts/CartContext';

export default function CartPage() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    calculateTotal
  } = useCart();

  const [deliveryInfo, setDeliveryInfo] = React.useState({ name: '', phone: '', address: '' });

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-6 text-right">سلة التسوق</h1>
      <Cart
        isOpen={true}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
        calculateTotal={calculateTotal}
        deliveryInfo={deliveryInfo}
        setDeliveryInfo={setDeliveryInfo}
      />
    </div>
  );
}
