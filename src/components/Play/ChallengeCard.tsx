'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import toast from 'react-hot-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  total_days: number;
  active: boolean;
}

interface Props {
  challenge: Challenge;
  userId: string;
  onUpdate: () => void;
}

function ChallengeCard({ challenge, userId, onUpdate }: Props) {
  const [checkins, setCheckins] = useState<string[]>([]);

  useEffect(() => {
    supabase.from('checkins').select('checkin_date').eq('challenge_id', challenge.id).then(({ data }) => {
      if (data) setCheckins(data.map((c) => c.checkin_date));
    });
  }, [challenge.id]);

  const today = new Date().toISOString().slice(0, 10);
  const checkedToday = checkins.includes(today);
  const progress = Math.min(Math.round((checkins.length / challenge.total_days) * 100), 100);

  const checkin = async () => {
    await supabase.from('checkins').insert({
      challenge_id: challenge.id,
      user_id: userId,
      checkin_date: today,
    });
    setCheckins([...checkins, today]);
    toast.success('打卡成功！✅');

    if (checkins.length + 1 >= challenge.total_days) {
      await supabase.from('challenges').update({ active: false }).eq('id', challenge.id);
      toast('🎉 挑战完成！', { icon: '🎉' });
      onUpdate();
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">{challenge.title}</h4>
          {challenge.description && <p className="text-xs text-gray-400 mt-0.5">{challenge.description}</p>}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${challenge.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
          {challenge.active ? '进行中' : '已完成'}
        </span>
      </div>
      {challenge.active && (
        <div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
            <div className="bg-primary-400 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{checkins.length}/{challenge.total_days} 天</span>
            {!checkedToday && (
              <button onClick={checkin} className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium active:scale-95 transition-transform">
                今日打卡
              </button>
            )}
            {checkedToday && <span className="text-xs text-primary-500">今日已完成 ✅</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChallengeList() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userId, setUserId] = useState('');

  const fetchChallenges = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) return;
    setUserId(user.id);
    const { data } = await supabase.from('challenges').select('*').order('created_at', { ascending: false });
    if (data) setChallenges(data);
  }, []);

  useEffect(() => { fetchChallenges(); }, [fetchChallenges]);

  return (
    <div className="space-y-2">
      {challenges.map((c) => (
        <ChallengeCard key={c.id} challenge={c} userId={userId} onUpdate={fetchChallenges} />
      ))}
    </div>
  );
}
