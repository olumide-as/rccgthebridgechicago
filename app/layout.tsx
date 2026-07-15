import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";

import "./globals.css";
import { flyerConfig } from "@/config/flyer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-flyer",
});

export const metadata: Metadata = {
  metadataBase: new URL(flyerConfig.publicSiteUrl),
  title: flyerConfig.pageTitle,
  description: flyerConfig.pageDescription,
  openGraph: {
    title: flyerConfig.pageTitle,
    description: flyerConfig.pageDescription,
    images: [flyerConfig.artworkPath],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bebasNeue.variable}`}>
        {children}
      </body>
    </html>
  );
}