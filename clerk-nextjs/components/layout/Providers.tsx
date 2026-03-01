"use client";

import React from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '../ui/Toast';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      <CartProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </CartProvider>
    </ClerkProvider>
  );
}
