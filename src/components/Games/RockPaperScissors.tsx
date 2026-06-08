'use client';
import { useState } from 'react';

const CHOICES = [
  { name: '石头', emoji: '✊' },
  { name: '剪刀', emoji: '✌️' },
  { name: '布', emoji: '🖐️' },
];

const PUNISHMENTS = [
  '给对方按摩一分钟',
  '夸对方三句话',
  '做十个俯卧撑',
  '给对方倒杯水',
  '学动物叫三声',
  '唱一句情歌',
  '说"我爱你"十遍',
  '给对方一个拥抱',
  '模仿对方说话',
  '做鬼脸自拍发给对方',
];

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<number | null>(null);
  const [computerChoice, setComputerChoice] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [punishment, setPunishment] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [scores, setScores] = useState({ player: 0, computer: 0 });

  const play = (idx: number) => {
    setPlaying(true);
    setPlayerChoice(idx);
    setComputerChoice(null);
    setResult(null);
    setPunishment(null);

    // Animate computer choice
    let i = 0;
    const interval = setInterval(() => {
      setComputerChoice(i % 3);
      i++;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const comp = Math.floor(Math.random() * 3);
      setComputerChoice(comp);

      const diff = (idx - comp + 3) % 3;
      if (diff === 0) {
        setResult('draw');
      } else if (diff === 1) {
        setResult('win');
        setScores(s => ({ ...s, player: s.player + 1 }));
      } else {
        setResult('lose');
        setScores(s => ({ ...s, computer: s.computer + 1 }));
        setPunishment(PUNISHMENTS[Math.floor(Math.random() * PUNISHMENTS.length)]);
      }
      setPlaying(false);
    }, 800);
  };

  const resultText = result === 'win' ? '你赢了！🎉' : result === 'lose' ? '你输了 😅' : '平局 🤝';
  const resultColor = result === 'win' ? 'text-emerald-500' : result === 'lose' ? 'text-rose-500' : 'text-gray-500';

  return (
    <div className="px-4 space-y-8">
      {/* 比分 */}
      <div className="flex items-center justify-center gap-8 py-4">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">你</p>
          <p className="text-3xl font-black text-emerald-500">{scores.player}</p>
        </div>
        <span className="text-gray-300 text-2xl">:</span>
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">对方</p>
          <p className="text-3xl font-black text-rose-500">{scores.computer}</p>
        </div>
      </div>

      {/* 对战区 */}
      <div className="flex items-center justify-center gap-8">
        <div className="text-center">
          <p className="text-5xl mb-2">{playerChoice !== null ? CHOICES[playerChoice].emoji : '❓'}</p>
          <p className="text-xs text-gray-400">你</p>
        </div>
        <span className="text-2xl text-gray-300">VS</span>
        <div className="text-center">
          <p className="text-5xl mb-2">{computerChoice !== null ? CHOICES[computerChoice].emoji : '❓'}</p>
          <p className="text-xs text-gray-400">对方</p>
        </div>
      </div>

      {/* 结果 */}
      {result && (
        <div className="text-center animate-fade-in-up">
          <p className={`text-xl font-bold ${resultColor}`}>{resultText}</p>
          {punishment && (
            <div className="mt-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
              <p className="text-xs text-rose-400 mb-1">惩罚</p>
              <p className="text-sm font-medium text-rose-600">{punishment}</p>
            </div>
          )}
        </div>
      )}

      {/* 出拳按钮 */}
      <div className="flex justify-center gap-4">
        {CHOICES.map((c, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            disabled={playing}
            className="w-24 h-24 bg-white rounded-2xl border-2 border-gray-100 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all hover:border-gray-300 hover:shadow-md disabled:opacity-50"
          >
            <span className="text-3xl">{c.emoji}</span>
            <span className="text-xs text-gray-500">{c.name}</span>
          </button>
        ))}
      </div>

      {/* 重置 */}
      <div className="text-center">
        <button onClick={() => setScores({ player: 0, computer: 0 })} className="text-sm text-gray-400 hover:text-gray-600">重置比分</button>
      </div>
    </div>
  );
}
