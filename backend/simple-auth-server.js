const http = require('http');
const url = require('url');
const crypto = require('crypto');

const PORT = 3001;

// 简单的用户存储
const users = [];

// 生成token
function generateToken(user) {
  return crypto.randomBytes(16).toString('hex');
}

// 处理请求的函数
function handleRequest(req, res) {
  try {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 处理OPTIONS请求
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }
    
    // 解析请求URL
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${path}`);
    
    // 健康检查
    if (path === '/api/health' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, message: '服务器运行正常' }));
      return;
    }
    
    // 登录请求
    if (path === '/api/auth/login' && req.method === 'POST') {
      let body = '';
      
      req.on('data', chunk => {
        try {
          body += chunk.toString();
        } catch (error) {
          console.error('Data error:', error);
        }
      });
      
      req.on('end', () => {
        try {
          let parsedBody = {};
          try {
            parsedBody = JSON.parse(body || '{}');
          } catch (parseError) {
            console.error('Parse error:', parseError);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            res.end(JSON.stringify({ error: '请求格式错误' }));
            return;
          }
          
          const { account, password, guest } = parsedBody;
          
          if (guest) {
            // 游客登录
            const guestUser = {
              id: Date.now().toString(),
              name: '游客',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
              level: 1
            };
            const token = generateToken(guestUser);
            
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              user: guestUser,
              token
            }));
            return;
          } else if (account && password) {
            // 账号密码登录
            // 简单的验证
            if (password === 'test') {
              const user = {
                id: '1',
                name: '测试用户',
                account: account,
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
                level: 1
              };
              const token = generateToken(user);
              
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                success: true,
                user: user,
                token
              }));
              return;
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 401;
              res.end(JSON.stringify({ error: '账号或密码错误' }));
              return;
            }
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            res.end(JSON.stringify({ error: '请提供账号和密码' }));
            return;
          }
        } catch (error) {
          console.error('Login error:', error);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 500;
          res.end(JSON.stringify({ error: '服务器内部错误' }));
        }
      });
      
      req.on('error', (error) => {
        console.error('Request error:', error);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.end(JSON.stringify({ error: '请求格式错误' }));
      });
      
      return;
    }
    
    // 注册请求
    if (path === '/api/auth/register' && req.method === 'POST') {
      let body = '';
      
      req.on('data', chunk => {
        try {
          body += chunk.toString();
        } catch (error) {
          console.error('Data error:', error);
        }
      });
      
      req.on('end', () => {
        try {
          let parsedBody = {};
          try {
            parsedBody = JSON.parse(body || '{}');
          } catch (parseError) {
            console.error('Parse error:', parseError);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            res.end(JSON.stringify({ error: '请求格式错误' }));
            return;
          }
          
          const { name, account, password } = parsedBody;
          
          if (!name || !account || !password) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 400;
            res.end(JSON.stringify({ error: '请提供完整的注册信息' }));
            return;
          }
          
          // 创建新用户
          const newUser = {
            id: Date.now().toString(),
            name: name,
            account: account,
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
            level: 1
          };
          
          users.push(newUser);
          const token = generateToken(newUser);
          
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 201;
          res.end(JSON.stringify({
            success: true,
            user: newUser,
            token
          }));
        } catch (error) {
          console.error('Register error:', error);
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 500;
          res.end(JSON.stringify({ error: '服务器内部错误' }));
        }
      });
      
      req.on('error', (error) => {
        console.error('Request error:', error);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.end(JSON.stringify({ error: '请求格式错误' }));
      });
      
      return;
    }
    
    // 404处理
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 404;
    res.end(JSON.stringify({ error: '接口不存在' }));
  } catch (error) {
    console.error('Server error:', error);
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 500;
    res.end(JSON.stringify({ error: '服务器内部错误' }));
  }
}

// 创建服务器
const server = http.createServer(handleRequest);

// 监听错误事件
server.on('error', (error) => {
  console.error('Server error:', error);
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`简单认证服务器运行在 http://localhost:${PORT}`);
});

// 监听进程错误
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});