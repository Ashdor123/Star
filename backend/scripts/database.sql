-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  account TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建课程表
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  pinyin TEXT,
  thumbnail TEXT,
  tip TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建步骤表
CREATE TABLE IF NOT EXISTS steps (
  id SERIAL PRIMARY KEY,
  lesson_id TEXT REFERENCES lessons(id),
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  "order" INTEGER
);

-- 创建学习进度表
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  lesson_id TEXT REFERENCES lessons(id),
  completed BOOLEAN DEFAULT false,
  progress INTEGER DEFAULT 0,
  last_accessed TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_lesson ON learning_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_steps_lesson ON steps(lesson_id);


