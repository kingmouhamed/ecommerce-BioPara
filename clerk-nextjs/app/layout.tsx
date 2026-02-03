import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "../components/Providers"; // 👈 استدعاء الملف الجديد
import WhatsAppWidget from "../components/WhatsAppWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BioPara - Parapharmacie en ligne",
  description: "Votre expert en parapharmacie et phytothérapie au Maroc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={inter.className}>
          {/* غلفنا التطبيق بالـ Providers هنا ليعمل بشكل صحيح */}
          <Providers>
            {children}
            <WhatsAppWidget />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}