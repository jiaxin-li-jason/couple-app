import type { Metadata, Viewport } from 'next';
import './globals.css';
import TabBar from '@/components/TabBar';
import PairingGuard from '@/components/PairingGuard';
import NotificationInit from '@/components/NotificationInit';
import OfflineBanner from '@/components/OfflineBanner';
import { Toaster } from 'react-hot-toast';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: '齐齐 & Jerry',
  description: '属于齐齐和Jerry的专属空间',
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '齐齐 & Jerry',
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
        <link rel="apple-touch-icon" href={`${basePath}/icons/icon-192.png`} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-[#F8F7F4] text-warm-900 font-sans antialiased h-full overflow-hidden">
        <OfflineBanner />
        <PairingGuard>
          <NotificationInit />
          <main className="max-w-lg mx-auto h-full flex flex-col px-4 pb-[calc(4rem+env(safe-area-inset-bottom,0px))]">
            {children}
          </main>
          <TabBar />
        </PairingGuard>
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: '16px', fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif' } }} />
      </body>
    </html>
  );
}
