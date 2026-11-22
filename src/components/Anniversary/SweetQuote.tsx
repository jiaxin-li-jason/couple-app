'use client';
import { useState, useEffect } from 'react';
import { generateDailyQuote } from '@/lib/gemini';

export default function SweetQuote() {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = 'daily-quote';
    const cached = localStorage.getItem(cacheKey);

    // 如果今天已经缓存过了，直接用
    if (cached) {
      try {
        const { text, date } = JSON.parse(cached);
        if (date === today) {
          setQuote(text);
          setLoading(false);
          return;
        }
      } catch {}
    }

    // 否则请求 AI
    generateDailyQuote()
      .then((text) => {
        if (text) {
          setQuote(text);
          localStorage.setItem(cacheKey, JSON.stringify({ text, date: today }));
        }
      })
      .catch(() => {
        setQuote('今天也想见到你 ☀️');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="relative bg-warm-50 rounded-2xl px-6 py-6 border border-warm-100/60 overflow-hidden">
        {/* 装饰引号占位 */}
        <span
          className="absolute top-1 left-4 text-6xl leading-none select-none text-warm-200/30"
          style={{ fontFamily: '"Noto Serif SC", "Noto Serif", Georgia, serif' }}
        >
          &ldquo;
        </span>
        <div className="animate-pulse space-y-2 pl-4">
          <div className="h-4 bg-warm-200/30 rounded w-4/5" />
          <div className="h-4 bg-warm-200/30 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-warm-50 rounded-2xl px-6 py-6 border border-warm-100/60 overflow-hidden">
      {/* 大号 serif 左引号装饰 */}
      <span
        className="absolute top-1 left-4 text-6xl leading-none select-none text-rose-200/40"
        style={{ fontFamily: '"Noto Serif SC", "Noto Serif", Georgia, serif' }}
      >
        &ldquo;
      </span>

      {/* 正文 */}
      <p className="relative text-warm-800 text-[0.95rem] leading-relaxed tracking-wide pl-5 pr-1">
        {quote}
      </p>

      {/* 低调的 AI 标记 */}
      <div className="flex items-center justify-end mt-4 gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#c4b8a9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
        <span className="text-warm-300 text-[10px] tracking-wider">
          AI · 齐齐 & Jerry
        </span>
      </div>
    </div>
  );
}
