import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "../components/Providers";
import WhatsAppWidget from "../components/WhatsAppWidget";
import Navbar from "../components/Navbar";
import Cart from "../components/Cart";
import TopBar from '../components/TopBar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BioPara - Parapharmacie en ligne",
  description: "Votre expert en parapharmacie et phytothérapie au Maroc.",
  keywords: "parapharmacie, maroc, bio, cosmétiques, soins, santé",
  authors: [{ name: "BioPara" }],
  creator: "BioPara",
  publisher: "BioPara",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://biopara.ma"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BioPara - Parapharmacie en ligne",
    description: "Votre expert en parapharmacie et phytothérapie au Maroc.",
    url: "https://biopara.ma",
    siteName: "BioPara",
    locale: "ar_MA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BioPara - Parapharmacie en ligne",
    description: "Votre expert en parapharmacie et phytothérapie au Maroc.",
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
  icons: {
    icon: '/favicon.ico',
    apple: '/logo.svg',
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
        <body className={inter.className}>
          <TopBar />
          <Providers>
            <Navbar />
            {children}
            <Cart />
            <WhatsAppWidget />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
