'use client';
import { useState } from 'react';

interface Props {
  onSubmit: (title: string, date: string, type: string) => Promise<void>;
}

const types = [
  { value: 'love', label: '恋爱', icon: '❤️' },
  { value: 'birthday', label: '生日', icon: '🎂' },
  { value: 'trip', label: '旅行', icon: '✈️' },
  { value: 'custom', label: '自定义', icon: '⭐' },
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

  return (
    <>
      {/* 浮动添加按钮 */}
      {!show && (
        <button
          onClick={() => setShow(true)}
          className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-rose-400 to-rose-500 text-white rounded-2xl shadow-lg shadow-rose-200/60 flex items-center justify-center text-2xl font-light active:scale-90 transition-all duration-200 hover:shadow-xl hover:shadow-rose-200/70 hover:-translate-y-0.5 z-40"
          style={{ boxShadow: '0 6px 24px rgba(244,63,94,0.25)' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

      {/* 底部弹出表单 */}
      {show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShow(false)} />

          {/* 居中弹窗，不贴底 */}
          <div className="relative w-[calc(100%-2rem)] max-w-lg bg-white rounded-3xl animate-slide-up shadow-2xl overflow-hidden">
            <div className="px-6 pt-6">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
              <h3 className="text-base font-bold text-gray-800 text-center mb-5">添加纪念日</h3>
            </div>

            <div className="px-6 space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="纪念日名称"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-300 focus:bg-white transition-all"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-300 focus:bg-white transition-all max-w-full"
                style={{ maxWidth: '100%', boxSizing: 'border-box' }}
              />

              {/* 类型选择 */}
              <div>
                <p className="text-xs text-gray-400 mb-2 ml-1">类型</p>
                <div className="grid grid-cols-4 gap-2">
                  {types.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-xl text-xs transition-all ${
                        type === t.value
                          ? 'bg-rose-50 text-rose-600 font-medium ring-1 ring-rose-200'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 pt-5 pb-6">
              <div className="flex gap-3">
                <button
                  onClick={() => setShow(false)}
                  className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl text-sm font-medium active:scale-[0.98] transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-rose-400 to-rose-500 text-white py-3 rounded-xl text-sm font-medium active:scale-[0.98] transition-all shadow-sm shadow-rose-200/50"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
