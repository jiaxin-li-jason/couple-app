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
      <button onClick={() => setShow(true)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
        + 给TA出题
      </button>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
      <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="题目" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400 text-sm" />
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="radio"
            checked={correctIndex === i}
            onChange={() => setCorrectIndex(i)}
            className="accent-primary-500"
          />
          <input
            value={opt}
            onChange={(e) => {
              const next = [...options];
              next[i] = e.target.value;
              setOptions(next);
            }}
            placeholder={`选项 ${i + 1}`}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary-400 text-sm"
          />
        </div>
      ))}
      <p className="text-xs text-gray-400">选择正确答案旁边的圆点</p>
      <div className="flex gap-2">
        <button onClick={handleSubmit} className="flex-1 bg-primary-500 text-white py-2.5 rounded-xl text-sm font-medium">出题</button>
        <button onClick={() => setShow(false)} className="flex-1 bg-white text-gray-400 py-2.5 rounded-xl text-sm">取消</button>
      </div>
    </div>
  );
}
