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
    <div className="space-y-8 pt-6" key={refreshKey}>
      <div className="h-1 w-16 bg-gradient-to-r from-violet-400 to-purple-300 rounded-full" />
      <div className="pb-1">
        <h1 className="text-lg font-bold text-gray-900">互动广场</h1>
        <p className="text-gray-500 text-xs mt-0.5">让爱更有趣</p>
      </div>

      {/* 每日一问 */}
      <section>
        <DailyQuestion />
      </section>

      {/* 情侣问答 */}
      <section className="space-y-4">
        <QuizAnswer />
        <QuizCreate onCreated={refresh} />
      </section>

      {/* 打卡挑战 */}
      <section className="space-y-4">
        <ChallengeList />
        <ChallengeForm onCreated={refresh} />
      </section>

      {/* 真心话大冒险 */}
      <Spinner />
    </div>
  );
}
