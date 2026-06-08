'use client';
import { useState } from 'react';

interface Props {
  onSubmit: (title: string, date: string, type: string) => Promise<void>;
}

const types = [
  { value: 'love', label: '💕 恋爱' },
  { value: 'birthday', label: '🎂 生日' },
  { value: 'trip', label: '✈️ 旅行' },
  { value: 'custom', label: '📌 自定义' },
];

export default function AnniversaryForm({ onSubmit }: Props) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('custom');

  const handleSubmit = async () => {
    if (!title || !date) return;
    await onSubmit(title, date, type);
    setTitle(''); setDate(''); setType('custom'); setShow(false);
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="w-full py-3 border-2 border-dashed border-rose-200 rounded-xl text-rose-400 text-sm active:border-rose-400 active:text-rose-500 transition-colors"
      >
        + 添加纪念日
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 space-y-3 shadow-sm border border-rose-100">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="纪念日名称"
        className="w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:bg-white transition-colors"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:bg-white transition-colors"
      />
      <div className="flex gap-2 flex-wrap">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`px-3 py-1.5 rounded-lg text-xs ${
              type === t.value
                ? 'bg-rose-100 text-rose-700 font-medium'
                : 'bg-rose-50 text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-gradient-to-r from-rose-400 to-pink-500 text-white py-2.5 rounded-xl font-medium shadow-lg shadow-rose-500/20"
        >
          保存
        </button>
        <button
          onClick={() => setShow(false)}
          className="flex-1 bg-gray-100 text-gray-400 py-2.5 rounded-xl"
        >
          取消
        </button>
      </div>
    </div>
  );
}
