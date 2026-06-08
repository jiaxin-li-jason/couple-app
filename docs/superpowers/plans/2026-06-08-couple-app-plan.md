# 情侣App 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一款 PWA 情侣应用，包含纪念日倒计时、相册回忆墙、专属聊天、情侣互动四个模块，通过 Vercel 一键部署。

**Architecture:** Next.js 14 App Router + Tailwind CSS 前端，Supabase 作为后端（数据库 + 实时 + 存储），next-pwa 提供 PWA 支持。无需邮箱注册，通过 device_id + 配对码认证。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase (DB + Auth + Storage + Realtime), next-pwa, Vercel

---

## 文件结构规划

```
couple-app/
├── .env.local.example              — Supabase 配置模板
├── next.config.js                  — Next.js + PWA 配置
├── tailwind.config.ts              — Tailwind 主题配置
├── package.json
├── tsconfig.json
├── supabase/
│   └── schema.sql                  — 数据库建表 + RLS 策略
├── public/
│   ├── manifest.json               — PWA Manifest
│   ├── icons/
│   │   └── icon-192.png, icon-512.png
│   └── splash/
│       └── apple-splash-*.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              — 根布局（含 TabBar + 配对守卫）
│   │   ├── page.tsx                — 首页：纪念日模块
│   │   ├── globals.css             — 全局样式 + Tailwind
│   │   ├── album/
│   │   │   ├── page.tsx            — 相册主页
│   │   │   └── [id]/
│   │   │       └── page.tsx        — 照片详情页
│   │   ├── chat/
│   │   │   └── page.tsx            — 聊天页
│   │   ├── play/
│   │   │   └── page.tsx            — 互动广场
│   │   └── settings/
│   │       └── page.tsx            — 设置页
│   ├── components/
│   │   ├── TabBar.tsx              — 底部4Tab导航
│   │   ├── PairingGuard.tsx        — 配对流程组件
│   │   ├── Anniversary/
│   │   │   ├── DaysCounter.tsx     — 在一起天数大字
│   │   │   ├── CountdownList.tsx   — 纪念日列表+倒计时
│   │   │   ├── AnniversaryForm.tsx — 添加/编辑纪念日
│   │   │   └── SweetQuote.tsx      — 随机甜蜜语录
│   │   ├── Album/
│   │   │   ├── PhotoGrid.tsx       — 照片网格
│   │   │   ├── PhotoCard.tsx       — 单张照片卡片
│   │   │   ├── PhotoUpload.tsx     — 图片上传（含压缩）
│   │   │   ├── PhotoDetail.tsx     — 照片详情（含评论点赞）
│   │   │   └── Timeline.tsx        — 时间线视图
│   │   ├── Chat/
│   │   │   ├── MessageList.tsx     — 消息列表
│   │   │   ├── ChatInput.tsx       — 消息输入框
│   │   │   ├── ChatBubble.tsx      — 消息气泡
│   │   │   ├── VoiceRecorder.tsx   — 语音录制
│   │   │   └── ImagePicker.tsx     — 图片选择/拍照
│   │   └── Play/
│   │       ├── DailyQuestion.tsx   — 每日一问
│   │       ├── QuizCreate.tsx      — 互相出题
│   │       ├── QuizAnswer.tsx      — 答题
│   │       ├── ChallengeForm.tsx   — 创建打卡挑战
│   │       ├── ChallengeCard.tsx   — 打卡挑战卡片
│   │       └── Spinner.tsx         — 真心话大冒险转盘
│   ├── lib/
│   │   ├── supabase.ts             — Supabase 客户端
│   │   ├── auth.ts                 — 认证/配对逻辑
│   │   ├── notifications.ts        — 推送通知
│   │   └── utils.ts                — 工具函数
│   └── hooks/
│       ├── useAuth.ts              — 认证状态hook
│       ├── useChat.ts              — 聊天hook（实时订阅）
│       ├── usePhotos.ts            — 照片CRUD hook
│       └── useAnniversaries.ts     — 纪念日hook
```

---

## 阶段一：项目基础架构 (Task 1–6)

### Task 1: 初始化 Next.js 项目 + 依赖安装

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`, `.env.local.example`

- [ ] **Step 1: 创建 Next.js 项目**

```bash
cd /Users/a009/Desktop/情侣app
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

Expected: Next.js 14 项目创建成功，package.json 就绪。

- [ ] **Step 2: 安装额外依赖**

```bash
cd /Users/a009/Desktop/情侣app
npm install @supabase/supabase-js @supabase/ssr next-pwa browser-image-compression react-hot-toast date-fns
npm install --save-dev @types/node
```

包说明：
- `@supabase/supabase-js` — Supabase 客户端
- `@supabase/ssr` — Next.js 服务端渲染支持的 Supabase 辅助
- `next-pwa` — PWA 支持
- `browser-image-compression` — 图片压缩
- `react-hot-toast` — Toast 提示
- `date-fns` — 日期工具

Expected: 所有依赖安装成功。

- [ ] **Step 3: 配置 next.config.js**

File: `next.config.js`
```js
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
```

- [ ] **Step 4: 配置 Tailwind 主题**

