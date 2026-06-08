'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import toast from 'react-hot-toast';

interface Wish {
  id: string;
  text: string;
  created_by: string;
  done: boolean;
  done_at: string | null;
}

export default function BucketList() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchWishes = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) return;
    setUserId(user.id);
    const { data } = await supabase.from('bucket_list').select('*').order('created_at', { ascending: false });
    if (data) setWishes(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchWishes(); }, [fetchWishes]);

  const addWish = async () => {
    if (!newWish.trim()) return;
    const user = await getCurrentUser();
    if (!user) return;
    await supabase.from('bucket_list').insert({ text: newWish.trim(), created_by: user.id });
    setNewWish('');
    toast.success('已许愿 ✨');
    fetchWishes();
  };

  const toggleDone = async (wish: Wish) => {
    const now = wish.done ? null : new Date().toISOString();
    await supabase.from('bucket_list').update({ done: !wish.done, done_at: now }).eq('id', wish.id);
    if (!wish.done) toast('达成心愿！💕', { icon: '🎉' });
    fetchWishes();
  };

  const deleteWish = async (id: string) => {
    await supabase.from('bucket_list').delete().eq('id', id);
    fetchWishes();
  };

  if (loading) return null;

  const todo = wishes.filter(w => !w.done);
  const done = wishes.filter(w => w.done);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card">
      <div className="h-1 bg-gradient-to-r from-pink-400 to-rose-300" />
      <div className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-500">💕 情侣心愿清单</h3>
        <p className="text-xs text-gray-400">写下想一起完成的事，逐个达成</p>

        {/* 添加心愿 */}
        <div className="flex gap-2">
          <input
            value={newWish}
            onChange={(e) => setNewWish(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addWish(); }}
            placeholder="许一个心愿..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-rose-300 focus:bg-white transition-all"
          />
          <button onClick={addWish} className="bg-rose-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium active:scale-[0.98] transition-all shadow-sm">
            许愿
          </button>
        </div>

        {/* 未完成 */}
        {todo.length > 0 && (
          <div className="space-y-2">
            {todo.map((w) => (
              <div key={w.id} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl group">
                <button onClick={() => toggleDone(w)} className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0 hover:border-rose-400 transition-colors" />
                <p className="flex-1 text-sm text-gray-700">{w.text}</p>
                {w.created_by === userId && (
                  <button onClick={() => deleteWish(w.id)} className="text-gray-300 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all">✕</button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 已完成 */}
        {done.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-medium">✨ 已达成</p>
            {done.map((w) => (
              <div key={w.id} className="flex items-center gap-3 px-3 py-2.5 bg-rose-50/50 rounded-xl group">
                <button onClick={() => toggleDone(w)} className="w-5 h-5 rounded-full bg-rose-400 text-white flex items-center justify-center text-xs shrink-0">✓</button>
                <p className="flex-1 text-sm text-gray-400 line-through">{w.text}</p>
                {w.created_by === userId && (
                  <button onClick={() => deleteWish(w.id)} className="text-gray-300 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all">✕</button>
                )}
              </div>
            ))}
          </div>
        )}

        {wishes.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">还没有心愿，许一个吧 ✨</p>
        )}
      </div>
    </div>
  );
}
