'use client';
import { useState, useEffect } from 'react';

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
    fetch('/api/daily-quote', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.text) {
          setQuote(data.text);
          localStorage.setItem(cacheKey, JSON.stringify({ text: data.text, date: today }));
        }
      })
      .catch(() => {
        setQuote('今天也想见到你 ☀️');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="relative bg-rose-50/30 rounded-2xl px-7 py-6 border border-rose-100/60 overflow-hidden animate-pulse">
        <div className="h-4 bg-rose-100/40 rounded w-3/4 mb-2" />
        <div className="h-4 bg-rose-100/40 rounded w-1/2" />
      </div>
    );
  }

  return (
    <div className="relative bg-rose-50/30 rounded-2xl px-7 py-6 border border-rose-100/60 overflow-hidden">
      <span className="absolute -top-2 left-3 text-6xl leading-none font-serif text-rose-200/60 select-none">
        &ldquo;
      </span>
      <p className="relative text-rose-700 text-base leading-relaxed tracking-wide pl-3">
        {quote}
      </p>
      <p className="text-rose-300 text-[10px] tracking-widest uppercase text-right mt-3">
        ✨ AI · 齐齐 & Jerry
      </p>
    </div>
  );
}
