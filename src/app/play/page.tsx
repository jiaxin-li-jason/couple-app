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
    <div className="pt-6 space-y-6" key={refreshKey}>
      <h1 className="text-lg font-bold text-gray-800">互动广场</h1>

      <DailyQuestion />

      <section className="space-y-3">
        <QuizAnswer />
        <QuizCreate onCreated={refresh} />
      </section>

      <section className="space-y-3">
        <ChallengeList />
        <ChallengeForm onCreated={refresh} />
      </section>

      <Spinner />
    </div>
  );
}
