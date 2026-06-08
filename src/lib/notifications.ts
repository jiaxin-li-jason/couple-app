/** 请求推送权限 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/** 发送本地通知 */
export function sendLocalNotification(title: string, body: string) {
  if (Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  });
}

/** 定时检查纪念日并推送 */
export function scheduleAnniversaryCheck(anniversaries: { title: string; date: string }[]) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  for (const a of anniversaries) {
    if (a.date === today) {
      sendLocalNotification('🎉 今天！', `${a.title} 就在今天！`);
    } else if (a.date === tomorrow) {
      sendLocalNotification('📅 明天', `${a.title} 就在明天！`);
    }
  }
}
