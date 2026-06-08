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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
                active ? 'text-amber-500' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
              {active && (
                <span className="absolute -bottom-0 w-6 h-0.5 rounded-full bg-amber-400" />
              )}
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
            pathname === '/settings' ? 'text-amber-500' : 'text-gray-400'
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span className="text-[10px] mt-0.5 font-medium">设置</span>
          {pathname === '/settings' && (
            <span className="absolute -bottom-0 w-6 h-0.5 rounded-full bg-amber-400" />
          )}
        </Link>
      </div>
    </nav>
  );
}
