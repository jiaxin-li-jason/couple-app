'use client';
import { useState } from 'react';
import { generateDateAdvice } from '@/lib/gemini';

export default function DateSuggestion() {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState('');
  const [time, setTime] = useState('');
  const [preferences, setPreferences] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const WEATHER_OPTS = ['☀️ 晴天', '⛅ 多云', '🌧️ 下雨', '❄️ 下雪', '🌙 晚上'];
  const TIME_OPTS = ['2小时', '半天', '一整天', '周末两天'];

  const generate = async () => {
    if (!location.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const text = await generateDateAdvice({
        location: location.trim(),
        weather: weather || '不限',
        time: time || '不限',
        preferences: preferences.trim() || undefined,
      });
      setResult(text);
    } catch {
      setResult('生成失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card">
      <div className="h-1 bg-gradient-to-r from-rose-400 to-pink-300" />
      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-500">🤖 AI 约会建议</h3>
          <p className="text-xs text-gray-400 mt-0.5">告诉 AI 你的情况，生成专属约会方案</p>
        </div>

        {/* 地点 */}
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="📍 在哪里？（如：北京三里屯）"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-300 focus:bg-white transition-all"
        />

        {/* 天气快捷选择 */}
        <div>
          <p className="text-xs text-gray-400 mb-2">🌤️ 天气</p>
          <div className="flex flex-wrap gap-2">
            {WEATHER_OPTS.map((w) => (
              <button
                key={w}
                onClick={() => setWeather(weather === w ? '' : w)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  weather === w
                    ? 'bg-rose-50 text-rose-600 font-medium ring-1 ring-rose-200'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* 时间快捷选择 */}
        <div>
          <p className="text-xs text-gray-400 mb-2">⏰ 可用时间</p>
          <div className="flex flex-wrap gap-2">
            {TIME_OPTS.map((t) => (
              <button
                key={t}
                onClick={() => setTime(time === t ? '' : t)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  time === t
                    ? 'bg-rose-50 text-rose-600 font-medium ring-1 ring-rose-200'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 偏好（可选） */}
        <input
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="💡 偏好（可选，如：想吃火锅/预算200/不想走太远）"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-rose-300 focus:bg-white transition-all"
        />

        {/* 生成按钮 */}
        <button
          onClick={generate}
          disabled={!location.trim() || loading}
          className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3.5 rounded-xl text-sm font-bold disabled:opacity-40 active:scale-[0.98] transition-all shadow-sm shadow-rose-200/50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin text-base">✨</span>
              AI 正在策划中...
            </span>
          ) : (
            '🎯 生成约会方案'
          )}
        </button>

        {/* 结果 */}
        {result && (
          <div className="bg-gradient-to-br from-rose-50/50 to-pink-50/30 border border-rose-100/60 rounded-xl p-4 animate-fade-in-up">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
