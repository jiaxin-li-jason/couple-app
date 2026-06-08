'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import toast from 'react-hot-toast';

interface Props {
  onCreated: () => void;
}

export default function ChallengeForm({ onCreated }: Props) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalDays, setTotalDays] = useState(7);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    const user = await getCurrentUser();
    if (!user) return;

    await supabase.from('challenges').insert({
      title: title.trim(),
      description: description.trim(),
      total_days: totalDays,
      created_by: user.id,
    });
    setShow(false);
    setTitle(''); setDescription(''); setTotalDays(7);
    onCreated();
    toast.success('挑战已创建！');
  };

  if (!show) {
    return (
      <button onClick={() => setShow(true)} className="w-full py-3 border-2 border-dashed border-rose-200 rounded-xl text-rose-400 text-sm hover:border-rose-400 transition-colors">
        + 创建打卡挑战
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm border border-rose-100">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="挑战名称" className="w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:bg-white transition-colors text-sm" />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="描述（选填）" className="w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:bg-white transition-colors text-sm" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">坚持</span>
        <select value={totalDays} onChange={(e) => setTotalDays(Number(e.target.value))} className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-sm focus:border-rose-400 outline-none">
          {[7, 14, 21, 30, 60, 100].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">天</span>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-rose-400 to-pink-500 text-white py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-rose-500/20">创建</button>
        <button onClick={() => setShow(false)} className="flex-1 bg-gray-100 text-gray-400 py-2.5 rounded-xl text-sm">取消</button>
      </div>
    </div>
  );
}
