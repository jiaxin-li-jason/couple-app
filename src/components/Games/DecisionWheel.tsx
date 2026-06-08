'use client';
import { useState, useRef } from 'react';

const DEFAULT_OPTIONS = ['火锅🍲', '烧烤🍖', '寿司🍣', '奶茶🧋', '披萨🍕', '麻辣烫🌶️'];

const COLORS = [
  'from-rose-400 to-rose-500',
  'from-amber-400 to-amber-500',
  'from-emerald-400 to-emerald-500',
  'from-blue-400 to-blue-500',
  'from-violet-400 to-violet-500',
  'from-pink-400 to-pink-500',
  'from-cyan-400 to-cyan-500',
  'from-orange-400 to-orange-500',
];

export default function DecisionWheel() {
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [newOption, setNewOption] = useState('');
  const [editing, setEditing] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (spinning || options.length < 2) return;
    setSpinning(true);
    setResult(null);

    const extraRotation = 1800 + Math.random() * 1800; // 5-10 full spins
    const newRotation = rotation + extraRotation;
    setRotation(newRotation);

    setTimeout(() => {
      const segmentAngle = 360 / options.length;
      const normalizedAngle = (360 - (newRotation % 360)) % 360;
      const idx = Math.floor(normalizedAngle / segmentAngle) % options.length;
      setResult(options[idx]);
      setSpinning(false);
    }, 3500);
  };

  const addOption = () => {
    if (newOption.trim() && options.length < 8) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (idx: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== idx));
    }
  };

  return (
    <div className="px-4 space-y-6">
      {/* 转盘 */}
      <div className="relative flex items-center justify-center py-6">
        {/* 指针 */}
        <div className="absolute top-4 z-10 text-3xl">▼</div>

        {/* 转盘本体 */}
        <div
          ref={wheelRef}
          className="w-64 h-64 rounded-full border-4 border-gray-200 overflow-hidden relative"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          {options.map((opt, i) => {
            const angle = 360 / options.length;
            return (
              <div
                key={i}
                className={`absolute w-full h-full flex items-center justify-center bg-gradient-to-br ${COLORS[i % COLORS.length]}`}
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin((angle * Math.PI) / 180)}% ${50 - 50 * Math.cos((angle * Math.PI) / 180)}%)`,
                  transform: `rotate(${angle * i}deg)`,
                }}
              >
                <span
                  className="text-white text-xs font-bold"
                  style={{ transform: `rotate(${angle / 2}deg) translateY(-40px)` }}
                >
                  {opt}
                </span>
              </div>
            );
          })}
          {/* 中心圆 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white shadow-md z-10" />
          </div>
        </div>
      </div>

      {/* 结果 */}
      {result && !spinning && (
        <div className="text-center animate-fade-in-up">
          <p className="text-sm text-gray-400 mb-1">转盘决定</p>
          <p className="text-2xl font-bold text-gray-800">{result}</p>
        </div>
      )}

      {/* 转按钮 */}
      <button
        onClick={spin}
        disabled={spinning}
        className="w-full bg-gradient-to-r from-violet-400 to-purple-500 text-white py-4 rounded-2xl text-base font-bold active:scale-[0.98] transition-all shadow-lg shadow-violet-200/50 disabled:opacity-50"
      >
        {spinning ? '转转转...' : '🎯 转一下'}
      </button>

      {/* 编辑选项 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <button onClick={() => setEditing(!editing)} className="text-sm text-gray-500 font-medium">
          {editing ? '收起' : '✏️ 自定义选项'}
        </button>

        {editing && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {options.map((opt, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1.5 text-sm text-gray-700">
                  {opt}
                  {options.length > 2 && (
                    <button onClick={() => removeOption(i)} className="text-gray-400 hover:text-red-400 ml-1">✕</button>
                  )}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addOption(); }}
                placeholder="添加选项..."
                maxLength={10}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-300"
              />
              <button onClick={addOption} disabled={options.length >= 8} className="bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40">添加</button>
            </div>
            <p className="text-xs text-gray-400">最多 8 个选项，至少保留 2 个</p>
          </div>
        )}
      </div>

      {/* 快捷主题 */}
      {editing && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium">快捷主题</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '吃什么', opts: ['火锅🍲', '烧烤🍖', '寿司🍣', '奶茶🧋', '披萨🍕', '麻辣烫🌶️'] },
              { label: '谁洗碗', opts: ['你洗', '我洗', '猜拳决定', '都不洗😂'] },
              { label: '今晚干嘛', opts: ['看电影🎬', '散步🌙', '打游戏🎮', '早点睡😴', '聊天💬'] },
            ].map((theme) => (
              <button
                key={theme.label}
                onClick={() => { setOptions(theme.opts); setEditing(false); }}
                className="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-600 hover:bg-gray-100"
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
