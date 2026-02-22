"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

interface CartItem {
  id: number | string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  calculateTotal: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        if (cart.length > 0) {
          localStorage.setItem("cart", JSON.stringify(cart));
        } else {
          localStorage.removeItem("cart");
        }
      } catch {
        // ignore
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [cart]);

  const addToCart = useCallback(
    (product: Omit<CartItem, "quantity">, quantity = 1) => {
      if (quantity <= 0 || quantity > 99) return;
      setCart((prevCart) => {
        const existing = prevCart.find((item) => item.id === product.id);
        if (existing) {
          const newQty = existing.quantity + quantity;
          if (newQty > 99) return prevCart;
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: newQty } : item
          );
        }
        return [...prevCart, { ...product, quantity }];
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: number | string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: number | string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      if (quantity > 99) return;
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const cartItemCount = cart.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const calculateTotal = useCallback((): string => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  }, [cart]);

  const value = useMemo<CartContextType>(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartItemCount,
      isCartOpen,
      setIsCartOpen,
      calculateTotal,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartItemCount,
      isCartOpen,
      calculateTotal,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
