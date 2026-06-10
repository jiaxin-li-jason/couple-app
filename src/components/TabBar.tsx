'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ——— 内联 SVG 线条图标 ——— */
const IconHome = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#f43f5e' : '#9c8e7d'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9v10a1 1 0 0 0 1 1h4v-5a2 2 0 0 1 4 0v5h4a1 1 0 0 0 1-1V9" />
  </svg>
);

const IconAlbum = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#f43f5e' : '#9c8e7d'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </svg>
);

const IconGame = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#f43f5e' : '#9c8e7d'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 11h4M8 9v4" />
    <circle cx="15" cy="10" r="1" />
    <circle cx="18" cy="13" r="1" />
    <path d="M17.5 7A5 5 0 0 1 21 10.5V15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4.5A5 5 0 0 1 6.5 7h11Z" />
  </svg>
);

const IconHeart = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#f43f5e' : '#9c8e7d'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21C12 21 3 14.5 3 8.5C3 5.5 5.5 3.5 8 3.5C9.5 3.5 11 4.5 12 6C13 4.5 14.5 3.5 16 3.5C18.5 3.5 21 5.5 21 8.5C21 14.5 12 21 12 21Z" />
  </svg>
);

const IconSettings = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke={active ? '#f43f5e' : '#9c8e7d'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const tabs = [
  { href: '/', label: '纪念日', Icon: IconHome },
  { href: '/album', label: '相册', Icon: IconAlbum },
  { href: '/games', label: '游戏', Icon: IconGame },
  { href: '/play', label: '互动', Icon: IconHeart },
  { href: '/settings', label: '设置', Icon: IconSettings },
];

export default function TabBar() {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((t) => t.href === pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom,0px)]">
      {/* 顶部柔和阴影遮罩 */}
      <div className="absolute inset-x-0 top-0 h-px bg-warm-200/60" />
      <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-white/95 to-transparent" />

      <div className="bg-white/95 backdrop-blur-md">
        <div className="flex justify-around items-center h-[3.5rem] max-w-lg mx-auto relative">
          {/* 胶囊指示器 */}
          <div
            className="absolute top-2 h-9 w-[4rem] rounded-[18px] bg-rose-50/80 transition-all duration-300 ease-out"
            style={{
              left: activeIndex >= 0 ? `calc(${activeIndex} * 20% + 10% - 2rem)` : '-9999px',
              opacity: activeIndex >= 0 ? 1 : 0,
            }}
          />

          {tabs.map((tab) => {
            const active = pathname === tab.href;
            const { Icon } = tab;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative flex flex-col items-center justify-center w-1/5 h-full select-none"
              >
                <span className="transition-transform duration-200 ease-out">
                  <Icon active={active} />
                </span>
                <span
                  className={`text-[11px] mt-0.5 font-medium tracking-wide transition-colors duration-200 ${
                    active ? 'text-rose-500' : 'text-warm-400'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
