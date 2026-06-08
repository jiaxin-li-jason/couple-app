'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: '纪念日', icon: '🏠' },
  { href: '/album', label: '相册', icon: '🖼️' },
  { href: '/chat', label: '聊天', icon: '💬' },
  { href: '/play', label: '互动', icon: '🎮' },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                active ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs mt-1">{tab.label}</span>
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            pathname === '/settings' ? 'text-primary-600' : 'text-gray-400'
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span className="text-xs mt-1">设置</span>
        </Link>
      </div>
    </nav>
  );
}
