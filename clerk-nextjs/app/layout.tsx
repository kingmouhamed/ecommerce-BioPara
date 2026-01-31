import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BioPara - Votre parapharmacie en ligne",
  description: "Les meilleurs produits de parapharmacie et de santé au Maroc.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={inter.className}>
          <AuthProvider>
            <CartProvider>
              <main>{children}</main>
            </CartProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