File: `tailwind.config.ts`
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f4',
          100: '#d8f0e3',
          200: '#b3e1c9',
          300: '#81cba8',
          400: '#4dae80',
          500: '#2d9365',
          600: '#1e7650',
          700: '#185e41',
          800: '#154b35',
          900: '#123e2d',
        },
        love: {
          50: '#fef2f2',
          100: '#ffe1e1',
          200: '#ffc8c8',
          300: '#ffa3a3',
          400: '#ff6b6b',
          500: '#f83b3b',
          600: '#e51d1d',
          700: '#c11414',
          800: '#a01515',
          900: '#841818',
        },
      },
      fontFamily: {
        sans: ['"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 5: 配置环境变量模板**

File: `.env.local.example`
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

- [ ] **Step 6: 写入 globals.css**

File: `src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* iOS Safari PWA safe area */
body {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

/* Prevent pull-to-refresh in PWA */
html, body {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}
```

- [ ] **Step 7: 提交**

```bash
git init
git add -A
git commit -m "feat: init Next.js project with Tailwind, Supabase, next-pwa

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Supabase 客户端配置

**Files:**
- Create: `src/lib/supabase.ts`, `src/lib/utils.ts`

- [ ] **Step 1: 创建 Supabase 客户端**

File: `src/lib/supabase.ts`
```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export type Database = {
  users: {
    id: string;
    nickname: string;
    avatar_url: string | null;
    partner_id: string | null;
    pair_code: string | null;
    device_id: string;
    created_at: string;
  };
  anniversaries: {
    id: string;
    title: string;
    date: string;
    type: string;
    created_by: string;
    created_at: string;
  };
  photos: {
    id: string;
    image_url: string;
    caption: string;
    uploaded_by: string;
    month_tag: string;
    created_at: string;
  };
  comments: {
    id: string;
    photo_id: string;
    user_id: string;
    text: string;
    created_at: string;
  };
  likes: {
    id: string;
    photo_id: string;
    user_id: string;
    created_at: string;
  };
  messages: {
    id: string;
    sender_id: string;
    type: 'text' | 'image' | 'voice';
    content: string;
    read: boolean;
    created_at: string;
  };
  daily_questions: {
    id: string;
    question: string;
    date: string;
    created_at: string;
  };
  answers: {
    id: string;
    question_id: string;
    user_id: string;
    answer: string;
    created_at: string;
  };
  challenges: {
    id: string;
    title: string;
    description: string;
    total_days: number;
    created_by: string;
    active: boolean;
    created_at: string;
  };
  checkins: {
    id: string;
    challenge_id: string;
    user_id: string;
    checkin_date: string;
    note: string;
  };
  quiz_questions: {
    id: string;
    created_by: string;
    question: string;
    options: string[];
    correct_index: number;
    answered: boolean;
    created_at: string;
  };
  scores: {
    id: string;
    user_id: string;
    score: number;
  };
};
```

- [ ] **Step 2: 创建工具函数**

File: `src/lib/utils.ts`
```ts
import { format, formatDistanceToNow, differenceInDays, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/** 格式化日期为中文显示 */
export function formatDate(date: string): string {
  return format(parseISO(date), 'yyyy年M月d日', { locale: zhCN });
}

/** 计算距今还有多少天 */
export function daysUntil(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return differenceInDays(target, today);
}

/** 计算已过去多少天 */
export function daysSince(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return differenceInDays(today, target);
}

/** 生成6位随机配对码 */
export function generatePairCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** 生成设备ID（首次使用存localStorage） */
export function getDeviceId(): string {
  let id = localStorage.getItem('couple_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('couple_device_id', id);
  }
  return id;
}

/** 获取当前月份标签 YYYY-MM */
export function getMonthTag(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: add Supabase client and utility functions

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Supabase 数据库建表

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: 编写完整 SQL schema**

File: `supabase/schema.sql`
```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname TEXT DEFAULT '另一半',
  avatar_url TEXT,
  partner_id UUID REFERENCES users(id),
  pair_code TEXT UNIQUE,
  device_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 纪念日表
CREATE TABLE anniversaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT DEFAULT 'custom',
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 照片表
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  uploaded_by UUID REFERENCES users(id) NOT NULL,
  month_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 评论表
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 点赞表
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(photo_id, user_id)
);

-- 聊天消息表
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'voice')),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 每日一问表
CREATE TABLE daily_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  date DATE UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 回答表
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES daily_questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 打卡挑战表
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  total_days INTEGER NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 打卡记录表
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  checkin_date DATE NOT NULL,
  note TEXT DEFAULT '',
  UNIQUE(challenge_id, user_id, checkin_date)
);

-- 互相出题表
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES users(id) NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  answered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 积分表
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE NOT NULL,
  score INTEGER DEFAULT 0
);

-- 开启 Realtime（聊天需要）
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- ===== RLS 策略 =====

-- 启用所有表的 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE anniversaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- 辅助函数：获取当前用户的 partner_id
CREATE OR REPLACE FUNCTION get_partner_id()
RETURNS UUID AS $$
  SELECT partner_id FROM users WHERE id = (SELECT id FROM users WHERE device_id = current_setting('request.jwt.claims', true)::json->>'device_id');
$$ LANGUAGE sql STABLE;

-- 辅助函数：检查是否为配对用户
CREATE OR REPLACE FUNCTION is_partner(uploaded_by UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM users u1
    JOIN users u2 ON u2.id = u1.partner_id
    WHERE u1.id = uploaded_by
    AND u2.device_id = current_setting('request.jwt.claims', true)::json->>'device_id'
  ) OR EXISTS (
    SELECT 1 FROM users
    WHERE id = uploaded_by
    AND device_id = current_setting('request.jwt.claims', true)::json->>'device_id'
  );
$$ LANGUAGE sql STABLE;

-- users: 可读自己和搭档
CREATE POLICY users_select ON users FOR SELECT USING (
  device_id = current_setting('request.jwt.claims', true)::json->>'device_id'
  OR id = get_partner_id()
);

-- users: 可更新自己
CREATE POLICY users_update ON users FOR UPDATE USING (
  device_id = current_setting('request.jwt.claims', true)::json->>'device_id'
);

-- users: 可插入自己
CREATE POLICY users_insert ON users FOR INSERT WITH CHECK (
  device_id = current_setting('request.jwt.claims', true)::json->>'device_id'
);

-- anniversaries: 配对用户可读写
CREATE POLICY anniversaries_all ON anniversaries FOR ALL USING (is_partner(created_by));

-- photos: 配对用户可读写
CREATE POLICY photos_all ON photos FOR ALL USING (is_partner(uploaded_by));

-- comments: 配对用户可读写
CREATE POLICY comments_all ON comments FOR ALL USING (is_partner(user_id));

-- likes: 配对用户可读写
CREATE POLICY likes_all ON likes FOR ALL USING (is_partner(user_id));

-- messages: 配对用户可读写
CREATE POLICY messages_all ON messages FOR ALL USING (is_partner(sender_id));

-- daily_questions: 任何配对用户可读
CREATE POLICY daily_questions_select ON daily_questions FOR SELECT USING (true);

-- answers: 配对用户可读写
CREATE POLICY answers_all ON answers FOR ALL USING (is_partner(user_id));

-- challenges: 配对用户可读写
CREATE POLICY challenges_all ON challenges FOR ALL USING (is_partner(created_by));

-- checkins: 配对用户可读写
CREATE POLICY checkins_all ON checkins FOR ALL USING (is_partner(user_id));

-- quiz_questions: 配对用户可读写
CREATE POLICY quiz_questions_all ON quiz_questions FOR ALL USING (is_partner(created_by));

-- scores: 配对用户可读，可更新自己
CREATE POLICY scores_all ON scores FOR ALL USING (is_partner(user_id));
```

- [ ] **Step 2: 说明 Supabase 配置步骤（用户手动操作）**

这部分需要用户在 Supabase 后台手动操作：
1. 在 [supabase.com](https://supabase.com) 注册账号
2. 创建新项目（Free Tier）
3. 进入 SQL Editor，复制粘贴 `supabase/schema.sql` 全部内容并执行
4. 在 Storage 中创建4个存储桶：`photos`, `chat-images`, `chat-voice`, `avatars`
5. 将存储桶访问权限设为 `private`
6. 获取项目的 URL 和 anon key，填入 `.env.local`

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: add Supabase schema and RLS policies

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: PWA 配置

**Files:**
- Create: `public/manifest.json`, `public/icons/placeholder.txt`

- [ ] **Step 1: 创建 PWA manifest**

File: `public/manifest.json`
```json
{
  "name": "我们的空间",
  "short_name": "我们的空间",
  "description": "专属情侣空间 - 纪念日、相册、聊天、互动",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2d9365",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 2: 记录图标占位**

File: `public/icons/placeholder.txt`
```
你需要准备两个 PNG 图标（正方形）：
  - icon-192.png (192x192px)
  - icon-512.png (512x512px)

可以先用纯色方块代替，后续再替换。
建议使用 emoji 💑 或你们俩的照片做图标。
```

- [ ] **Step 3: 在根布局中加入 manifest 链接**

Add to `src/app/layout.tsx` (will be done in Task 5).

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: add PWA manifest configuration

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: 认证与配对逻辑

**Files:**
- Create: `src/lib/auth.ts`, `src/hooks/useAuth.ts`

- [ ] **Step 1: 实现认证逻辑**

File: `src/lib/auth.ts`
```ts
import { supabase } from './supabase';
import { getDeviceId, generatePairCode } from './utils';

/** 当前用户缓存 */
let _currentUser: { id: string; partner_id: string | null } | null = null;

/** 初始化或获取当前用户 */
export async function initUser(nickname?: string): Promise<{ id: string }> {
  const deviceId = getDeviceId();

  // 查找已有用户
  const { data: existing } = await supabase
    .from('users')
    .select('id, partner_id')
    .eq('device_id', deviceId)
    .single();

  if (existing) {
    _currentUser = existing;
    return existing;
  }

  // 创建新用户
  const { data: created, error } = await supabase
    .from('users')
    .insert({ device_id: deviceId, nickname: nickname || '另一半' })
    .select('id, partner_id')
    .single();

  if (error) throw error;
  _currentUser = created;
  return created;
}

/** 获取当前用户 */
export async function getCurrentUser() {
  if (_currentUser) return _currentUser;
  const deviceId = getDeviceId();
  const { data } = await supabase
    .from('users')
    .select('id, partner_id')
    .eq('device_id', deviceId)
    .single();
  _currentUser = data;
  return data;
}

/** 生成配对码 */
export async function createPairCode(): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error('用户未初始化');

  const code = generatePairCode();
  const { error } = await supabase
    .from('users')
    .update({ pair_code: code })
    .eq('id', user.id);

  if (error) throw error;
  return code;
}

/** 通过配对码绑定伴侣 */
export async function joinWithCode(code: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) throw new Error('用户未初始化');
  if (user.partner_id) throw new Error('已配对');

  // 查找配对码对应的用户
  const { data: partner } = await supabase
    .from('users')
    .select('id')
    .eq('pair_code', code)
    .single();

  if (!partner) return false;

  // 互相绑定
  const { error: e1 } = await supabase
    .from('users')
    .update({ partner_id: partner.id })
    .eq('id', user.id);

  const { error: e2 } = await supabase
    .from('users')
    .update({ partner_id: user.id, pair_code: null })
    .eq('id', partner.id);

  if (e1 || e2) throw new Error('绑定失败');

  _currentUser = { ...user, partner_id: partner.id };
  return true;
}
```

- [ ] **Step 2: 实现 useAuth hook**

File: `src/hooks/useAuth.ts`
```ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { initUser, getCurrentUser, createPairCode, joinWithCode } from '@/lib/auth';

interface AuthState {
  userId: string | null;
  partnerId: string | null;
  loading: boolean;
  paired: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    userId: null, partnerId: null, loading: true, paired: false,
  });

  useEffect(() => {
    initUser().then((user) => {
      setState({
        userId: user.id,
        partnerId: (user as any).partner_id || null,
        loading: false,
        paired: !!(user as any).partner_id,
      });
    });
  }, []);

  const generateCode = useCallback(async () => {
    const code = await createPairCode();
    return code;
  }, []);

  const pair = useCallback(async (code: string) => {
    const ok = await joinWithCode(code);
    if (ok) setState(s => ({ ...s, paired: true }));
    return ok;
  }, []);

  return { ...state, generateCode, pair };
}
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: add auth and pairing logic

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 6: TabBar 和根布局

**Files:**
- Create: `src/components/TabBar.tsx`, `src/components/PairingGuard.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: 创建 TabBar 组件**

File: `src/components/TabBar.tsx`
```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: '纪念日', icon: '🏠' },
  { href: '/album', label: '相册', icon: '🖼️' },
  { href: '/chat', label: '聊天', icon: '💬' },
  { href: '/play', label: '互动', icon: '🎮' },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                active ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs mt-1">{tab.label}</span>
            </Link>
          );
        })}
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            pathname === '/settings' ? 'text-primary-600' : 'text-gray-400'
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span className="text-xs mt-1">设置</span>
        </Link>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: 创建配对守卫组件**

