import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { location, weather, time, preferences } = await req.json();

  const prompt = `你是一个约会策划师。根据以下信息，生成一个具体的约会建议：

地点：${location}
天气：${weather}
可用时间：${time}
${preferences ? `偏好：${preferences}` : ''}

请按以下格式输出（不要用markdown，用纯文本）：
🎯 主题：xxx

📍 行程安排：
1. 时间 - 地点/活动 - 简要说明
2. 时间 - 地点/活动 - 简要说明
3. 时间 - 地点/活动 - 简要说明

💡 小贴士：
- xxx
- xxx

💰 预估花费：xxx

要求：具体到餐厅/景点名称，给出实际可执行的方案，语言简洁温馨。`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '抱歉，生成失败，请稍后再试。';
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ text: '网络错误，请稍后再试。' }, { status: 500 });
  }
}
