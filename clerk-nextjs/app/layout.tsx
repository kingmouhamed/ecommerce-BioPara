import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { CartProvider } from '../contexts/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

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
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