File: `src/components/PairingGuard.tsx`
```tsx
'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function PairingGuard({ children }: { children: React.ReactNode }) {
  const { loading, paired, generateCode, pair } = useAuth();
  const [code, setCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [copied, setCopied] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  if (!paired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">我们的空间 💑</h1>
        <p className="text-gray-500 text-sm mb-8">先和你的另一半配对吧</p>

        <div className="w-full max-w-sm space-y-6">
          {/* 创建配对码 */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">我还没配对</h2>
            <button
              onClick={async () => {
                const c = await generateCode();
                setMyCode(c);
              }}
              className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium active:scale-95 transition-transform"
            >
              生成配对码
            </button>
            {myCode && (
              <div className="mt-3 text-center">
                <p className="text-gray-500 text-xs mb-1">你的配对码</p>
                <p
                  className="text-3xl font-bold tracking-widest text-primary-600 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(myCode);
                    setCopied(true);
                  }}
                >
                  {myCode}
                </p>
                {copied && <p className="text-green-500 text-xs mt-1">已复制！</p>}
                <p className="text-gray-400 text-xs mt-2">发送给你的另一半</p>
              </div>
            )}
          </div>

          {/* 输入配对码 */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">我有配对码</h2>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="输入6位配对码"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest outline-none focus:border-primary-400"
            />
            <button
              onClick={async () => {
                if (code.length !== 6) return;
                const ok = await pair(code);
                if (!ok) alert('配对码无效，请检查');
              }}
              disabled={code.length !== 6}
              className="w-full mt-3 bg-love-400 text-white py-3 rounded-xl font-medium disabled:opacity-40 active:scale-95 transition-transform"
            >
              绑定
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 3: 更新根布局**

File: `src/app/layout.tsx`
```tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import TabBar from '@/components/TabBar';
import PairingGuard from '@/components/PairingGuard';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: '我们的空间',
  description: '专属情侣空间',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '我们的空间',
    startupImage: [],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-white text-gray-900 font-sans antialiased">
        <PairingGuard>
          <main className="max-w-lg mx-auto min-h-screen pb-20 px-4">
            {children}
          </main>
          <TabBar />
        </PairingGuard>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: 更新首页占位**

File: `src/app/page.tsx`
```tsx
// 纪念日模块首页 — 将在 Task 8 实现完整功能
export default function Home() {
  return <div className="pt-6"><p>首页加载中...</p></div>;
}
```

- [ ] **Step 5: 创建其他路由页面占位**

Create minimal placeholder pages for each route:
- `src/app/album/page.tsx` → `export default function Album() { return <div className="pt-6">相册</div>; }`
- `src/app/album/[id]/page.tsx` → `export default function PhotoDetail() { return <div>照片详情</div>; }`
- `src/app/chat/page.tsx` → `export default function Chat() { return <div className="pt-6">聊天</div>; }`
- `src/app/play/page.tsx` → `export default function Play() { return <div className="pt-6">互动</div>; }`
- `src/app/settings/page.tsx` → `export default function Settings() { return <div className="pt-6">设置</div>; }`

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: add TabBar, pairing guard, root layout, and route placeholders

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## 阶段二：纪念日模块 (Task 7–8)

### Task 7: 纪念日 Hook

**Files:**
- Create: `src/hooks/useAnniversaries.ts`

- [ ] **Step 1: 实现 useAnniversaries hook**

File: `src/hooks/useAnniversaries.ts`
```ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export interface Anniversary {
  id: string;
  title: string;
  date: string;
  type: string;
  created_by: string;
  created_at: string;
}

export interface AnniversaryWithDays extends Anniversary {
  daysUntil: number;
  daysSince: number;
  isPast: boolean;
}

export function useAnniversaries() {
  const [anniversaries, setAnniversaries] = useState<AnniversaryWithDays[]>([]);
  const [loveDate, setLoveDate] = useState<string | null>(null);
  const [daysTogether, setDaysTogether] = useState(0);
  const [loading, setLoading] = useState(true);

  const processDates = useCallback((items: Anniversary[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const enriched = items.map((a) => {
      const target = new Date(a.date);
      target.setHours(0, 0, 0, 0);
      const diffMs = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return {
        ...a,
        daysUntil: diffDays > 0 ? diffDays : 0,
        daysSince: diffDays < 0 ? Math.abs(diffDays) : 0,
        isPast: diffDays < 0,
      };
    });

    // 按距离最近排序
    enriched.sort((a, b) => a.daysUntil - b.daysUntil);
    return enriched;
  }, []);

  const fetchAll = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data } = await supabase
      .from('anniversaries')
      .select('*')
      .order('date', { ascending: true });

    if (data) {
      const enriched = processDates(data);

      // 找到恋爱纪念日（type = 'love' 的第一个）
      const love = data.find((a) => a.type === 'love');
      if (love) {
        setLoveDate(love.date);
        const start = new Date(love.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffMs = today.getTime() - start.getTime();
        setDaysTogether(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      }

      setAnniversaries(enriched);
    }
    setLoading(false);
  }, [processDates]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addAnniversary = useCallback(async (title: string, date: string, type: string) => {
    const user = await getCurrentUser();
    if (!user) return;
    const { error } = await supabase.from('anniversaries').insert({
      title, date, type, created_by: user.id,
    });
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  const deleteAnniversary = useCallback(async (id: string) => {
    const { error } = await supabase.from('anniversaries').delete().eq('id', id);
    if (error) throw error;
    await fetchAll();
  }, [fetchAll]);

  return { anniversaries, loveDate, daysTogether, loading, addAnniversary, deleteAnniversary, refresh: fetchAll };
}
```

- [ ] **Step 2: 提交**

```bash
git add -A
git commit -m "feat: add useAnniversaries hook

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 8: 纪念日页面组件

**Files:**
- Create: `src/components/Anniversary/DaysCounter.tsx`, `src/components/Anniversary/CountdownList.tsx`, `src/components/Anniversary/AnniversaryForm.tsx`, `src/components/Anniversary/SweetQuote.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: DaysCounter 组件**

File: `src/components/Anniversary/DaysCounter.tsx`
```tsx
interface Props {
  days: number;
  loveDate: string | null;
}

export default function DaysCounter({ days, loveDate }: Props) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-400 text-sm mb-2">我们已经在一起</p>
      <p className="text-5xl font-bold text-love-400">
        {days}
        <span className="text-xl text-gray-400 font-normal ml-2">天</span>
      </p>
      {loveDate && (
        <p className="text-gray-400 text-xs mt-2">
          始于 {new Date(loveDate).toLocaleDateString('zh-CN')}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: CountdownList 组件**

File: `src/components/Anniversary/CountdownList.tsx`
```tsx
import { AnniversaryWithDays } from '@/hooks/useAnniversaries';

interface Props {
  anniversaries: AnniversaryWithDays[];
  onDelete: (id: string) => void;
}

