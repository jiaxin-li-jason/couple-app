import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '我们的空间',
  description: '专属情侣空间',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-white text-gray-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
