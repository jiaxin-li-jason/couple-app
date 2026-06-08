'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import toast from 'react-hot-toast';

interface QuizQuestion {
  id: string;
  created_by: string;
  question: string;
  options: string[];
  correct_index: number;
  answered: boolean;
}

export default function QuizAnswer() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userId, setUserId] = useState('');

  const fetchQuestions = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) return;
    setUserId(user.id);

    const { data } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('answered', false)
      .order('created_at', { ascending: false });

    if (data) setQuestions(data.filter((q) => q.created_by !== user.id));
  }, []);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const answer = async (q: QuizQuestion, selectedIndex: number) => {
    const user = await getCurrentUser();
    if (!user) return;

    const correct = selectedIndex === q.correct_index;

    if (correct) {
      const { data: scoreRow } = await supabase.from('scores').select('*').eq('user_id', user.id).single();
      if (scoreRow) {
        await supabase.from('scores').update({ score: scoreRow.score + 10 }).eq('user_id', user.id);
      } else {
        await supabase.from('scores').insert({ user_id: user.id, score: 10 });
      }
    }

    await supabase.from('quiz_questions').update({ answered: true }).eq('id', q.id);

    toast(correct ? '答对了！+10分' : `答错了~正确答案是：${q.options[q.correct_index]}`);
    fetchQuestions();
  };

  if (questions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card">
      <div className="h-1 bg-gradient-to-r from-sky-400 to-cyan-300" />
      <div className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500">TA给你的题</h3>
        {questions.map((q) => (
          <div key={q.id} className="space-y-3">
            <p className="text-gray-800 font-medium">{q.question}</p>
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => answer(q, i)}
                className="w-full text-left bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 active:bg-gray-100 transition-colors border border-gray-100 hover:border-sky-200"
              >
                {['A', 'B', 'C', 'D'][i]}. {opt}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
