import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/** 格式化日期为中文显示 */
export function formatDate(date: string): string {
  return format(parseISO(date), 'yyyy年M月d日', { locale: zhCN });
}

/** 计算距今还有多少天 */
export function daysUntil(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return differenceInDays(target, today);
}

/** 计算已过去多少天 */
export function daysSince(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return differenceInDays(today, target);
}

/** 生成6位随机配对码 */
export function generatePairCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** 生成设备ID（首次使用存localStorage） */
export function getDeviceId(): string {
  let id = localStorage.getItem('couple_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('couple_device_id', id);
  }
  return id;
}

/** 获取当前月份标签 YYYY-MM */
export function getMonthTag(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}
