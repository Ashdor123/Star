const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { generateToken } = require('../utils/auth');
const authenticate = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

function logAuthAttempt(type, account, success, details = '') {
  const timestamp = new Date().toISOString();
  const status = success ? '成功' : '失败';
  console.log(`[${timestamp}] [${type}] 账号: ${account || '未知'}, 状态: ${status}${details ? ', 详情: ' + details : ''}`);
}

router.post('/register', async (req, res) => {
  try {
    const { name, account, password, avatar } = req.body;

    if (!name) {
      logAuthAttempt('注册', account, false, '用户名为空');
      return res.status(400).json({ error: '用户名不能为空' });
    }

    if (!account) {
      logAuthAttempt('注册', account, false, '账号为空');
      return res.status(400).json({ error: '账号不能为空' });
    }

    if (!password) {
      logAuthAttempt('注册', account, false, '密码为空');
      return res.status(400).json({ error: '密码不能为空' });
    }

    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('account')
      .eq('account', account)
      .limit(1);

    if (checkError) {
      logAuthAttempt('注册', account, false, '数据库查询失败: ' + checkError.message);
      return res.status(500).json({ error: '服务器内部错误，请稍后重试' });
    }

    if (existingUsers && existingUsers.length > 0) {
      logAuthAttempt('注册', account, false, '账号已存在');
      return res.status(400).json({ error: '该账号已被注册' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        name,
        account,
        password: hashedPassword,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
        level: 1
      }])
      .select('*')
      .single();

    if (error) {
      logAuthAttempt('注册', account, false, '数据库插入失败: ' + error.message);
      return res.status(500).json({ error: '注册失败，请稍后重试' });
    }

    const token = generateToken({ user_id: newUser.id });
    logAuthAttempt('注册', account, true, '用户ID: ' + newUser.id);

    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        account: newUser.account,
        avatar: newUser.avatar,
        level: newUser.level
      },
      token
    });
  } catch (error) {
    logAuthAttempt('注册', req.body.account, false, '服务器错误: ' + error.message);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { account, password, guest } = req.body;
    
    if (guest) {
      logAuthAttempt('游客登录', 'guest', true, '游客模式登录');
      
      const guestAccount = 'guest_' + Date.now();
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          name: '游客',
          account: guestAccount,
          password: 'guest',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
          level: 1
        }])
        .select('*')
        .single();

      if (error) {
        logAuthAttempt('游客登录', 'guest', false, '创建游客用户失败: ' + error.message);
        return res.status(500).json({ error: '游客登录失败，请稍后重试' });
      }

      const token = generateToken({ user_id: newUser.id });
      
      return res.status(200).json({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          avatar: newUser.avatar,
          level: newUser.level
        },
        token
      });
    }
    
    if (!account || !password) {
      logAuthAttempt('登录', account, false, '账号或密码为空');
      return res.status(400).json({ error: '请输入账号和密码' });
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('account', account)
      .limit(1);

    if (error) {
      logAuthAttempt('登录', account, false, '数据库查询失败: ' + error.message);
      return res.status(500).json({ error: '登录失败，请稍后重试' });
    }

    if (!users || users.length === 0) {
      logAuthAttempt('登录', account, false, '账号不存在');
      return res.status(401).json({ error: '账号或密码错误' });
    }

    const foundUser = users[0];
    
    if (!foundUser.password) {
      logAuthAttempt('登录', account, false, '用户密码字段为空');
      return res.status(401).json({ error: '账号或密码错误' });
    }

    const isHashedPassword = foundUser.password.startsWith('$2a$') || 
                              foundUser.password.startsWith('$2b$') || 
                              foundUser.password.startsWith('$2y$');
    
    let isPasswordValid = false;
    
    try {
      if (isHashedPassword) {
        isPasswordValid = await bcrypt.compare(password, foundUser.password);
      } else {
        isPasswordValid = (password === foundUser.password);
      }
    } catch (bcryptError) {
      logAuthAttempt('登录', account, false, '密码验证异常: ' + bcryptError.message);
      return res.status(500).json({ error: '登录失败，请稍后重试' });
    }

    if (!isPasswordValid) {
      logAuthAttempt('登录', account, false, '密码错误');
      return res.status(401).json({ error: '账号或密码错误' });
    }

    const token = generateToken({ user_id: foundUser.id });
    logAuthAttempt('登录', account, true, '用户ID: ' + foundUser.id);

    res.status(200).json({
      success: true,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        account: foundUser.account,
        avatar: foundUser.avatar,
        level: foundUser.level
      },
      token
    });
  } catch (error) {
    logAuthAttempt('登录', req.body.account, false, '服务器错误: ' + error.message);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const { user } = req;

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        level: user.level
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

router.put('/me', authenticate, async (req, res) => {
  try {
    const { user } = req;
    const { name, avatar } = req.body;

    if (!name && !avatar) {
      return res.status(400).json({ error: '至少需要提供一个更新字段' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    updateData.updated_at = new Date().toISOString();

    const { data: userData, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select('*')
      .single();

    if (error) {
      console.error('数据库更新失败:', error);
      return res.status(500).json({ error: '更新失败，请稍后重试' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        avatar: userData.avatar,
        level: userData.level
      }
    });
  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;