'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import toast from 'react-hot-toast';

interface Props {
  onCreated: () => void;
}

export default function QuizCreate({ onCreated }: Props) {
  const [show, setShow] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleSubmit = async () => {
    if (!question.trim() || options.some((o) => !o.trim())) return;
    const user = await getCurrentUser();
    if (!user) return;

    await supabase.from('quiz_questions').insert({
      created_by: user.id,
      question: question.trim(),
      options: options.map((o) => o.trim()),
      correct_index: correctIndex,
    });

    setShow(false);
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectIndex(0);
    onCreated();
    toast.success('题目已出！');
  };

  if (!show) {
    return (
      <button onClick={() => setShow(true)} className="w-full py-3.5 border border-dashed border-gray-300 rounded-xl text-gray-500 text-sm hover:border-gray-400 transition-colors active:scale-[0.98]">
        + 给TA出题
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card">
      <div className="h-1 bg-gradient-to-r from-sky-400 to-cyan-300" />
      <div className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500">给TA出题</h3>
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="题目" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-50 transition-all" />
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              checked={correctIndex === i}
              onChange={() => setCorrectIndex(i)}
              className="accent-rose-500"
            />
            <input
              value={opt}
              onChange={(e) => {
                const next = [...options];
                next[i] = e.target.value;
                setOptions(next);
              }}
              placeholder={`选项 ${i + 1}`}
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-50 transition-all"
            />
          </div>
        ))}
        <p className="text-xs text-gray-400">选择正确答案旁边的圆点</p>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="flex-1 bg-rose-500 text-white py-3 rounded-xl text-sm font-medium active:scale-[0.98] transition-all shadow-sm">出题</button>
          <button onClick={() => setShow(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-sm">取消</button>
        </div>
      </div>
    </div>
  );
}
