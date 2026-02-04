"use client"; // 👈 هذا السطر هو الحل السحري

import React from 'react';
import ErrorBoundary from './ErrorBoundary';
// تأكد من مسار الاستدعاء حسب مكان ملفاتك
import { CartProvider } from '../contexts/CartContext'; 
import { NotificationProvider } from './ux/Notification';
// import { AuthProvider } from '../contexts/AuthContext'; // فعّل هذا السطر إذا كان لديك AuthContext

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <AuthProvider>  <-- إذا كان لديك AuthProvider
      <ErrorBoundary>
        <NotificationProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </NotificationProvider>
      </ErrorBoundary>
    // </AuthProvider>
  );
}