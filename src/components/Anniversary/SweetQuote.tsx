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
  '你笑起来真好看，像春天的花一样',
  '我想和你一起慢慢变老',
  '你是我最不想失去的人',
  '想牵你的手，从心动到白头',
  '你的名字，是我见过最短的情诗',
  '全世界都在恋爱，而我在和你恋爱',
  '你是我计划之外的惊喜',
  '喜欢你是一件很幸福的事',
  '余生很长，请多指教',
  '你是我的今天，也是我所有的明天',
  '我对你的喜欢，像是碳酸饮料里的气泡',
  '你是我藏在心底的秘密',
  '想和你一起看遍世间所有美景',
  '你是我最甜蜜的负担',
  '因为你，我愿意成为更好的人',
  '你是我失眠时唯一想聊天的人',
  '喜欢你这件事，我从来没后悔过',
];

export default function SweetQuote() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // Use date as seed for consistent daily random
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % quotes.length;
    setQuote(quotes[index]);
  }, []);

  if (!quote) return null;

  return (
    <div className="relative bg-rose-50/30 rounded-2xl px-7 py-6 border border-rose-100/60 overflow-hidden">
      <span className="absolute -top-2 left-3 text-6xl leading-none font-serif text-rose-200/60 select-none">
        &ldquo;
      </span>
      <p className="relative text-rose-700 text-base leading-relaxed italic tracking-wide pl-3">
        {quote}
      </p>
      <p className="text-rose-300 text-[10px] tracking-widest uppercase text-right mt-3">
        每日情话
      </p>
    </div>
  );
}
