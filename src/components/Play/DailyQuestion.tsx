'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

const FALLBACK_QUESTIONS = [
  'TA做过最让你感动的一件事是什么？',
  '第一次见面时，你对TA的第一印象是？',
  '你最喜欢TA的哪一个特点？',
  '如果可以和TA去任何地方旅行，你会选哪里？',
  '你最想对TA说但还没说的话是什么？',
  '你觉得两个人在一起最重要的是什么？',
  'TA的哪个习惯最让你忍俊不禁？',
];

export default function DailyQuestion() {
  const [question, setQuestion] = useState<string>('');
  const [myAnswer, setMyAnswer] = useState('');
  const [partnerAnswer, setPartnerAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  const fetchQuestion = useCallback(async () => {
    const { data } = await supabase.from('daily_questions').select('*').eq('date', today).single();

    if (data) {
      setQuestion(data.question);
    } else {
      const q = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
      await supabase.from('daily_questions').insert({ question: q, date: today });
      setQuestion(q);
    }

    const user = await getCurrentUser();
    const { data: qData } = await supabase.from('daily_questions').select('id').eq('date', today).single();
    if (!qData || !user) { setLoading(false); return; }

    const { data: answers } = await supabase.from('answers').select('*').eq('question_id', qData.id);

    if (answers) {
      const mine = answers.find((a) => a.user_id === user.id);
      const partner = answers.find((a) => a.user_id !== user.id);
      if (mine) { setMyAnswer(mine.answer); setSubmitted(true); }
      if (partner) setPartnerAnswer(partner.answer);
    }

    setLoading(false);
  }, [today]);

  useEffect(() => { fetchQuestion(); }, [fetchQuestion]);

  const submitAnswer = async () => {
    if (!myAnswer.trim()) return;
    const user = await getCurrentUser();
    if (!user) return;

    const { data: q } = await supabase.from('daily_questions').select('id').eq('date', today).single();
    if (!q) return;

    await supabase.from('answers').insert({
      question_id: q.id,
      user_id: user.id,
      answer: myAnswer.trim(),
    });

    setSubmitted(true);
  };

  if (loading) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-primary-600">📋 每日一问</h3>
      <p className="text-gray-800 font-medium">{question}</p>

      {!submitted ? (
        <div>
          <textarea
            value={myAnswer}
            onChange={(e) => setMyAnswer(e.target.value)}
            placeholder="写下你的回答..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400 text-sm resize-none"
            rows={3}
          />
          <button
            onClick={submitAnswer}
            disabled={!myAnswer.trim()}
            className="mt-2 bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
          >
            提交回答
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="bg-primary-50 rounded-xl px-4 py-2.5">
            <p className="text-xs text-primary-500 mb-0.5">你的回答</p>
            <p className="text-sm text-gray-700">{myAnswer}</p>
          </div>
          {partnerAnswer ? (
            <div className="bg-love-50 rounded-xl px-4 py-2.5">
              <p className="text-xs text-love-400 mb-0.5">TA的回答</p>
              <p className="text-sm text-gray-700">{partnerAnswer}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">等待TA的回答...</p>
          )}
        </div>
      )}
    </div>
  );
}
