'use client';
import { useState } from 'react';

const TASKS: Record<number, { icon: string; task: string; color: string }> = {
  1: { icon: '💋', task: '亲对方一下', color: 'from-rose-400 to-pink-500' },
  2: { icon: '🥰', task: '说三句夸对方的话', color: 'from-amber-400 to-orange-500' },
  3: { icon: '🤗', task: '给对方一个拥抱', color: 'from-violet-400 to-purple-500' },
  4: { icon: '📸', task: '一起拍一张合照', color: 'from-blue-400 to-cyan-500' },
  5: { icon: '💕', task: '说出你最喜欢对方的一个习惯', color: 'from-pink-400 to-rose-500' },
  6: { icon: '🎵', task: '给对方唱一首歌', color: 'from-emerald-400 to-teal-500' },
};

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export default function CoupleDice() {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const roll = () => {
    setRolling(true);
    setResult(null);

    let i = 0;
    const interval = setInterval(() => {
      setResult(Math.floor(Math.random() * 6) + 1);
      i++;
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      const final = Math.floor(Math.random() * 6) + 1;
      setResult(final);
      setHistory(h => [final, ...h].slice(0, 10));
      setRolling(false);
    }, 1200);
  };

  const task = result ? TASKS[result] : null;

  return (
    <div className="px-4 space-y-8">
      {/* 骰子 */}
      <div className="text-center py-8">
        <div className={`inline-flex items-center justify-center w-32 h-32 rounded-3xl text-7xl bg-white border-2 border-gray-100 shadow-lg transition-all ${rolling ? 'animate-spin' : ''}`}>
          {result ? DICE_FACES[result - 1] : '🎲'}
        </div>
      </div>

      {/* 任务卡 */}
      {task && !rolling && (
        <div className={`bg-gradient-to-br ${task.color} rounded-2xl p-6 text-center text-white animate-fade-in-up shadow-lg`}>
          <p className="text-4xl mb-3">{task.icon}</p>
          <p className="text-lg font-bold">{task.task}</p>
        </div>
      )}

      {/* 掷骰子按钮 */}
      <button
        onClick={roll}
        disabled={rolling}
        className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-2xl text-base font-bold active:scale-[0.98] transition-all shadow-lg shadow-amber-200/50 disabled:opacity-50"
      >
        {rolling ? '摇一摇...' : '🎲 掷骰子'}
      </button>

      {/* 历史记录 */}
      {history.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium">最近记录</p>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1 text-xs text-gray-600">
                {TASKS[h].icon} {TASKS[h].task.slice(0, 6)}...
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
