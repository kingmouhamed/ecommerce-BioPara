"use client";

import React from 'react';
import { CartProvider } from '../contexts/CartContext';
import { ToastProvider } from './ui/Toast';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <CartProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </CartProvider>
  );
}
