import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";


// Setup Font Mewah (Serif)
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair'
});

// Setup Font Biasa (Sans-Serif)
const lato = Lato({ 
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: '--font-lato'
});

export const metadata: Metadata = {
  title: {
    template: '%s | Singa Ambara Suites',
    default: 'Singa Ambara Suites - Luxury Hotel in Bali', // Judul default
  },
  description: "Rasakan kenyamanan menginap di Singa Ambara Suites, hotel mewah di jantung Singaraja, Bali. Fasilitas lengkap dengan sentuhan budaya lokal.",
  keywords: ["hotel bali", "singa ambara suites", "penginapan singaraja", "hotel mewah buleleng"],
  openGraph: {
    title: 'Singa Ambara Suites',
    description: 'Luxury Hotel in Bali',
    url: 'https://singa-ambara-suites.web.id',
    siteName: 'Singa Ambara Suites',
    images: [
      {
        url: 'https://api.singa-ambara-suites.web.id/storage/og-image.jpg', // Ganti dengan link gambar banner hotel Anda
        width: 1200,
        height: 630,
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${playfair.variable} ${lato.variable} font-sans`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}