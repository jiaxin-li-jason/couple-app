'use client';
import { useState, useEffect } from 'react';

const quotes = [
  '遇见你，是我这辈子最幸运的事',
  '和你在一起的每一天都是纪念日',
  '有你的地方，就是家',
  '你是我所有美好故事的开始',
  '在60亿人中遇见你，概率是60亿分之一',
  '我不完美，但有你在，我就觉得自己完整了',
  '今天也想见到你，不管什么天气',
];

export default function SweetQuote() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  if (!quote) return null;

  return (
    <div className="bg-rose-50/60 rounded-xl px-5 py-4 border border-rose-100 card">
      <p className="text-rose-700 text-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
    </div>
  );
}
