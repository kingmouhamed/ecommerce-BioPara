"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import { useCartStore } from '@/store/useCartStore';

// --- Type Definitions ---
interface CartItem {
  id: number | string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  brand?: string;
  capacity?: string;
  inStock?: boolean;
  slug?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  calculateTotal: () => string;
  calculateSubtotal: () => number;
  calculateShipping: () => number;
  calculateTotalWithShipping: () => number;
}

interface CartProviderProps {
  children: ReactNode;
}

// --- Context Creation ---
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// --- Provider Component ---
export const CartProvider = ({ children }: CartProviderProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = useCartStore((state) => state.items);
  const isOpen = useCartStore((state) => state.isOpen);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQty = useCartStore((state) => state.updateQuantity);
  const clear = useCartStore((state) => state.clearCart);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const getCartTotal = useCartStore((state) => state.getCartTotal);
  const getCartCount = useCartStore((state) => state.getCartCount);

  // Map Zustand items to Context CartItem structure
  const cart: CartItem[] = useMemo(() => {
    if (!mounted) return [];
    return items.map((item) => ({
      id: item.id,
      title: item.name, // Map Zustand's name to Context's title
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      brand: 'BioPara',
      inStock: true,
      slug: item.slug
    }));
  }, [items, mounted]);

  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    addItem({
      id: product.id.toString(),
      name: product.title, // Map Context's title to Zustand's name
      price: product.price,
      image: product.image,
      slug: product.slug || '',
      quantity,
    });
  }, [addItem]);

  const removeFromCart = useCallback((productId: number | string) => {
    removeItem(productId.toString());
  }, [removeItem]);

  const updateQuantity = useCallback((productId: number | string, quantity: number) => {
    updateQty(productId.toString(), quantity);
  }, [updateQty]);

  const clearCart = useCallback(() => {
    clear();
  }, [clear]);

  const cartItemCount = mounted ? getCartCount() : 0;

  const calculateSubtotal = useCallback((): number => {
    return mounted ? getCartTotal() : 0;
  }, [mounted, getCartTotal]);

  const calculateShipping = useCallback((): number => {
    const subtotal = calculateSubtotal();
    if (subtotal === 0 || subtotal >= 299) {
      return 0;
    }
    return 30; // 30 MAD standard shipping
  }, [calculateSubtotal]);

  const calculateTotalWithShipping = useCallback((): number => {
    return calculateSubtotal() + calculateShipping();
  }, [calculateSubtotal, calculateShipping]);

  const calculateTotal = useCallback((): string => {
    return calculateTotalWithShipping().toFixed(2);
  }, [calculateTotalWithShipping]);

  const setIsCartOpen = useCallback((open: boolean) => {
    if (open) openCart();
    else closeCart();
  }, [openCart, closeCart]);

  const value = useMemo<CartContextType>(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemCount,
    isCartOpen: isOpen,
    setIsCartOpen,
    calculateTotal,
    calculateSubtotal,
    calculateShipping,
    calculateTotalWithShipping,
  }), [
    cart,
    isOpen,
    cartItemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setIsCartOpen,
    calculateTotal,
    calculateSubtotal,
    calculateShipping,
    calculateTotalWithShipping,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
