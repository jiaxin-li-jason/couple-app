'use client';
import { useState } from 'react';

const TRUTHS = [
  '第一次约会时你心里在想什么？',
  '做过最让TA吃醋的一件事？',
  '你有什么还没告诉TA的小秘密？',
  'TA的哪个习惯你会偷偷吐槽？',
  '你觉得TA最可爱的瞬间是？',
  '你最想对TA说但一直没说出口的话？',
  'TA做过最让你感动的事是什么？',
  '你偷偷存了TA的哪张照片？',
  '你最怕TA知道的一件事？',
  'TA的哪个小动作让你心动？',
];

const DARES = [
  '给TA发一段语音说"我爱你"',
  '模仿TA的一个经典表情/动作',
  '发一张你现在的自拍给TA',
  '用emoji描述你们的下次约会',
  '闭上眼睛，用三个词形容TA',
  '给TA一个10秒的拥抱',
  '对TA做鬼脸直到TA笑',
  '大声说"我最喜欢的人是XXX"',
  '给TA按摩一分钟',
  '学TA说话的语气说一句话',
];

export default function TruthOrDare() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ type: string; text: string } | null>(null);
  const [history, setHistory] = useState<{ type: string; text: string }[]>([]);

  const spin = (type: 'truth' | 'dare') => {
    setSpinning(true);
    setResult(null);

    const pool = type === 'truth' ? TRUTHS : DARES;
    let i = 0;
    const interval = setInterval(() => {
      setResult({ type, text: pool[i % pool.length] });
      i++;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      const r = { type, text: pick };
      setResult(r);
      setHistory(h => [r, ...h].slice(0, 5));
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="px-4 space-y-6">
      {/* 标题区域 */}
      <div className="text-center py-4">
        <p className="text-4xl mb-2">🎭</p>
        <p className="text-sm text-gray-500">选择真心话或大冒险</p>
      </div>

      {/* 按钮 */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => spin('truth')}
          disabled={spinning}
          className="bg-gradient-to-r from-rose-400 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform disabled:opacity-50 shadow-lg shadow-rose-200/50"
        >
          💬 真心话
        </button>
        <button
          onClick={() => spin('dare')}
          disabled={spinning}
          className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-base active:scale-95 transition-transform disabled:opacity-50 shadow-lg"
        >
          🔥 大冒险
        </button>
      </div>

      {/* 转动动画 */}
      {spinning && (
        <div className="text-center py-6">
          <div className="text-4xl animate-spin inline-block">✨</div>
        </div>
      )}

      {/* 结果 */}
      {result && !spinning && (
        <div className={`rounded-2xl px-6 py-8 text-center animate-fade-in-up ${
          result.type === 'truth' ? 'bg-rose-50 border border-rose-100' : 'bg-gray-50 border border-gray-200'
        }`}>
          <p className="text-xs text-gray-500 mb-2 font-medium">
            {result.type === 'truth' ? '💬 真心话' : '🔥 大冒险'}
          </p>
          <p className="text-lg font-bold text-gray-800 leading-relaxed">{result.text}</p>
        </div>
      )}

      {/* 历史 */}
      {history.length > 0 && !spinning && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium">最近记录</p>
          {history.map((h, i) => (
            <div key={i} className="bg-gray-50 rounded-xl px-4 py-2.5 flex items-center gap-2">
              <span className="text-sm">{h.type === 'truth' ? '💬' : '🔥'}</span>
              <p className="text-xs text-gray-600 flex-1 truncate">{h.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
