'use client';
import { useState } from 'react';

interface Props {
  onSubmit: (title: string, date: string, type: string) => Promise<void>;
}

const types = [
  { value: 'love', label: '恋爱' },
  { value: 'birthday', label: '生日' },
  { value: 'trip', label: '旅行' },
  { value: 'custom', label: '自定义' },
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
        className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm hover:border-gray-400 transition-colors"
      >
        + 添加纪念日
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 space-y-3 border border-gray-200">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="纪念日名称"
        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
      />
      <div className="flex gap-2 flex-wrap">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`px-3 py-1.5 rounded-md text-xs ${
              type === t.value
                ? 'bg-amber-100 text-amber-800 font-medium'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-amber-500 text-white py-2.5 rounded-lg text-sm font-medium active:scale-[0.98] transition-all"
        >
          保存
        </button>
        <button
          onClick={() => setShow(false)}
          className="flex-1 bg-gray-100 text-gray-500 py-2.5 rounded-lg text-sm"
        >
          取消
        </button>
      </div>
    </div>
  );
}
