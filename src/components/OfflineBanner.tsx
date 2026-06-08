'use client';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function OfflineBanner() {
  const online = useNetworkStatus();
  if (online) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-yellow-900 text-center py-1.5 text-xs font-medium z-50">
      📡 当前处于离线状态
    </div>
  );
}
