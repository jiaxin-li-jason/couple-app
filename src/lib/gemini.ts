// 前端直调 Gemini API（key 通过 NEXT_PUBLIC_GEMINI_API_KEY 在构建时注入）
// 说明：原实现为 Next.js API route 隐藏 key；静态托管不支持 API route，
// 故改为前端直调。这是私人情侣 app，key 暴露风险可接受。

const KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const MODELS = ['gemini-2.5-flash-lite', 'gemini-2.5-flash'];

async function callGemini(
  prompt: string,
  opts?: { temperature?: number; maxOutputTokens?: number }
): Promise<string> {
  const { temperature, maxOutputTokens } = opts || {};
  const generationConfig: Record<string, unknown> = {};
  if (temperature !== undefined) generationConfig.temperature = temperature;
  if (maxOutputTokens !== undefined) generationConfig.maxOutputTokens = maxOutputTokens;

  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig,
          }),
        }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch {
      continue;
    }
  }
  throw new Error('Gemini 调用失败');
}

/** 每日一句 */
export async function generateDailyQuote(): Promise<string> {
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

  const text = await callGemini(prompt, { temperature: 0.9, maxOutputTokens: 100 });
  return text.replace(/^["'「]|["'」]$/g, '').trim();
}

/** AI 约会建议 */
export async function generateDateAdvice(params: {
  location: string;
  weather?: string;
  time?: string;
  preferences?: string;
}): Promise<string> {
  const { location, weather, time, preferences } = params;

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

  const text = await callGemini(prompt);
  return text.trim();
}
