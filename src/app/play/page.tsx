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
    <div className="h-full flex flex-col pt-6" key={refreshKey}>
      {/* 固定头部 */}
      <div className="shrink-0 space-y-2">
        <div className="h-1 w-16 bg-gradient-to-r from-violet-400 to-purple-300 rounded-full" />
        <div className="pb-1">
          <h1 className="text-lg font-bold text-gray-900">互动广场</h1>
          <p className="text-gray-500 text-xs mt-0.5">让爱更有趣</p>
        </div>
      </div>

      {/* 可滚动内容 */}
      <div className="flex-1 overflow-y-auto min-h-0 mt-6 space-y-8">
        <section>
          <DailyQuestion />
        </section>
        <section className="space-y-4">
          <QuizAnswer />
          <QuizCreate onCreated={refresh} />
        </section>
        <section className="space-y-4">
          <ChallengeList />
          <ChallengeForm onCreated={refresh} />
        </section>
        <Spinner />
      </div>
    </div>
  );
}
