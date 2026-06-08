# 情侣App 设计文档

**日期**: 2026-06-08
**状态**: 已确认

---

## 1. 产品概述

一款综合型情侣 PWA 应用，包含纪念日倒计时、相册回忆墙、专属聊天、情侣互动四个核心模块。两人通过配对码绑定，数据实时同步。

**目标用户**: 一对情侣，均使用 iPhone，通过 Safari 添加到主屏幕使用。
**开发方式**: AI 全生成（vibe coding），用户无编程经验，需要一键部署方案。

---

## 2. 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Next.js 14 (App Router) | AI 训练数据最丰富，vibe coding 最稳 |
| 样式 | Tailwind CSS | 原子化 CSS，快速开发 |
| 后端/数据库 | Supabase | PostgreSQL + 实时 + 存储 + 认证 |
| 文件存储 | Supabase Storage | 聊天图片、相册照片 |
| 实时通信 | Supabase Realtime | 聊天消息实时同步 |
| 部署 | Vercel (Hobby) | 免费层，GitHub 自动部署 |
| PWA | next-pwa | 离线支持、添加到主屏幕、推送通知 |
| 推送 | Web Push API | 纪念日提醒、新消息通知 |

---

## 3. 页面结构

底部 4 个 Tab：

| Tab | 页面 | 核心内容 |
|-----|------|---------|
| 🏠 纪念日 | 首页/纪念日 | 在一起天数、最近纪念日倒计时、甜蜜语录 |
| 🖼️ 相册 | 回忆墙 | 照片网格、日记、时间线 |
| 💬 聊天 | 专属聊天 | 实时文字/图片/语音消息 |
| 🎮 互动 | 互动广场 | 每日一问、互相出题、打卡挑战 |

额外页面：
- 设置页（配对码、通知开关、聊天背景）
- 照片/日记详情页
- 纪念日添加/编辑页
- 挑战详情页

---

## 4. 功能模块

### 4.1 🏠 纪念日模块

| 功能 | 说明 |
|------|------|
| 在一起天数 | 首页大字显示，每天自动+1 |
| 纪念日列表 | 自定义添加纪念日（恋爱纪念日、生日、旅行日等） |
| 倒计时 | 距离下一个纪念日还有多少天 |
| 纪念日提醒 | 到期前1天/当天浏览器推送通知 |
| 甜蜜语录 | 首页随机展示一句甜蜜的话 |

操作规则：
- 双方均可添加/编辑纪念日
- 数据实时同步

### 4.2 🖼️ 相册模块

| 功能 | 说明 |
|------|------|
| 照片上传 | 从手机相册选图或拍照，自动压缩后上传 Supabase Storage |
| 照片网格 | 按时间倒序排列 |
| 配文 | 每张照片可写一段日记/描述 |
| 时间线 | 按月份分组浏览 |
| 点赞/评论 | 双方可点赞和评论照片 |
| 相册封面 | 可自定义封面照片 |

限制：
- 仅支持图片，不支持视频
- 上传前自动压缩（节省存储和流量）

### 4.3 💬 聊天模块

| 功能 | 说明 |
|------|------|
| 文字消息 | 通过 Supabase Realtime 实时收发 |
| 图片消息 | 拍照或选图发送 |
| 语音消息 | 录制发送 |
| 已读状态 | 对方已读标记 |
| 消息提醒 | 新消息推送通知 |
| 聊天背景 | 自定义聊天背景图 |

数据安全：
- Supabase Row Level Security：仅配对用户可读写聊天记录
- 配对机制：一人创建配对码，另一人输入绑定，共享同一聊天室

### 4.4 🎮 互动模块

| 功能 | 说明 |
|------|------|
| 每日一问 | 系统每天推送一个问题，双方回答后互相可见 |
| 互相出题 | 给对方出关于自己的选择题，答对加分 |
| 打卡挑战 | 自定义挑战（如"每天发午餐照片，坚持7天"），每日打卡 |
| 真心话大冒险 | 转盘随机出题/指令 |

---

## 5. 数据模型

### Supabase 表结构

