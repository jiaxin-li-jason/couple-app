'use client';
import { useState, useCallback } from 'react';
import DailyQuestion from '@/components/Play/DailyQuestion';
import QuizCreate from '@/components/Play/QuizCreate';
import QuizAnswer from '@/components/Play/QuizAnswer';
import ChallengeForm from '@/components/Play/ChallengeForm';
import ChallengeList from '@/components/Play/ChallengeCard';
import Spinner from '@/components/Play/Spinner';

export default function PlayPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <div className="space-y-6" key={refreshKey}>
      <div className="bg-gradient-to-r from-rose-400 to-pink-500 -mx-4 px-4 pt-6 pb-4">
        <h1 className="text-lg font-bold text-white">互动广场</h1>
        <p className="text-rose-100 text-xs mt-0.5">让爱更有趣</p>
      </div>

      <DailyQuestion />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-rose-400">📝 情侣问答</h2>
        <QuizAnswer />
        <QuizCreate onCreated={refresh} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-rose-400">🎯 打卡挑战</h2>
        <ChallengeList />
        <ChallengeForm onCreated={refresh} />
      </section>

      <Spinner />
    </div>
  );
}
