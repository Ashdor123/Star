const supabase = require('../config/supabase');

async function initDatabase() {
  try {
    // 创建用户表
    console.log('创建用户表...');
    const { error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (usersError && usersError.code === '42P01') {
      // 表不存在，创建表
      const { error: createUsersError } = await supabase
        .rpc('create_users_table');

      if (createUsersError) {
        console.error('创建用户表失败:', createUsersError);
      } else {
        console.log('用户表创建成功');
      }
    }

    // 创建课程表
    console.log('创建课程表...');
    const { error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .limit(1);

    if (lessonsError && lessonsError.code === '42P01') {
      const { error: createLessonsError } = await supabase
        .rpc('create_lessons_table');

      if (createLessonsError) {
        console.error('创建课程表失败:', createLessonsError);
      } else {
        console.log('课程表创建成功');
      }
    }

    // 创建步骤表
    console.log('创建步骤表...');
    const { error: stepsError } = await supabase
      .from('steps')
      .select('id')
      .limit(1);

    if (stepsError && stepsError.code === '42P01') {
      const { error: createStepsError } = await supabase
        .rpc('create_steps_table');

      if (createStepsError) {
        console.error('创建步骤表失败:', createStepsError);
      } else {
        console.log('步骤表创建成功');
      }
    }

    // 创建学习进度表
    console.log('创建学习进度表...');
    const { error: progressError } = await supabase
      .from('learning_progress')
      .select('id')
      .limit(1);

    if (progressError && progressError.code === '42P01') {
      const { error: createProgressError } = await supabase
        .rpc('create_learning_progress_table');

      if (createProgressError) {
        console.error('创建学习进度表失败:', createProgressError);
      } else {
        console.log('学习进度表创建成功');
      }
    }

    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败:', error);
  }
}

// 直接创建表结构（如果RPC函数不可用）
async function createTablesDirectly() {
  try {
    // 创建用户表
    console.log('直接创建用户表...');
    const { error: createUsersError } = await supabase
      .from('users')
      .insert([{
        id: '1',
        name: '测试用户',
        avatar: 'https://example.com/avatar.jpg',
        level: 1
      }]);

    if (createUsersError && createUsersError.code === '42P01') {
      // 表不存在，需要使用SQL创建
      console.log('需要使用SQL创建表结构');
      // 注意：在实际环境中，你需要在Supabase控制台执行这些SQL语句
      console.log(`
      -- 创建用户表
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
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
      `);
    } else {
      console.log('用户表已存在');
    }

    console.log('表结构创建完成');
  } catch (error) {
    console.error('创建表结构失败:', error);
  }
}

createTablesDirectly();