import { NextResponse } from 'next/server';

export async function POST() {
  const today = new Date();
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][today.getDay()];
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日 周${weekday}`;

  const prompt = `你是齐齐和Jerry的爱情助手。今天是${dateStr}。

请给他们写一段今天的话（50字以内）。要求：
- 不要土味情话，不要心灵鸡汤
- 要么有趣/俏皮，要么温暖/真实，要么有生活感
- 可以跟今天是周几有关（比如周一吐槽、周五开心、周末慵懒）
- 可以提到天气、季节、生活琐事
- 偶尔可以幽默、偶尔可以文艺、偶尔可以很日常
- 不要每次都像情话，有时候像朋友的碎碎念也可以
- 直接输出内容，不要任何前缀、解释或引号`;

  const key = process.env.GEMINI_API_KEY;
  const models = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.9, maxOutputTokens: 100 },
          }),
        }
      );

      if (!response.ok) continue;

      const data = await response.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) {
        // 去掉可能的引号
        text = text.replace(/^["'"「]|["'"」]$/g, '');
        return NextResponse.json({ text, date: dateStr });
      }
    } catch {
      continue;
    }
  }

  // 兜底
  return NextResponse.json({ text: '今天也想见到你 ☀️', date: dateStr });
}
