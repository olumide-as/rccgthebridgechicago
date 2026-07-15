import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { flyerConfig } from '@/config/flyer';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
export const metadata: Metadata = { metadataBase: new URL(flyerConfig.publicSiteUrl), title: flyerConfig.pageTitle, description: flyerConfig.pageDescription, openGraph: { title: flyerConfig.pageTitle, description: flyerConfig.pageDescription, images: [flyerConfig.artworkPath], type: 'website' } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body className={inter.variable}>{children}</body></html>; }
