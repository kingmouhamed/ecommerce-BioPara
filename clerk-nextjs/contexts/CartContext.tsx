"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      // Clear corrupted data
      try {
        localStorage.removeItem('cart');
      } catch (clearError) {
        console.error("Failed to clear corrupted cart data", clearError);
      }
    }
  }, []);

  // Debounced localStorage write for performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        if (cart.length > 0) {
          localStorage.setItem('cart', JSON.stringify(cart));
        } else {
          localStorage.removeItem('cart');
        }
      } catch (error) {
        console.error("Failed to save cart to localStorage", error);
        // Handle quota exceeded error
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.warn('Storage quota exceeded, cart data not saved');
        }
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [cart]);

  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>, quantity = 1) => {
    // Validate quantity
    if (quantity <= 0 || quantity > 99) {
      console.warn('Invalid quantity:', quantity);
      return;
    }

    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        const newQuantity = existingProduct.quantity + quantity;
        // Check if new quantity exceeds limit
        if (newQuantity > 99) {
          console.warn('Quantity exceeds maximum limit:', newQuantity);
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number | string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number | string, quantity: number) => {
    // Validate quantity
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    if (quantity > 99) {
      console.warn('Quantity exceeds maximum limit:', quantity);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = () => {
    setCart([]);
  };
  
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  const calculateTotal = useCallback((): string => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  }, [cart]);

  const value = useMemo<CartContextType>(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartItemCount,
    isCartOpen,
    setIsCartOpen,
    calculateTotal,
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, cartItemCount, isCartOpen, setIsCartOpen, calculateTotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};