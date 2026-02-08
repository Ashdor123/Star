-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  account TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,  -- 注意：生产环境中应使用加密存储
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

-- 优化索引
-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_account ON users(account);
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);

-- 课程表索引
CREATE INDEX IF NOT EXISTS idx_lessons_title ON lessons(title);
CREATE INDEX IF NOT EXISTS idx_lessons_created_at ON lessons(created_at);

-- 步骤表索引
CREATE INDEX IF NOT EXISTS idx_steps_lesson ON steps(lesson_id);
CREATE INDEX IF NOT EXISTS idx_steps_order ON steps("order");
CREATE INDEX IF NOT EXISTS idx_steps_lesson_order ON steps(lesson_id, "order");  -- 复合索引，提高按课程和顺序查询的性能

-- 学习进度表索引
CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_lesson ON learning_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_lesson ON learning_progress(user_id, lesson_id);  -- 复合索引，与唯一约束对应
CREATE INDEX IF NOT EXISTS idx_learning_progress_last_accessed ON learning_progress(last_accessed);
CREATE INDEX IF NOT EXISTS idx_learning_progress_completed ON learning_progress(completed);
CREATE INDEX IF NOT EXISTS idx_learning_progress_progress ON learning_progress(progress);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_completed ON learning_progress(user_id, completed);  -- 复合索引，提高按用户和完成状态查询的性能

-- 创建函数：更新updated_at字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器：自动更新用户表的updated_at字段
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 创建函数：密码加密（示例，使用pgcrypto扩展）
-- 注意：需要先启用pgcrypto扩展
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CREATE OR REPLACE FUNCTION encrypt_password(p_password TEXT) 
-- RETURNS TEXT AS $$
-- BEGIN
--   RETURN crypt(p_password, gen_salt('bf'));
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE OR REPLACE FUNCTION verify_password(p_password TEXT, p_hash TEXT) 
-- RETURNS BOOLEAN AS $$
-- BEGIN
--   RETURN crypt(p_password, p_hash) = p_hash;
-- END;
-- $$ LANGUAGE plpgsql;

