const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// 中间件
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 简单的日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// 使用Express内置的请求体解析中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/api/health', (req, res) => {
  console.log('Health check request received');
  res.status(200).json({ success: true, message: '服务器运行正常' });
});

// 简单的登录端点
app.post('/api/auth/login', (req, res) => {
  try {
    console.log('Login request received');
    const { account, password, guest } = req.body || {};
    
    if (guest) {
      // 游客登录
      console.log('Guest login');
      return res.status(200).json({
        success: true,
        user: {
          id: Date.now().toString(),
          name: '游客',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
          level: 1
        },
        token: 'guest-token-' + Date.now()
      });
    } else if (account && password) {
      // 账号密码登录
      console.log('Account login:', account);
      // 简单的验证
      if (password === 'test') {
        return res.status(200).json({
          success: true,
          user: {
            id: '1',
            name: '测试用户',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
            level: 1
          },
          token: 'account-token-' + Date.now()
        });
      } else {
        return res.status(401).json({ error: '账号或密码错误' });
      }
    } else {
      return res.status(400).json({ error: '请提供账号和密码' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`最小化服务器运行在 http://localhost:${PORT}`);
});
