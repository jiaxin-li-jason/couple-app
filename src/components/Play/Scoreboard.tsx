'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface ScoreRow {
  user_id: string;
  score: number;
  nickname?: string;
}

export default function Scoreboard() {
  const [scores, setScores] = useState<ScoreRow[]>([]);

  const fetchScores = useCallback(async () => {
    const { data: scoreData } = await supabase.from('scores').select('*').order('score', { ascending: false });
    if (!scoreData || scoreData.length === 0) return;

    const userIds = scoreData.map(s => s.user_id);
    const { data: users } = await supabase.from('users').select('id, nickname').in('id', userIds);

    const enriched = scoreData.map(s => ({
      ...s,
      nickname: users?.find(u => u.id === s.user_id)?.nickname || '未知',
    }));

    setScores(enriched);
  }, []);

  useEffect(() => { fetchScores(); }, [fetchScores]);

  if (scores.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card">
      <div className="h-1 bg-gradient-to-r from-amber-400 to-yellow-300" />
      <div className="p-5 space-y-3">
        <h3 className="text-sm font-semibold text-gray-500">🏆 情侣积分榜</h3>
        <div className="space-y-2">
          {scores.map((s, i) => (
            <div key={s.user_id} className="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-xl">
              <span className="text-lg">{i === 0 ? '🥇' : '🥈'}</span>
              <span className="flex-1 text-sm font-medium text-gray-700">{s.nickname}</span>
              <span className="text-sm font-bold text-amber-500">{s.score} 分</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
