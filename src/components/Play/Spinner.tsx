'use client';
import { useState } from 'react';

const TRUTHS = [
  '第一次约会时你心里在想什么？',
  '做过最让TA吃醋的一件事？',
  '你有什么还没告诉TA的小秘密？',
  'TA的哪个习惯你会偷偷吐槽？',
  '你觉得TA最可爱的瞬间是？',
];

const DARES = [
  '给TA发一段10秒语音说"我爱你"',
  '模仿TA的一个经典表情/动作',
  '发一张你现在的自拍给TA',
  '用emoji描述你们的下次约会',
  '闭上眼睛，用三个词形容TA',
];

export default function Spinner() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ type: string; text: string } | null>(null);
  const [mode, setMode] = useState<'truth' | 'dare' | null>(null);

  const spin = (type: 'truth' | 'dare') => {
    setSpinning(true);
    setResult(null);
    setMode(type);

    const pool = type === 'truth' ? TRUTHS : DARES;
    let i = 0;
    const interval = setInterval(() => {
      setResult({ type, text: pool[i % pool.length] });
      i++;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setResult({ type, text: pick });
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card">
      <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-300" />
      <div className="p-5 space-y-4 text-center">
        <h3 className="text-sm font-semibold text-gray-500">真心话大冒险</h3>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => spin('truth')}
            disabled={spinning}
            className="bg-rose-500 text-white px-6 py-3 rounded-xl font-medium text-sm active:scale-95 transition-transform disabled:opacity-50 shadow-sm"
          >
            真心话
          </button>
          <button
            onClick={() => spin('dare')}
            disabled={spinning}
            className="bg-gray-700 text-white px-6 py-3 rounded-xl font-medium text-sm active:scale-95 transition-transform disabled:opacity-50 shadow-sm"
          >
            大冒险
          </button>
        </div>

        {spinning && (
          <div className="text-3xl animate-spin">✨</div>
        )}

        {result && !spinning && (
          <div className="bg-gray-50 rounded-xl px-4 py-6 animate-fade-in-up">
            <p className="text-xs text-gray-500 mb-1">
              {result.type === 'truth' ? '真心话' : '大冒险'}
            </p>
            <p className="text-lg font-medium text-gray-800">{result.text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