export default function CountdownList({ anniversaries, onDelete }: Props) {
  const upcoming = anniversaries.filter(a => !a.isPast);
  const past = anniversaries.filter(a => a.isPast);

  return (
    <div className="space-y-4">
      {/* 即将到来 */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2">即将到来</h3>
          {upcoming.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 mb-2"
            >
              <div>
                <p className="font-medium text-gray-800">{a.title}</p>
                <p className="text-xs text-gray-400">{a.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary-500 font-bold">
                  {a.daysUntil === 0 ? '今天！🎉' : `${a.daysUntil}天后`}
                </span>
                <button
                  onClick={() => onDelete(a.id)}
                  className="text-gray-300 text-sm active:text-love-400"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 已过去 */}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-2">回忆</h3>
          {past.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-2"
            >
              <div>
                <p className="font-medium text-gray-600">{a.title}</p>
                <p className="text-xs text-gray-400">{a.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{a.daysSince}天前</span>
                <button
                  onClick={() => onDelete(a.id)}
                  className="text-gray-300 text-sm active:text-love-400"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: AnniversaryForm 组件**

File: `src/components/Anniversary/AnniversaryForm.tsx`
```tsx
'use client';
import { useState } from 'react';

interface Props {
  onSubmit: (title: string, date: string, type: string) => Promise<void>;
}

const types = [
  { value: 'love', label: '💕 恋爱' },
  { value: 'birthday', label: '🎂 生日' },
  { value: 'trip', label: '✈️ 旅行' },
  { value: 'custom', label: '📌 自定义' },
];

export default function AnniversaryForm({ onSubmit }: Props) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('custom');

  const handleSubmit = async () => {
    if (!title || !date) return;
    await onSubmit(title, date, type);
    setTitle(''); setDate(''); setType('custom'); setShow(false);
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm active:border-primary-300 active:text-primary-400"
      >
        + 添加纪念日
      </button>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="纪念日名称"
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400"
      />
      <div className="flex gap-2">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`px-3 py-1.5 rounded-lg text-xs ${
              type === t.value
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'bg-white text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-primary-500 text-white py-2.5 rounded-xl font-medium"
        >
          保存
        </button>
        <button
          onClick={() => setShow(false)}
          className="flex-1 bg-white text-gray-400 py-2.5 rounded-xl"
        >
          取消
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: SweetQuote 组件**

File: `src/components/Anniversary/SweetQuote.tsx`
```tsx
'use client';
import { useState, useEffect } from 'react';

const quotes = [
  '遇见你，是我这辈子最幸运的事 ✨',
  '和你在一起的每一天都是纪念日 💕',
  '有你的地方，就是家 🏠',
  '你是我所有美好故事的开始 📖',
  '在60亿人中遇见你，概率是60亿分之一 🌍',
  '我不完美，但有你在，我就觉得自己完整了 💫',
  '今天也想见到你，不管什么天气 ☀️',
];

export default function SweetQuote() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // 每天切换一句（基于日期取余）
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    setQuote(quotes[dayOfYear % quotes.length]);
  }, []);

  if (!quote) return null;

  return (
    <div className="bg-primary-50 rounded-2xl px-4 py-3 text-center">
      <p className="text-primary-700 text-sm">{quote}</p>
    </div>
  );
}
```

- [ ] **Step 5: 组装首页**

File: `src/app/page.tsx`
```tsx
'use client';
import DaysCounter from '@/components/Anniversary/DaysCounter';
import CountdownList from '@/components/Anniversary/CountdownList';
import AnniversaryForm from '@/components/Anniversary/AnniversaryForm';
import SweetQuote from '@/components/Anniversary/SweetQuote';
import { useAnniversaries } from '@/hooks/useAnniversaries';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { anniversaries, loveDate, daysTogether, loading, addAnniversary, deleteAnniversary } = useAnniversaries();

  if (loading) {
    return <div className="pt-6 text-center text-gray-400 py-20">加载中...</div>;
  }

  return (
    <div className="pt-6 space-y-6">
      <DaysCounter days={daysTogether} loveDate={loveDate} />
      <SweetQuote />
      <CountdownList
        anniversaries={anniversaries}
        onDelete={async (id) => {
          await deleteAnniversary(id);
          toast.success('已删除');
        }}
      />
      <AnniversaryForm
        onSubmit={async (title, date, type) => {
          await addAnniversary(title, date, type);
          toast.success('纪念日已添加！');
        }}
      />
    </div>
  );
}
```

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: implement anniversary module with counter, countdown, and form

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## 阶段三：相册模块 (Task 9–11)

### Task 9: 照片 Hook 和图片上传

**Files:**
- Create: `src/hooks/usePhotos.ts`, `src/components/Album/PhotoUpload.tsx`

- [ ] **Step 1: 实现 usePhotos hook**

File: `src/hooks/usePhotos.ts`
```ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { getMonthTag } from '@/lib/utils';
import imageCompression from 'browser-image-compression';

export interface Photo {
  id: string;
  image_url: string;
  caption: string;
  uploaded_by: string;
  month_tag: string;
  created_at: string;
}

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = useCallback(async () => {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPhotos(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  /** 上传照片（含压缩） */
  const uploadPhoto = useCallback(async (file: File, caption: string) => {
    const user = await getCurrentUser();
    if (!user) throw new Error('未登录');

    // 压缩图片（max 1200px, 0.7 quality）
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    });

    // 上传到 Supabase Storage
    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(fileName, compressed);

    if (uploadError) throw uploadError;

    // 获取公开 URL
    const { data: urlData } = supabase.storage
      .from('photos')
      .getPublicUrl(fileName);

    // 写入数据库
    const { error: dbError } = await supabase.from('photos').insert({
      image_url: urlData.publicUrl,
      caption,
      uploaded_by: user.id,
      month_tag: getMonthTag(),
    });

    if (dbError) throw dbError;
    await fetchPhotos();
  }, [fetchPhotos]);

  const deletePhoto = useCallback(async (id: string) => {
    const { error } = await supabase.from('photos').delete().eq('id', id);
    if (error) throw error;
    await fetchPhotos();
  }, [fetchPhotos]);

  return { photos, loading, uploadPhoto, deletePhoto, refresh: fetchPhotos };
}
```

- [ ] **Step 2: PhotoUpload 组件**

File: `src/components/Album/PhotoUpload.tsx`
```tsx
'use client';
import { useRef, useState } from 'react';

interface Props {
  onUpload: (file: File, caption: string) => Promise<void>;
}

export default function PhotoUpload({ onUpload }: Props) {
  const [show, setShow] = useState(false);
  const [caption, setCaption] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm active:border-primary-300"
      >
        + 上传照片
      </button>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
      {!preview ? (
        <button onClick={() => fileRef.current?.click()} className="w-full bg-white border border-gray-200 rounded-xl py-8 text-gray-400">
          📷 选择照片或拍照
        </button>
      ) : (
        <img src={preview} alt="预览" className="w-full rounded-xl max-h-64 object-cover" />
      )}
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="写一句话..."
        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400"
      />
      <div className="flex gap-2">
        <button
          onClick={async () => {
            const file = fileRef.current?.files?.[0];
            if (!file) return;
            setUploading(true);
            await onUpload(file, caption);
            setUploading(false);
            setCaption(''); setPreview(null); setShow(false);
          }}
          disabled={!fileRef.current?.files?.[0] || uploading}
          className="flex-1 bg-primary-500 text-white py-2.5 rounded-xl font-medium disabled:opacity-40"
        >
          {uploading ? '上传中...' : '上传'}
        </button>
        <button onClick={() => setShow(false)} className="flex-1 bg-white text-gray-400 py-2.5 rounded-xl">取消</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: add photo hook with compression upload and upload component

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 10: 相册页面 + 照片详情

**Files:**
- Create: `src/components/Album/PhotoGrid.tsx`, `src/components/Album/PhotoCard.tsx`, `src/components/Album/Timeline.tsx`, `src/components/Album/PhotoDetail.tsx`
- Modify: `src/app/album/page.tsx`, `src/app/album/[id]/page.tsx`

- [ ] **Step 1: PhotoGrid 组件**

File: `src/components/Album/PhotoGrid.tsx`
```tsx
'use client';
import Link from 'next/link';
import { Photo } from '@/hooks/usePhotos';

interface Props {
  photos: Photo[];
  onDelete: (id: string) => void;
}

export default function PhotoGrid({ photos, onDelete }: Props) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {photos.map((photo) => (
        <Link key={photo.id} href={`/album/${photo.id}`} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img src={photo.image_url} alt={photo.caption} className="w-full h-full object-cover" loading="lazy" />
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Timeline 组件**

File: `src/components/Album/Timeline.tsx`
```tsx
'use client';
import Link from 'next/link';
import { Photo } from '@/hooks/usePhotos';
import { formatDate } from '@/lib/utils';

interface Props {
  photos: Photo[];
}

export default function Timeline({ photos }: Props) {
  // 按月份分组
  const grouped: Record<string, Photo[]> = {};
  photos.forEach((p) => {
    const month = p.month_tag || p.created_at.slice(0, 7);
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(p);
  });

  const months = Object.keys(grouped).sort().reverse();

  return (
    <div className="space-y-6">
      {months.map((month) => (
        <div key={month}>
          <h3 className="text-sm font-semibold text-gray-400 mb-2 sticky top-0 bg-white py-1">
            {month}
          </h3>
          <div className="grid grid-cols-3 gap-1.5">
            {grouped[month].map((photo) => (
              <Link key={photo.id} href={`/album/${photo.id}`} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img src={photo.image_url} alt={photo.caption} className="w-full h-full object-cover" loading="lazy" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: PhotoDetail 组件**

File: `src/components/Album/PhotoDetail.tsx`
```tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import { Photo } from '@/hooks/usePhotos';
import toast from 'react-hot-toast';

interface Props {
  photo: Photo;
}

interface Comment {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
}

export default function PhotoDetail({ photo }: Props) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [userId, setUserId] = useState('');

  const fetchMeta = useCallback(async () => {
    const user = await getCurrentUser();
    if (user) setUserId(user.id);

    const { data: likes } = await supabase.from('likes').select('*').eq('photo_id', photo.id);
    setLikeCount(likes?.length || 0);
    setLiked(likes?.some((l) => l.user_id === user?.id) || false);

    const { data: cmts } = await supabase.from('comments').select('*').eq('photo_id', photo.id).order('created_at', { ascending: true });
    setComments(cmts || []);
  }, [photo.id]);

  useEffect(() => { fetchMeta(); }, [fetchMeta]);

  const toggleLike = async () => {
    const user = await getCurrentUser();
    if (!user) return;
    if (liked) {
      await supabase.from('likes').delete().eq('photo_id', photo.id).eq('user_id', user.id);
      setLikeCount((c) => c - 1);
      setLiked(false);
    } else {
      await supabase.from('likes').insert({ photo_id: photo.id, user_id: user.id });
      setLikeCount((c) => c + 1);
      setLiked(true);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    const user = await getCurrentUser();
    if (!user) return;
    await supabase.from('comments').insert({ photo_id: photo.id, user_id: user.id, text: commentText.trim() });
    setCommentText('');
    toast.success('评论成功');
    fetchMeta();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white/90 backdrop-blur flex items-center px-4 py-3 border-b border-gray-100 z-10">
        <button onClick={() => router.back()} className="text-gray-500 mr-4">← 返回</button>
        <span className="text-sm font-medium">{formatDate(photo.created_at)}</span>
      </div>

      <img src={photo.image_url} alt={photo.caption} className="w-full aspect-square object-cover" />

      <div className="p-4 space-y-4">
        {photo.caption && <p className="text-gray-700">{photo.caption}</p>}

        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className={`text-lg ${liked ? 'text-love-400' : 'text-gray-400'}`}>
            {liked ? '❤️' : '🤍'} {likeCount}
          </button>
          <span className="text-gray-300">💬 {comments.length}</span>
        </div>

        {/* 评论列表 */}
        {comments.length > 0 && (
          <div className="space-y-3 pt-2">
            {comments.map((c) => (
              <div key={c.id} className="bg-gray-50 rounded-xl px-4 py-2.5">
                <p className="text-sm text-gray-700">{c.text}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(c.created_at)}</p>
              </div>
            ))}
          </div>
        )}

        {/* 发送评论 */}
        <div className="flex gap-2 pt-2">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="写评论..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary-400 text-sm"
          />
          <button onClick={addComment} className="bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium">
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 组装相册页面**

File: `src/app/album/page.tsx`
```tsx
'use client';
import { useState } from 'react';
import { usePhotos } from '@/hooks/usePhotos';
import PhotoGrid from '@/components/Album/PhotoGrid';
import Timeline from '@/components/Album/Timeline';
import PhotoUpload from '@/components/Album/PhotoUpload';
import toast from 'react-hot-toast';

export default function AlbumPage() {
  const { photos, loading, uploadPhoto, deletePhoto } = usePhotos();
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  return (
    <div className="pt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">我们的回忆</h1>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-md text-xs ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
          >
            🟩 网格
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded-md text-xs ${viewMode === 'timeline' ? 'bg-white shadow-sm' : ''}`}
          >
            📅 时间线
          </button>
        </div>
      </div>

      <PhotoUpload
        onUpload={async (file, caption) => {
          await uploadPhoto(file, caption);
          toast.success('照片已上传！');
        }}
      />

      {loading ? (
        <p className="text-center text-gray-400 py-20">加载中...</p>
      ) : photos.length === 0 ? (
        <p className="text-center text-gray-400 py-20">还没有照片，上传第一张吧 📷</p>
      ) : viewMode === 'grid' ? (
        <PhotoGrid photos={photos} onDelete={deletePhoto} />
      ) : (
        <Timeline photos={photos} />
      )}
    </div>
  );
}
```

- [ ] **Step 5: 照片详情页**

File: `src/app/album/[id]/page.tsx`
```tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PhotoDetail from '@/components/Album/PhotoDetail';
import { Photo } from '@/hooks/usePhotos';

export default function PhotoDetailPage() {
  const { id } = useParams();
  const [photo, setPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    supabase.from('photos').select('*').eq('id', id as string).single().then(({ data }) => {
      if (data) setPhoto(data);
    });
  }, [id]);

  if (!photo) return <div className="py-20 text-center text-gray-400">加载中...</div>;
  return <PhotoDetail photo={photo} />;
}
```

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: implement album module with grid, timeline, detail, and comments

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## 阶段四：聊天模块 (Task 11–13)

### Task 11: 聊天 Hook（实时消息）

**Files:**
- Create: `src/hooks/useChat.ts`

- [ ] **Step 1: 实现 useChat hook**

File: `src/hooks/useChat.ts`
```ts
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import imageCompression from 'browser-image-compression';

export interface Message {
  id: string;
  sender_id: string;
  type: 'text' | 'image' | 'voice';
  content: string;
  read: boolean;
  created_at: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) setUserId(u.id);
    });
  }, []);

  useEffect(() => {
    fetchMessages();

    // 订阅新消息
    const channel = supabase
      .channel('chat')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
        // 标记对方消息为已读
        const msg = payload.new as Message;
        if (msg.sender_id !== userId) {
          supabase.from('messages').update({ read: true }).eq('id', msg.id).then(() => {});
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(200);
    if (data) setMessages(data);
    setLoading(false);
  };

  const sendText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const { error } = await supabase.from('messages').insert({
      sender_id: userId,
      type: 'text',
      content: text.trim(),
    });
    if (error) throw error;
  }, [userId]);

  const sendImage = useCallback(async (file: File) => {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    });
    const fileName = `chat/${userId}/${Date.now()}.jpg`;
    await supabase.storage.from('chat-images').upload(fileName, compressed);
    const { data: urlData } = supabase.storage.from('chat-images').getPublicUrl(fileName);

    await supabase.from('messages').insert({
      sender_id: userId,
      type: 'image',
      content: urlData.publicUrl,
    });
  }, [userId]);

  const sendVoice = useCallback(async (blob: Blob) => {
    const fileName = `chat/${userId}/${Date.now()}.webm`;
    await supabase.storage.from('chat-voice').upload(fileName, blob);
    const { data: urlData } = supabase.storage.from('chat-voice').getPublicUrl(fileName);

    await supabase.from('messages').insert({
      sender_id: userId,
      type: 'voice',
      content: urlData.publicUrl,
    });
  }, [userId]);

  return { messages, userId, loading, sendText, sendImage, sendVoice, bottomRef };
}
```

- [ ] **Step 2: 提交**

```bash
git add -A
git commit -m "feat: add useChat hook with realtime subscription

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 12: 聊天 UI 组件

