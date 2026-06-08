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
      <button onClick={() => setShow(true)} className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-gray-400 transition-colors">
        + 给TA出题
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-200">
      <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="题目" className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors" />
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="radio"
            checked={correctIndex === i}
            onChange={() => setCorrectIndex(i)}
            className="accent-amber-500"
          />
          <input
            value={opt}
            onChange={(e) => {
              const next = [...options];
              next[i] = e.target.value;
              setOptions(next);
            }}
            placeholder={`选项 ${i + 1}`}
            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      ))}
      <p className="text-xs text-gray-400">选择正确答案旁边的圆点</p>
      <div className="flex gap-2">
        <button onClick={handleSubmit} className="flex-1 bg-amber-500 text-white py-2.5 rounded-lg text-sm font-medium active:scale-[0.98] transition-all">出题</button>
        <button onClick={() => setShow(false)} className="flex-1 bg-gray-100 text-gray-500 py-2.5 rounded-lg text-sm">取消</button>
      </div>
    </div>
  );
}
