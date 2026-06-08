'use client';
import { useState, useEffect, useCallback } from 'react';

const EMOJIS = ['❤️', '🌹', '💕', '🥰', '😘', '💑', '💍', '🎀'];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [firstPick, setFirstPick] = useState<number | null>(null);
  const [secondPick, setSecondPick] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const initGame = useCallback(() => {
    const pairs = EMOJIS.flatMap((emoji, i) => [
      { id: i * 2, emoji, flipped: false, matched: false },
      { id: i * 2 + 1, emoji, flipped: false, matched: false },
    ]);
    setCards(shuffle(pairs));
    setFirstPick(null);
    setSecondPick(null);
    setMoves(0);
    setWon(false);
    setDisabled(false);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const handleFlip = (idx: number) => {
    if (disabled || cards[idx].flipped || cards[idx].matched) return;
    if (firstPick === null) {
      setFirstPick(idx);
      setCards(prev => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c));
    } else if (secondPick === null && idx !== firstPick) {
      setSecondPick(idx);
      setCards(prev => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c));
      setMoves(m => m + 1);
      setDisabled(true);

      const newCards = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c);
      if (newCards[firstPick].emoji === newCards[idx].emoji) {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === firstPick || i === idx) ? { ...c, matched: true } : c));
          setFirstPick(null);
          setSecondPick(null);
          setDisabled(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((c, i) => (i === firstPick || i === idx) ? { ...c, flipped: false } : c));
          setFirstPick(null);
          setSecondPick(null);
          setDisabled(false);
        }, 800);
      }
    }
  };

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      setWon(true);
    }
  }, [cards]);

  return (
    <div className="px-2 space-y-6">
      {/* 状态栏 */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-500">翻了 <span className="font-bold text-gray-800">{moves}</span> 次</div>
        <button onClick={initGame} className="text-sm text-emerald-500 font-medium hover:text-emerald-600">重新开始</button>
      </div>

      {/* 胜利提示 */}
      {won && (
        <div className="text-center py-4 animate-fade-in-up">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-lg font-bold text-gray-800">恭喜！{moves} 次翻完</p>
          <p className="text-sm text-gray-500 mt-1">
            {moves <= 10 ? '记忆力超群！' : moves <= 16 ? '不错不错！' : '再接再厉～'}
          </p>
        </div>
      )}

      {/* 卡牌网格 */}
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => handleFlip(i)}
            className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all duration-300 ${
              card.flipped || card.matched
                ? card.matched
                  ? 'bg-emerald-50 border-2 border-emerald-200 scale-95'
                  : 'bg-white border-2 border-gray-200'
                : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 active:scale-95'
            }`}
          >
            {card.flipped || card.matched ? card.emoji : '?'}
          </button>
        ))}
      </div>
    </div>
  );
}
