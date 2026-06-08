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
