'use client';
import { useEffect } from 'react';
import { requestNotificationPermission } from '@/lib/notifications';

/** 在已登录后请求通知权限 */
export default function NotificationInit() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return null;
}
