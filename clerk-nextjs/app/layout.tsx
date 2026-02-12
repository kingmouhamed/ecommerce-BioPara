import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "../components/Providers";
import WhatsAppWidget from "../components/WhatsAppWidget";
import Navbar from "../components/Navbar";
import Cart from "../components/Cart";
import GlobalFooter from "../components/GlobalFooter";
import LiveChatSupport from "../components/LiveChatSupport";

const inter = Inter({ subsets: ["latin"] });
const tajawal = Tajawal({ 
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal"
});

export const metadata: Metadata = {
  title: "BioPara - Premium Natural Wellness | Global Delivery",
  description: "Premium natural wellness products delivered worldwide. Authentic Moroccan argan oil, herbal remedies, and parapharmacy products trusted by customers in 50+ countries.",
  keywords: "natural wellness, parapharmacy, argan oil, herbal remedies, global delivery, premium skincare, bio products, morocco",
  authors: [{ name: "BioPara" }],
  creator: "BioPara",
  publisher: "BioPara",
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://biopara.com"),
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en',
      'fr-FR': '/fr',
      'ar-MA': '/ar',
    },
  },
  openGraph: {
    title: "BioPara - Premium Natural Wellness | Global Delivery",
    description: "Premium natural wellness products delivered worldwide. Authentic Moroccan argan oil, herbal remedies, and parapharmacy products.",
    url: "https://biopara.com",
    siteName: "BioPara",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BioPara Premium Natural Wellness',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BioPara - Premium Natural Wellness | Global Delivery",
    description: "Premium natural wellness products delivered worldwide. Authentic Moroccan argan oil, herbal remedies, and parapharmacy products.",
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const generateViewport = () => ({
  themeColor: '#10b981',
  viewport: 'width=device-width, initial-scale=1',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="ar" dir="rtl">
        <head>
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="format-detection" content="telephone=no" />
        </head>
        <body className={`${tajawal.variable} font-sans antialiased`}>
          <div className="min-h-screen bg-[var(--color-background)] font-sans" dir="rtl">
            <Providers>
              {children}
            </Providers>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