**Files:**
- Create: `src/components/Chat/ChatBubble.tsx`, `src/components/Chat/MessageList.tsx`, `src/components/Chat/ChatInput.tsx`

- [ ] **Step 1: ChatBubble 组件**

File: `src/components/Chat/ChatBubble.tsx`
```tsx
import { Message } from '@/hooks/useChat';
import { formatDate } from '@/lib/utils';

interface Props {
  message: Message;
  isMine: boolean;
  backgroundUrl?: string | null;
}

export default function ChatBubble({ message, isMine }: Props) {
  return (
    <div className={`flex mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] ${isMine ? 'order-1' : ''}`}>
        {message.type === 'text' && (
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm ${
              isMine
                ? 'bg-primary-500 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }`}
          >
            {message.content}
          </div>
        )}
        {message.type === 'image' && (
          <img
            src={message.content}
            alt="聊天图片"
            className="rounded-2xl max-w-full max-h-64 object-cover"
            loading="lazy"
          />
        )}
        {message.type === 'voice' && (
          <div
            className={`rounded-2xl px-4 py-2.5 ${
              isMine ? 'bg-primary-500 text-white' : 'bg-gray-100'
            }`}
          >
            <audio controls src={message.content} className="h-8 max-w-[200px]" />
          </div>
        )}
        <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
          <p className="text-xs text-gray-300">{formatDate(message.created_at)}</p>
          {isMine && message.read && <span className="text-xs text-primary-400">已读</span>}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: MessageList 组件**

File: `src/components/Chat/MessageList.tsx`
```tsx
'use client';
import { useEffect, useRef } from 'react';
import { Message } from '@/hooks/useChat';
import ChatBubble from './ChatBubble';

interface Props {
  messages: Message[];
  userId: string;
}

export default function MessageList({ messages, userId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-1 pb-2">
      {messages.length === 0 && (
        <p className="text-center text-gray-400 py-20">还没有消息，发点什么吧 💬</p>
      )}
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} isMine={msg.sender_id === userId} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
```

