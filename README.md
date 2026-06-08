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

```bash
npm install
cp .env.local.example .env.local
# 编辑 .env.local 填入 Supabase 信息
npm run dev
```
