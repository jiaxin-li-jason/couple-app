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
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm active:border-primary-300 active:text-primary-400"
      >
        + 添加纪念日
      </button>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="纪念日名称"
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400"
      />
      <div className="flex gap-2">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`px-3 py-1.5 rounded-lg text-xs ${
              type === t.value
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'bg-white text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-primary-500 text-white py-2.5 rounded-xl font-medium"
        >
          保存
        </button>
        <button
          onClick={() => setShow(false)}
          className="flex-1 bg-white text-gray-400 py-2.5 rounded-xl"
        >
          取消
        </button>
      </div>
    </div>
  );
}