- [ ] **Step 3: ChatInput 组件**

File: `src/components/Chat/ChatInput.tsx`
```tsx
'use client';
import { useState, useRef } from 'react';
import ImagePicker from './ImagePicker';
import VoiceRecorder from './VoiceRecorder';

interface Props {
  onSendText: (text: string) => Promise<void>;
  onSendImage: (file: File) => Promise<void>;
  onSendVoice: (blob: Blob) => Promise<void>;
}

export default function ChatInput({ onSendText, onSendImage, onSendVoice }: Props) {
  const [text, setText] = useState('');
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);

  const handleSend = async () => {
    if (!text.trim()) return;
    await onSendText(text);
    setText('');
  };

  return (
    <div className="border-t border-gray-100 pt-2 pb-safe">
      {showImagePicker && (
        <ImagePicker
          onPick={async (file) => {
            await onSendImage(file);
            setShowImagePicker(false);
          }}
          onClose={() => setShowImagePicker(false)}
        />
      )}
      {showRecorder && (
        <VoiceRecorder
          onSend={async (blob) => {
            await onSendVoice(blob);
            setShowRecorder(false);
          }}
          onClose={() => setShowRecorder(false)}
        />
      )}
      <div className="flex items-center gap-2">
        <button onClick={() => setShowImagePicker(true)} className="text-xl text-gray-400 active:text-primary-500">📷</button>
        <button onClick={() => setShowRecorder(true)} className="text-xl text-gray-400 active:text-primary-500">🎤</button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          placeholder="输入消息..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 outline-none text-sm"
        />
        <button onClick={handleSend} className="bg-primary-500 text-white rounded-full w-9 h-9 flex items-center justify-center text-sm active:scale-90 transition-transform">
          ↑
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 创建 ImagePicker 和 VoiceRecorder**

File: `src/components/Chat/ImagePicker.tsx`
```tsx
'use client';
import { useRef } from 'react';

interface Props {
  onPick: (file: File) => void;
  onClose: () => void;
}

export default function ImagePicker({ onPick, onClose }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onPick(file);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-3 mb-2">
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
      <div className="flex gap-2">
        <button onClick={() => fileRef.current?.click()} className="flex-1 bg-white rounded-xl py-6 text-gray-500 text-sm">
          📷 拍照
        </button>
        <button onClick={onClose} className="flex-1 bg-white rounded-xl py-6 text-gray-400 text-sm">
          ✕ 取消
        </button>
      </div>
    </div>
  );
}
```

File: `src/components/Chat/VoiceRecorder.tsx`
```tsx
'use client';
import { useRef, useState } from 'react';

interface Props {
  onSend: (blob: Blob) => void;
  onClose: () => void;
}

