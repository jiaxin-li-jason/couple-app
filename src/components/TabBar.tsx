'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: '纪念日', icon: '🏠' },
  { href: '/album', label: '相册', icon: '🖼️' },
  { href: '/play', label: '互动', icon: '🎮' },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 ${
                active ? 'text-rose-500' : 'text-gray-400'
              }`}
            >
              <span className={`transition-all duration-200 ${active ? 'text-2xl -mt-1' : 'text-xl'}`}>{tab.icon}</span>
              <span className={`text-[10px] mt-0.5 font-medium transition-colors duration-200 ${
                active ? 'text-rose-500' : 'text-gray-400'
              }`}>{tab.label}</span>
              {active && (
                <span className="absolute -bottom-0 w-1.5 h-1.5 rounded-full bg-rose-400" />
              )}
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 ${
            pathname === '/settings' ? 'text-rose-500' : 'text-gray-400'
          }`}
        >
          <span className={`transition-all duration-200 ${pathname === '/settings' ? 'text-2xl -mt-1' : 'text-xl'}`}>⚙️</span>
          <span className={`text-[10px] mt-0.5 font-medium transition-colors duration-200 ${
            pathname === '/settings' ? 'text-rose-500' : 'text-gray-400'
          }`}>设置</span>
          {pathname === '/settings' && (
            <span className="absolute -bottom-0 w-1.5 h-1.5 rounded-full bg-rose-400" />
          )}
        </Link>
      </div>
    </nav>
  );
}
