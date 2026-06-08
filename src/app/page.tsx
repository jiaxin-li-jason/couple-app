'use client';
import { useState, useEffect } from 'react';
import DaysCounter from '@/components/Anniversary/DaysCounter';
import CountdownList from '@/components/Anniversary/CountdownList';
import AnniversaryForm from '@/components/Anniversary/AnniversaryForm';
import SweetQuote from '@/components/Anniversary/SweetQuote';
import { useAnniversaries } from '@/hooks/useAnniversaries';
import toast from 'react-hot-toast';

function Greeting() {
  const [greeting, setGreeting] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 6) setGreeting('夜深了 🌙');
    else if (hour < 9) setGreeting('早安 ☀️');
    else if (hour < 12) setGreeting('上午好 🌤');
    else if (hour < 14) setGreeting('午好 🌤');
    else if (hour < 18) setGreeting('下午好 ☀️');
    else setGreeting('晚安 🌙');

    setDateStr(
      now.toLocaleDateString('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      })
    );
  }, []);

  if (!greeting) return null;

  return (
    <div className="text-center mb-6">
      <p className="text-lg font-medium text-gray-700">{greeting}</p>
      <p className="text-xs text-gray-400 mt-1">{dateStr}</p>
    </div>
  );
}

export default function HomePage() {
  const { anniversaries, loveDate, daysTogether, loading, addAnniversary, deleteAnniversary, updateAnniversary } = useAnniversaries();

  if (loading) {
    return <div className="pt-6 text-center text-gray-400 py-20">加载中...</div>;
  }

  return (
    <div className="h-full flex flex-col pt-8">
      {/* 固定上半部分 */}
      <div className="shrink-0 space-y-5">
        <Greeting />
        <div className="bg-amber-50/80 rounded-3xl px-6 py-8 text-center border border-amber-100/60">
          <p className="text-xs text-amber-400/80 tracking-[0.2em] uppercase font-medium mb-2">
            Every day with you
          </p>
          <p className="text-2xl font-bold text-amber-800/90 leading-snug">
            珍惜每一个
            <br />
            特别的日子
          </p>
        </div>
        <DaysCounter days={daysTogether} loveDate={loveDate} />
        <SweetQuote />
      </div>

      {/* 可滚动下半部分 */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-24 mt-5 space-y-5">
        <CountdownList
          anniversaries={anniversaries}
          onDelete={async (id) => {
            await deleteAnniversary(id);
            toast.success('已删除');
          }}
          onUpdate={async (id, updates) => {
            await updateAnniversary(id, updates);
            toast.success('已更新');
          }}
        />
        <AnniversaryForm
          onSubmit={async (title, date, type) => {
            await addAnniversary(title, date, type);
            toast.success('纪念日已添加！');
          }}
        />
      </div>
    </div>
  );
}
