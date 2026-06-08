import type { Metadata, Viewport } from 'next';
import './globals.css';
import TabBar from '@/components/TabBar';
import PairingGuard from '@/components/PairingGuard';
import NotificationInit from '@/components/NotificationInit';
import OfflineBanner from '@/components/OfflineBanner';
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8F7F4] text-gray-900 font-sans antialiased h-full overflow-hidden">
        <OfflineBanner />
        <PairingGuard>
          <NotificationInit />
          <main className="max-w-lg mx-auto h-full flex flex-col px-4 pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
            {children}
          </main>
          <TabBar />
        </PairingGuard>
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: '16px' } }} />
      </body>
    </html>
  );
}
