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
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/30 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
                active ? 'text-rose-500' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs mt-1">{tab.label}</span>
              {active && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-rose-400" />
              )}
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
            pathname === '/settings' ? 'text-rose-500' : 'text-gray-400'
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span className="text-xs mt-1">设置</span>
          {pathname === '/settings' && (
            <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-rose-400" />
          )}
        </Link>
      </div>
    </nav>
  );
}