export default function VoiceRecorder({ onSend, onClose }: Props) {
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<NodeJS.Timeout>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        onSend(blob);
      };

      mediaRecorder.current.start();
      setRecording(true);
      setTime(0);
      timer.current = setInterval(() => setTime((t) => t + 1), 1000);
    } catch {
      alert('无法访问麦克风');
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
    clearInterval(timer.current);
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-2">
      {!recording ? (
        <div className="flex gap-2">
          <button onClick={startRecording} className="flex-1 bg-love-400 text-white rounded-xl py-3 text-sm font-medium">
            🎤 开始录音
          </button>
          <button onClick={onClose} className="bg-white rounded-xl px-6 py-3 text-gray-400 text-sm">取消</button>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-love-400 text-lg font-bold animate-pulse">🔴 录音中 {time}s</p>
          <button onClick={stopRecording} className="mt-2 bg-white rounded-xl px-6 py-2 text-gray-600 text-sm">停止并发送</button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "feat: add chat UI components - bubble, list, input, voice, image

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 13: 聊天页面

**Files:**
- Modify: `src/app/chat/page.tsx`

- [ ] **Step 1: 组装聊天页面**

File: `src/app/chat/page.tsx`
```tsx
'use client';
import { useChat } from '@/hooks/useChat';
import MessageList from '@/components/Chat/MessageList';
import ChatInput from '@/components/Chat/ChatInput';
import toast from 'react-hot-toast';

export default function ChatPage() {
  const { messages, userId, loading, sendText, sendImage, sendVoice } = useChat();

  if (loading) {
    return <div className="pt-6 text-center text-gray-400 py-20">加载中...</div>;
  }

  return (
    <div className="pt-6 h-[calc(100vh-8rem)] flex flex-col">
      <h1 className="text-lg font-bold text-gray-800 mb-3">我们的聊天</h1>
      <MessageList messages={messages} userId={userId} />
      <ChatInput
        onSendText={sendText}
        onSendImage={async (file) => {
          await sendImage(file);
          toast.success('图片已发送');
        }}
        onSendVoice={async (blob) => {
          await sendVoice(blob);
          toast.success('语音已发送');
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add -A
git commit -m "feat: implement chat page with realtime messaging

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## 阶段五：互动模块 (Task 14–18)

### Task 14: 每日一问

**Files:**
- Create: `src/components/Play/DailyQuestion.tsx`

- [ ] **Step 1: DailyQuestion 组件**

File: `src/components/Play/DailyQuestion.tsx`
```tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

const FALLBACK_QUESTIONS = [
  'TA做过最让你感动的一件事是什么？',
  '第一次见面时，你对TA的第一印象是？',
  '你最喜欢TA的哪一个特点？',
  '如果可以和TA去任何地方旅行，你会选哪里？',
  '你最想对TA说但还没说的话是什么？',
  '你觉得两个人在一起最重要的是什么？',
  'TA的哪个习惯最让你忍俊不禁？',
];

export default function DailyQuestion() {
  const [question, setQuestion] = useState<string>('');
  const [myAnswer, setMyAnswer] = useState('');
  const [partnerAnswer, setPartnerAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  const fetchQuestion = useCallback(async () => {
    // 找到今天的题
    const { data } = await supabase.from('daily_questions').select('*').eq('date', today).single();

    if (data) {
      setQuestion(data.question);
    } else {
      // 没有题就随机选一个插入
      const q = FALLBACK_QUESTIONS[Math.floor(Math.random() * FALLBACK_QUESTIONS.length)];
      await supabase.from('daily_questions').insert({ question: q, date: today });
      setQuestion(q);
    }

    // 查自己的回答
    const user = await getCurrentUser();
    const { data: answers } = await supabase.from('answers').select('*').eq('question_id', data?.id || '');

    if (answers && user) {
      const mine = answers.find((a) => a.user_id === user.id);
      const partner = answers.find((a) => a.user_id !== user.id);
      if (mine) { setMyAnswer(mine.answer); setSubmitted(true); }
      if (partner) setPartnerAnswer(partner.answer);
    }

    setLoading(false);
  }, [today]);

  useEffect(() => { fetchQuestion(); }, [fetchQuestion]);

  const submitAnswer = async () => {
    if (!myAnswer.trim()) return;
    const user = await getCurrentUser();
    if (!user) return;

    const { data: q } = await supabase.from('daily_questions').select('id').eq('date', today).single();
    if (!q) return;

    await supabase.from('answers').insert({
      question_id: q.id,
      user_id: user.id,
      answer: myAnswer.trim(),
    });

    setSubmitted(true);
  };

  if (loading) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-primary-600">📋 每日一问</h3>
      <p className="text-gray-800 font-medium">{question}</p>

      {!submitted ? (
        <div>
          <textarea
            value={myAnswer}
            onChange={(e) => setMyAnswer(e.target.value)}
            placeholder="写下你的回答..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400 text-sm resize-none"
            rows={3}
          />
          <button
            onClick={submitAnswer}
            disabled={!myAnswer.trim()}
            className="mt-2 bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-40"
          >
            提交回答
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="bg-primary-50 rounded-xl px-4 py-2.5">
            <p className="text-xs text-primary-500 mb-0.5">你的回答</p>
            <p className="text-sm text-gray-700">{myAnswer}</p>
          </div>
          {partnerAnswer ? (
            <div className="bg-love-50 rounded-xl px-4 py-2.5">
              <p className="text-xs text-love-400 mb-0.5">TA的回答</p>
              <p className="text-sm text-gray-700">{partnerAnswer}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">等待TA的回答...</p>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add -A
git commit -m "feat: add daily question component

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 15: 互相出题

**Files:**
- Create: `src/components/Play/QuizCreate.tsx`, `src/components/Play/QuizAnswer.tsx`

- [ ] **Step 1: QuizCreate 组件**

File: `src/components/Play/QuizCreate.tsx`
```tsx
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import toast from 'react-hot-toast';

interface Props {
  onCreated: () => void;
}

export default function QuizCreate({ onCreated }: Props) {
  const [show, setShow] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleSubmit = async () => {
    if (!question.trim() || options.some((o) => !o.trim())) return;
    const user = await getCurrentUser();
    if (!user) return;

    await supabase.from('quiz_questions').insert({
      created_by: user.id,
      question: question.trim(),
      options: options.map((o) => o.trim()),
      correct_index: correctIndex,
    });

    setShow(false);
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectIndex(0);
    onCreated();
    toast.success('题目已出！');
  };

  if (!show) {
    return (
      <button onClick={() => setShow(true)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
        + 给TA出题
      </button>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
      <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="题目" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400 text-sm" />
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="radio"
            checked={correctIndex === i}
            onChange={() => setCorrectIndex(i)}
            className="accent-primary-500"
          />
          <input
            value={opt}
            onChange={(e) => {
              const next = [...options];
              next[i] = e.target.value;
              setOptions(next);
            }}
            placeholder={`选项 ${i + 1}`}
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary-400 text-sm"
          />
        </div>
      ))}
      <p className="text-xs text-gray-400">选择正确答案旁边的圆点</p>
      <div className="flex gap-2">
        <button onClick={handleSubmit} className="flex-1 bg-primary-500 text-white py-2.5 rounded-xl text-sm font-medium">出题</button>
        <button onClick={() => setShow(false)} className="flex-1 bg-white text-gray-400 py-2.5 rounded-xl text-sm">取消</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: QuizAnswer 组件**

File: `src/components/Play/QuizAnswer.tsx`
```tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import toast from 'react-hot-toast';

interface QuizQuestion {
  id: string;
  created_by: string;
  question: string;
  options: string[];
  correct_index: number;
  answered: boolean;
}

export default function QuizAnswer() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userId, setUserId] = useState('');

  const fetchQuestions = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) return;
    setUserId(user.id);

    // 对方出给我的、还没答的题
    const { data } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('answered', false)
      .order('created_at', { ascending: false });

    if (data) setQuestions(data.filter((q) => q.created_by !== user.id));
  }, []);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const answer = async (q: QuizQuestion, selectedIndex: number) => {
    const user = await getCurrentUser();
    if (!user) return;

    const correct = selectedIndex === q.correct_index;

    // 更新积分
    if (correct) {
      const { data: scoreRow } = await supabase.from('scores').select('*').eq('user_id', user.id).single();
      if (scoreRow) {
        await supabase.from('scores').update({ score: scoreRow.score + 10 }).eq('user_id', user.id);
      } else {
        await supabase.from('scores').insert({ user_id: user.id, score: 10 });
      }
    }

    // 标记已答
    await supabase.from('quiz_questions').update({ answered: true }).eq('id', q.id);

    toast(correct ? '答对了！+10分 🎉' : `答错了~正确答案是：${q.options[q.correct_index]}`);
    fetchQuestions();
  };

  if (questions.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-primary-600">💡 TA给你的题</h3>
      {questions.map((q) => (
        <div key={q.id} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">
          <p className="text-gray-800 font-medium">{q.question}</p>
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => answer(q, i)}
              className="w-full text-left bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-700 active:bg-primary-50"
            >
              {['A', 'B', 'C', 'D'][i]}. {opt}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: add quiz create and answer components

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 16: 打卡挑战

**Files:**
- Create: `src/components/Play/ChallengeCard.tsx`, `src/components/Play/ChallengeForm.tsx`

- [ ] **Step 1: ChallengeCard 组件**

File: `src/components/Play/ChallengeCard.tsx`
```tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import toast from 'react-hot-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  total_days: number;
  active: boolean;
}

interface Props {
  challenge: Challenge;
  userId: string;
  onUpdate: () => void;
}

function ChallengeCard({ challenge, userId, onUpdate }: Props) {
  const [checkins, setCheckins] = useState<string[]>([]);

  useEffect(() => {
    supabase.from('checkins').select('checkin_date').eq('challenge_id', challenge.id).then(({ data }) => {
      if (data) setCheckins(data.map((c) => c.checkin_date));
    });
  }, [challenge.id]);

  const today = new Date().toISOString().slice(0, 10);
  const checkedToday = checkins.includes(today);
  const progress = Math.min(Math.round((checkins.length / challenge.total_days) * 100), 100);

  const checkin = async () => {
    await supabase.from('checkins').insert({
      challenge_id: challenge.id,
      user_id: userId,
      checkin_date: today,
    });
    setCheckins([...checkins, today]);
    toast.success('打卡成功！✅');

    if (checkins.length + 1 >= challenge.total_days) {
      await supabase.from('challenges').update({ active: false }).eq('id', challenge.id);
      toast('🎉 挑战完成！', { icon: '🎉' });
      onUpdate();
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">{challenge.title}</h4>
          {challenge.description && <p className="text-xs text-gray-400 mt-0.5">{challenge.description}</p>}
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${challenge.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
          {challenge.active ? '进行中' : '已完成'}
        </span>
      </div>
      {challenge.active && (
        <div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
            <div className="bg-primary-400 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">{checkins.length}/{challenge.total_days} 天</span>
            {!checkedToday && (
              <button onClick={checkin} className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium active:scale-95 transition-transform">
                今日打卡
              </button>
            )}
            {checkedToday && <span className="text-xs text-primary-500">今日已完成 ✅</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChallengeList() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userId, setUserId] = useState('');

  const fetchChallenges = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) return;
    setUserId(user.id);
    const { data } = await supabase.from('challenges').select('*').order('created_at', { ascending: false });
    if (data) setChallenges(data);
  }, []);

  useEffect(() => { fetchChallenges(); }, [fetchChallenges]);

  return (
    <div className="space-y-2">
      {challenges.map((c) => (
        <ChallengeCard key={c.id} challenge={c} userId={userId} onUpdate={fetchChallenges} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: ChallengeForm 组件**

File: `src/components/Play/ChallengeForm.tsx`
```tsx
'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import toast from 'react-hot-toast';

interface Props {
  onCreated: () => void;
}

export default function ChallengeForm({ onCreated }: Props) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalDays, setTotalDays] = useState(7);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    const user = await getCurrentUser();
    if (!user) return;

    await supabase.from('challenges').insert({
      title: title.trim(),
      description: description.trim(),
      total_days: totalDays,
      created_by: user.id,
    });
    setShow(false);
    setTitle(''); setDescription(''); setTotalDays(7);
    onCreated();
    toast.success('挑战已创建！');
  };

  if (!show) {
    return (
      <button onClick={() => setShow(true)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
        + 创建打卡挑战
      </button>
    );
  }

  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="挑战名称" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400 text-sm" />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="描述（选填）" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400 text-sm" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">坚持</span>
        <select value={totalDays} onChange={(e) => setTotalDays(Number(e.target.value))} className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
          {[7, 14, 21, 30, 60, 100].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">天</span>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSubmit} className="flex-1 bg-primary-500 text-white py-2.5 rounded-xl text-sm font-medium">创建</button>
        <button onClick={() => setShow(false)} className="flex-1 bg-white text-gray-400 py-2.5 rounded-xl text-sm">取消</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: add challenge check-in components

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 17: 真心话大冒险转盘

**Files:**
- Create: `src/components/Play/Spinner.tsx`

- [ ] **Step 1: Spinner 组件**

File: `src/components/Play/Spinner.tsx`
```tsx
'use client';
import { useState } from 'react';

const TRUTHS = [
  '第一次约会时你心里在想什么？',
  '做过最让TA吃醋的一件事？',
  '你有什么还没告诉TA的小秘密？',
  'TA的哪个习惯你会偷偷吐槽？',
  '你觉得TA最可爱的瞬间是？',
];

const DARES = [
  '给TA发一段10秒语音说"我爱你"',
  '模仿TA的一个经典表情/动作',
  '发一张你现在的自拍给TA',
  '用emoji描述你们的下次约会',
  '闭上眼睛，用三个词形容TA',
];

export default function Spinner() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ type: string; text: string } | null>(null);
  const [mode, setMode] = useState<'truth' | 'dare' | null>(null);

  const spin = (type: 'truth' | 'dare') => {
    setSpinning(true);
    setResult(null);
    setMode(type);

    const pool = type === 'truth' ? TRUTHS : DARES;
    let i = 0;
    const interval = setInterval(() => {
      setResult({ type, text: pool[i % pool.length] });
      i++;
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setResult({ type, text: pick });
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 text-center">
      <h3 className="text-sm font-semibold text-primary-600">🎡 真心话大冒险</h3>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => spin('truth')}
          disabled={spinning}
          className="bg-love-50 text-love-600 px-6 py-3 rounded-full font-medium text-sm active:scale-95 transition-transform disabled:opacity-50"
        >
          💬 真心话
        </button>
        <button
          onClick={() => spin('dare')}
          disabled={spinning}
          className="bg-primary-50 text-primary-600 px-6 py-3 rounded-full font-medium text-sm active:scale-95 transition-transform disabled:opacity-50"
        >
          ⚡ 大冒险
        </button>
      </div>

      {result && (
        <div className={`rounded-2xl px-4 py-6 ${result.type === 'truth' ? 'bg-love-50' : 'bg-primary-50'}`}>
          <p className="text-xs text-gray-400 mb-1">
            {result.type === 'truth' ? '💬 真心话' : '⚡ 大冒险'}
          </p>
          <p className="text-lg font-medium text-gray-800">{result.text}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add -A
git commit -m "feat: add truth or dare spinner component

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 18: 互动广场页面

**Files:**
- Modify: `src/app/play/page.tsx`

- [ ] **Step 1: 组装互动页面**

File: `src/app/play/page.tsx`
```tsx
'use client';
import { useState, useCallback } from 'react';
import DailyQuestion from '@/components/Play/DailyQuestion';
import QuizCreate from '@/components/Play/QuizCreate';
import QuizAnswer from '@/components/Play/QuizAnswer';
import ChallengeForm from '@/components/Play/ChallengeForm';
import ChallengeList from '@/components/Play/ChallengeCard';
import Spinner from '@/components/Play/Spinner';

export default function PlayPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <div className="pt-6 space-y-6" key={refreshKey}>
      <h1 className="text-lg font-bold text-gray-800">互动广场</h1>

      <DailyQuestion />

      <section className="space-y-3">
        <QuizAnswer />
        <QuizCreate onCreated={refresh} />
      </section>

      <section className="space-y-3">
        <ChallengeList />
        <ChallengeForm onCreated={refresh} />
      </section>

      <Spinner />
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add -A
git commit -m "feat: implement play page with all interaction modules

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## 阶段六：设置 + 部署 (Task 19–22)

### Task 19: 设置页面

**Files:**
- Modify: `src/app/settings/page.tsx`

- [ ] **Step 1: 实现设置页面**

File: `src/app/settings/page.tsx`
```tsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { paired, generateCode, pair, loading } = useAuth();
  const [nickname, setNickname] = useState('');
  const [pairCode, setPairCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getCurrentUser().then((u) => {
      if (u) {
        supabase.from('users').select('nickname').eq('id', u.id).single().then(({ data }) => {
          if (data) setNickname(data.nickname);
        });
      }
    });
  }, []);

  const updateNickname = async () => {
    const user = await getCurrentUser();
    if (!user || !nickname.trim()) return;
    await supabase.from('users').update({ nickname: nickname.trim() }).eq('id', user.id);
    toast.success('昵称已更新');
  };

  const handleGenerateCode = async () => {
    const code = await generateCode();
    setPairCode(code);
  };

  const handlePair = async () => {
    if (inputCode.length !== 6) return;
    const ok = await pair(inputCode);
    if (ok) toast.success('配对成功！');
    else toast.error('配对码无效');
  };

  if (loading) return <div className="pt-6 py-20 text-center text-gray-400">加载中...</div>;

  return (
    <div className="pt-6 space-y-6">
      <h1 className="text-lg font-bold text-gray-800">设置</h1>

      {/* 昵称 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">昵称</label>
        <div className="flex gap-2">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary-400"
          />
          <button onClick={updateNickname} className="bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm">
            保存
          </button>
        </div>
      </div>

      {/* 配对状态 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">配对状态</label>
        <p className={`text-sm ${paired ? 'text-green-500' : 'text-gray-400'}`}>
          {paired ? '✅ 已配对' : '⚠️ 未配对'}
        </p>
      </div>

      {/* 配对操作 */}
      {!paired && (
        <div className="space-y-4">
          {/* 生成配对码 */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-medium text-gray-600">生成配对码</p>
            <button onClick={handleGenerateCode} className="bg-primary-500 text-white w-full py-2.5 rounded-xl text-sm">
              生成
            </button>
            {pairCode && (
              <div className="text-center">
                <p
                  className="text-3xl font-bold tracking-widest text-primary-600 cursor-pointer"
                  onClick={() => { navigator.clipboard.writeText(pairCode); setCopied(true); }}
                >
                  {pairCode}
                </p>
                {copied && <p className="text-green-500 text-xs mt-1">已复制！</p>}
              </div>
            )}
          </div>

          {/* 输入对方配对码 */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-medium text-gray-600">输入TA的配对码</p>
            <input
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
              placeholder="6位数字"
              inputMode="numeric"
              maxLength={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest outline-none focus:border-primary-400"
            />
            <button onClick={handlePair} disabled={inputCode.length !== 6} className="w-full bg-love-400 text-white py-2.5 rounded-xl text-sm disabled:opacity-40">
              绑定
            </button>
          </div>
        </div>
      )}

      {/* 版本信息 */}
      <div className="text-center pt-8">
        <p className="text-xs text-gray-300">我们的空间 v1.0</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add -A
git commit -m "feat: implement settings page with pairing and nickname

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 20: 推送通知配置

**Files:**
- Create: `src/lib/notifications.ts`, `public/sw.js`

- [ ] **Step 1: 推送通知工具**

File: `src/lib/notifications.ts`
```ts
/** 请求推送权限 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/** 发送本地通知 */
export function sendLocalNotification(title: string, body: string) {
  if (Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
  });
}

/** 定时检查纪念日并推送 */
export function scheduleAnniversaryCheck(anniversaries: { title: string; date: string }[]) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  for (const a of anniversaries) {
    if (a.date === today) {
      sendLocalNotification('🎉 今天！', `${a.title} 就在今天！`);
    } else if (a.date === tomorrow) {
      sendLocalNotification('📅 明天', `${a.title} 就在明天！`);
    }
  }
}
```

- [ ] **Step 2: 自定义 Service Worker**

File: `public/sw.js`
```js
// next-pwa 会自动生成 service worker
// 此文件为自定义扩展
self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: '新消息', body: '' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: add push notification support and custom service worker

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 21: 离线支持

**Files:**
- Create: `src/hooks/useNetworkStatus.ts`, `src/components/OfflineBanner.tsx`

- [ ] **Step 1: 网络状态 hook**

File: `src/hooks/useNetworkStatus.ts`
```ts
'use client';
import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}
```

- [ ] **Step 2: OfflineBanner 组件**

File: `src/components/OfflineBanner.tsx`
```tsx
'use client';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function OfflineBanner() {
  const online = useNetworkStatus();
  if (online) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-yellow-900 text-center py-1.5 text-xs font-medium z-50">
      📡 当前处于离线状态
    </div>
  );
}
```

- [ ] **Step 3: 更新根布局加入 OfflineBanner**

In `src/app/layout.tsx`, add `<OfflineBanner />` before `<PairingGuard>`.

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: add offline detection banner

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 22: 部署到 Vercel

**Files:**
- Modify: `.env.local.example`, Create: `README.md`

- [ ] **Step 1: 创建 README**

File: `README.md`
```markdown
# 我们的空间 — 情侣App

专属情侣 PWA 应用：纪念日 · 相册 · 聊天 · 互动

## 部署步骤

### 1. Supabase 设置

1. 在 [supabase.com](https://supabase.com) 注册账号，创建项目
2. 进入 SQL Editor，执行 `supabase/schema.sql`
3. 在 Storage 中创建存储桶：`photos`, `chat-images`, `chat-voice`, `avatars`（权限设为 private）
4. 记下项目的 URL 和 anon key

### 2. Vercel 部署

1. 将代码推到 GitHub 仓库
2. 在 [vercel.com](https://vercel.com) 导入该仓库
3. 设置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL` = 你的 Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = 你的 Supabase Anon Key
4. 部署

### 3. 使用

1. iPhone 打开 Safari，访问你的 Vercel 域名
2. 点击底部分享按钮 → "添加到主屏幕"
3. 打开主屏幕上的 App 图标
4. 一人点击「生成配对码」，另一人输入配对码，完成绑定
5. 开始使用！

## 本地开发

\`\`\`bash
npm install
cp .env.local.example .env.local
# 编辑 .env.local 填入 Supabase 信息
npm run dev
\`\`\`
```

- [ ] **Step 2: 最终提交**

```bash
git add -A
git commit -m "feat: add README with deploy instructions

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## 实施顺序总结

| 阶段 | Task | 内容 | 预估时间 |
|------|------|------|---------|
| 一 | 1–6 | 项目脚手架 + 数据库 + PWA + 认证 + UI壳 | 基础 |
| 二 | 7–8 | 纪念日模块 | 30min |
| 三 | 9–10 | 相册模块 | 30min |
| 四 | 11–13 | 聊天模块 | 40min |
| 五 | 14–18 | 互动模块 | 40min |
| 六 | 19–22 | 设置 + 推送 + 离线 + 部署 | 20min |

**总计**: 22个Task，约2-3小时完成。
