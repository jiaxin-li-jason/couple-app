'use client';
import DaysCounter from '@/components/Anniversary/DaysCounter';
import CountdownList from '@/components/Anniversary/CountdownList';
import AnniversaryForm from '@/components/Anniversary/AnniversaryForm';
import SweetQuote from '@/components/Anniversary/SweetQuote';
import { useAnniversaries } from '@/hooks/useAnniversaries';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { anniversaries, loveDate, daysTogether, loading, addAnniversary, deleteAnniversary } = useAnniversaries();

  if (loading) {
    return <div className="pt-6 text-center text-gray-400 py-20">加载中...</div>;
  }

  return (
    <div className="pt-6 space-y-6">
      <DaysCounter days={daysTogether} loveDate={loveDate} />
      <SweetQuote />
      <CountdownList
        anniversaries={anniversaries}
        onDelete={async (id) => {
          await deleteAnniversary(id);
          toast.success('已删除');
        }}
      />
      <AnniversaryForm
        onSubmit={async (title, date, type) => {
          await addAnniversary(title, date, type);
          toast.success('纪念日已添加！');
        }}
      />
    </div>
  );
}