-- 插入示例数据
-- 示例用户
INSERT INTO users (name, account, password, avatar, level)
VALUES 
('测试用户', 'test', 'test', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg', 1)
ON CONFLICT (account) DO NOTHING;

-- 示例课程
INSERT INTO lessons (id, title, pinyin, thumbnail, tip)
VALUES 
('hello', '你好', 'Nǐ Hǎo', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS9nNiMWtxCfogk1FYyRWH9bZXnjqgvYK-K4jBQz7jkCx30aHn5My2DBbxr8U3GFwR7ZnweqHvg7rR5v9IxLeMGG_QBrR6ig6IThEqWT7DzeSvV-1c2T31N8MS0ceg8PGsjAFD25VHtO5NTBi16N493pDSk6ynF8hQ9qaooHhjrM3AynOvBbmwjhXJ1gLJUaUf8GezmcDas4Lu3rtQLzT2Op8k5fJ3bmFvdptyqwhSVmRpsB2LXvZ9D86wU5ssSAupvIfBDhfobUY', '做"你好"这个动作时，记得要保持微笑哦！'),
('friend', '朋友', 'Péng Yǒu', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF4nCOhtIRD-9wLm0eZcacYy1GeNboSLCJZ8qJNs_edxyoM5CV_1Te3bIvjggDaCC5Qeu7hljg95OHU_BE6En6VeJUkycJR8wB4nuTtlBV3q1bK-0bvS-QbDtafwu64Vqcu308iBAeZaueEctBxKJ_SHJ4BG6Hsn5-cvNNtrnKE0BLG3ukmLSLBQI_3qRLHCtcPwFRE9n79SCIuYd53zApSaJr5asG8ip2XS4wkaQcPag1tQU5Hec5OOPuf__nWX0W8yVVjj3ueDQ', '表达"朋友"时，双手食指钩在一起，象征着紧密的联结。')
ON CONFLICT (id) DO NOTHING;

-- 示例步骤
INSERT INTO steps (lesson_id, title, description, image, "order")
VALUES 
('hello', '举起手掌', '张开你的手掌，举到额头附近，就像敬礼一样。', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbwAdqFwtM-sOnRWRQPZ4IqDPFq1em0bCRSVdkLfKuBY-SdVyystyvl9adxsKUzbwfrkJXCJoEtXn_DxXeFgnyK7CY4SaikuZ0XFFqjkMYP-iXLZVDJY_w-eZ0Fekjn0GPDKwbpJhwReJpjSnDulXQeACIG7_wMCmKLFGuvdLn6oEkdhBlRcA7LEm4tBfGyxkR295ny-eXsYaDzvc8FjYfyyiiY8I9NRGqlL9kDeSb_dFuvM7YFgUa76uxan5UgTlCzRrwK8KSx0', 1),
('hello', '向前移动', '手掌稍微向前并在头部前方画一个小弧线。', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU0ZIIUAtcPmeIdpgaaqI8K5Z5TqIm23Ot428zOcJfdvp3iWek3zXHVEJnV5F0_yqeOuF1ebpmAqBmgjXrBRj0wg5GWopkf6F-Ate36u4QHMT8d-jiaOSOaPBM3YtJWj1GAq79GsSJ4iWumFsuOkMk6xqtyjycKPbas51GwjlX64wM6SucwGfcjSIX4USk_wHv5EvMNNYfGKbWRBZGA3KcpJ-T1DefS4g94519woWNdUvrYi8Fa_KdwOltE-iiY3IJD5m7kYAOtJ8', 2),
('friend', '食指相对', '双手食指伸出，指尖相对。', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQbwAdqFwtM-sOnRWRQPZ4IqDPFq1em0bCRSVdkLfKuBY-SdVyystyvl9adxsKUzbwfrkJXCJoEtXn_DxXeFgnyK7CY4SaikuZ0XFFqjkMYP-iXLZVDJY_w-eZ0Fekjn0GPDKwbpJhwReJpjSnDulXQeACIG7_wMCmKLFGuvdLn6oEkdhBlRcA7LEm4tBfGyxkR295ny-eXsYaDzvc8FjYfyyiiY8I9NRGqlL9kDeSb_dFuvM7YFgUa76uxan5UgTlCzRrwK8KSx0', 1),
('friend', '相钩结合', '左右食指互相钩在一起，轻轻拉动。', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDU0ZIIUAtcPmeIdpgaaqI8K5Z5TqIm23Ot428zOcJfdvp3iWek3zXHVEJnV5F0_yqeOuF1ebpmAqBmgjXrBRj0wg5GWopkf6F-Ate36u4QHMT8d-jiaOSOaPBM3YtJWj1GAq79GsSJ4iWumFsuOkMk6xqtyjycKPbas51GwjlX64wM6SucwGfcjSIX4USk_wHv5EvMNNYfGKbWRBZGA3KcpJ-T1DefS4g94519woWNdUvrYi8Fa_KdwOltE-iiY3IJD5m7kYAOtJ8', 2)
ON CONFLICT DO NOTHING;

-- 优化建议总结
-- 1. 索引优化：
--    - 添加了用户表的account和name字段索引
--    - 添加了课程表的title和created_at字段索引
--    - 添加了步骤表的order字段索引和(lesson_id, order)复合索引
--    - 添加了学习进度表的last_accessed、completed、progress字段索引
--    - 添加了学习进度表的(user_id, completed)复合索引

-- 2. 性能优化：
--    - 添加了自动更新updated_at字段的触发器
--    - 添加了复合索引，提高多字段查询的性能
--    - 优化了外键关联，确保数据完整性

-- 3. 安全优化：
--    - 提供了密码加密的函数示例（需要pgcrypto扩展）
--    - 确保了字段的NOT NULL约束
--    - 添加了唯一约束，避免重复数据

-- 4. 维护建议：
--    - 定期运行VACUUM和ANALYZE命令，优化数据库性能
--    - 监控索引使用情况，移除未使用的索引
--    - 考虑使用连接池，提高数据库连接效率
--    - 定期备份数据库，确保数据安全
