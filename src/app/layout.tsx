import type { Metadata, Viewport } from 'next';
import './globals.css';
import TabBar from '@/components/TabBar';
import PairingGuard from '@/components/PairingGuard';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: '我们的空间',
  description: '专属情侣空间',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '我们的空间',
    startupImage: [],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-white text-gray-900 font-sans antialiased">
        <PairingGuard>
          <main className="max-w-lg mx-auto min-h-screen pb-20 px-4">
            {children}
          </main>
          <TabBar />
        </PairingGuard>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
