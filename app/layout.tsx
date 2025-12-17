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
  title: "Singa Ambara Suites",
  description: "Luxury Hotel in Bali",
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