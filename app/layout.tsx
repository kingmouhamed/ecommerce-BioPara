import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "BioPara - الأعشاب الطبية الطبيعية",
  description:
    "متجر BioPara للأعشاب الطبية الطبيعية والمنتجات الصحية. منتجات طبيعية 100% من أفضل المصادر العالمية.",
  keywords:
    "أعشاب طبية, منتجات طبيعية, بيوبارا, صحة, عافية, أعشاب, طب بديل",
  authors: [{ name: "BioPara" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
