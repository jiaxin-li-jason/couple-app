'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { scheduleAnniversaryCheck } from '@/lib/notifications';

export interface Anniversary {
  id: string;
  title: string;
  date: string;
  type: string;
  created_by: string;
  created_at: string;
}

export interface AnniversaryWithDays extends Anniversary {
  daysUntil: number;
  daysSince: number;
  isPast: boolean;
}

export function useAnniversaries() {
  const [anniversaries, setAnniversaries] = useState<AnniversaryWithDays[]>([]);
  const [loveDate, setLoveDate] = useState<string | null>(null);
  const [daysTogether, setDaysTogether] = useState(0);
  const [loading, setLoading] = useState(true);

  const processDates = useCallback((items: Anniversary[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const enriched = items.map((a) => {
      const target = new Date(a.date);
      target.setHours(0, 0, 0, 0);
      const diffMs = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return {
        ...a,
        daysUntil: diffDays > 0 ? diffDays : 0,
        daysSince: diffDays < 0 ? Math.abs(diffDays) : 0,
        isPast: diffDays < 0,
      };
    });

    // 按距离最近排序
    enriched.sort((a, b) => a.daysUntil - b.daysUntil);
    return enriched;
  }, []);

  const fetchAll = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data } = await supabase
      .from('anniversaries')
      .select('*')
      .order('date', { ascending: true });

    if (data) {
      const enriched = processDates(data);

      // 找到恋爱纪念日（type = 'love' 的第一个）
      const love = data.find((a) => a.type === 'love');
      if (love) {
        setLoveDate(love.date);
        const start = new Date(love.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffMs = today.getTime() - start.getTime();
        setDaysTogether(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      }

      setAnniversaries(enriched);
      scheduleAnniversaryCheck(data.map((a) => ({ title: a.title, date: a.date })));
    }
    setLoading(false);
  }, [processDates]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addAnniversary = useCallback(async (title: string, date: string, type: string) => {
    const user = await getCurrentUser();
    if (!user) return;
    const { error } = await supabase.from('anniversaries').insert({
      title, date, type, created_by: user.id,
    });
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const deleteAnniversary = useCallback(async (id: string) => {
    const { error } = await supabase.from('anniversaries').delete().eq('id', id);
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const updateAnniversary = useCallback(async (id: string, updates: { title?: string; date?: string; type?: string }) => {
    const { error } = await supabase.from('anniversaries').update(updates).eq('id', id);
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  return { anniversaries, loveDate, daysTogether, loading, addAnniversary, deleteAnniversary, updateAnniversary, refresh: fetchAll };
}