```
users
  - id: uuid (主键)
  - nickname: text
  - avatar_url: text (存储头像链接)
  - partner_id: uuid (配对伴侣ID，可空)
  - pair_code: text (唯一配对码，可空)
  - created_at: timestamptz

anniversaries
  - id: uuid
  - title: text
  - date: date (纪念日日期)
  - type: text (纪念日类型：恋爱/生日/旅行/自定义)
  - created_by: uuid → users.id
  - created_at: timestamptz

photos
  - id: uuid
  - image_url: text (Supabase Storage URL)
  - caption: text (配文/日记)
  - uploaded_by: uuid → users.id
  - month_tag: text (YYYY-MM，用于按月份分组)
  - created_at: timestamptz

comments
  - id: uuid
  - photo_id: uuid → photos.id
  - user_id: uuid → users.id
  - text: text
  - created_at: timestamptz

likes
  - id: uuid
  - photo_id: uuid → photos.id
  - user_id: uuid → users.id
  - created_at: timestamptz
  唯一约束: (photo_id, user_id)

messages
  - id: uuid
  - sender_id: uuid → users.id
  - type: text (text / image / voice)
  - content: text (文字内容或图片/语音URL)
  - read: boolean (默认 false)
  - created_at: timestamptz

daily_questions
  - id: uuid
  - question: text
  - date: date
  - created_at: timestamptz

answers
  - id: uuid
  - question_id: uuid → daily_questions.id
  - user_id: uuid → users.id
  - answer: text
  - created_at: timestamptz

challenges
  - id: uuid
  - title: text
  - description: text
  - total_days: integer
  - created_by: uuid → users.id
  - active: boolean
  - created_at: timestamptz

checkins
  - id: uuid
  - challenge_id: uuid → challenges.id
  - user_id: uuid → users.id
  - checkin_date: date
  - note: text (可选打卡备注)
  唯一约束: (challenge_id, user_id, checkin_date)

quiz_questions (互相出题)
  - id: uuid
  - created_by: uuid → users.id (出题人)
  - question: text
  - options: jsonb (选项数组)
  - correct_index: integer
  - answered: boolean
  - created_at: timestamptz

scores (答题积分)
  - id: uuid
  - user_id: uuid → users.id
  - score: integer
  唯一约束: (user_id)
```

### 存储桶 (Supabase Storage)

```
photos/      — 相册照片
chat-images/ — 聊天图片
chat-voice/  — 聊天语音
avatars/     — 用户头像
```

---

## 6. 认证与配对机制

由于不使用邮箱注册，认证流程如下：

1. 用户首次打开 App，自动生成一个 `device_id`（存 localStorage）
2. 在 Supabase 中用 `device_id` 创建用户记录（使用 Supabase 匿名认证或直接通过 anon key + RLS 保护）
3. **配对流程**：
   - 用户A点击「生成配对码」→ 系统生成6位随机码，写入 users.pair_code
   - 用户B在设置页面输入配对码 → 系统查找匹配的 pair_code
   - 匹配成功：双方的 partner_id 互相指向对方
   - 配对码随后清空（一次性使用）
4. RLS 策略基于 `partner_id` 判断权限：只有配对的两人可互相读写数据

## 7. 安全策略

- Supabase Row Level Security (RLS) 配置在所有表上
- RLS 策略：当前用户的 partner_id 与数据行的 user_id 匹配时允许读写
- 在 Supabase SQL Editor 中手动执行 RLS 策略脚本（一次性配置）
- 存储桶：仅已认证配对用户可上传和查看

---

## 8. PWA 功能

- **可安装**: manifest.json，添加到 iPhone 主屏幕，显示为独立 App
- **离线**: Service Worker 缓存核心页面和静态资源
- **推送**: 纪念日提醒、新消息通知
- **图标**: 提供多尺寸 App 图标 (192x192, 512x512)
- **启动画面**: 自定义 Splash Screen

---

## 9. 部署流程

1. 代码推送到 GitHub 仓库
2. Vercel 关联 GitHub 仓库，自动部署
3. 设置自定义域名（Vercel 提供 `*.vercel.app` 免费域名，够用）
4. 情侣双方在 iPhone Safari 打开网址 → 分享 → 添加到主屏幕

---

## 10. 不在范围内（YAGNI）

- 视频上传 — 存储和带宽成本高，暂不支持
- 用户注册/登录系统 — 通过配对码识别，不需要邮箱注册
- 第三方分享 — 情侣私密空间，不分享到社交平台
- 多对情侣/社区功能 — 仅两人空间
- iOS App Store 上架 — 通过 PWA 分发改足够
