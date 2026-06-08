'use client';
import DaysCounter from '@/components/Anniversary/DaysCounter';
import CountdownList from '@/components/Anniversary/CountdownList';
import AnniversaryForm from '@/components/Anniversary/AnniversaryForm';
import SweetQuote from '@/components/Anniversary/SweetQuote';
import { useAnniversaries } from '@/hooks/useAnniversaries';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { anniversaries, loveDate, daysTogether, loading, addAnniversary, deleteAnniversary, updateAnniversary } = useAnniversaries();

  if (loading) {
    return <div className="pt-6 text-center text-gray-400 py-20">加载中...</div>;
  }

  return (
    <div className="h-full flex flex-col pt-6">
      {/* 固定上半部分：只保留情话 + 天数 */}
      <div className="shrink-0 space-y-4">
        <SweetQuote />
        <DaysCounter days={daysTogether} loveDate={loveDate} />
      </div>

      {/* 可滚动下半部分：纪念日列表 */}
      <div className="flex-1 overflow-y-auto min-h-0 mt-4 space-y-5">
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
