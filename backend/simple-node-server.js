const http = require('http');
const url = require('url');

const PORT = 3003;

// 处理请求的函数
function handleRequest(req, res) {
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
  
  // 处理健康检查请求
  if (path === '/api/health' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, message: '服务器运行正常' }));
    return;
  }
  
  // 处理登录请求
  if (path === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body);
        const { account, password, guest } = parsedBody;
        
        if (guest) {
          // 游客登录
          console.log('Guest login');
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({
            success: true,
            user: {
              id: Date.now().toString(),
              name: '游客',
              avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
              level: 1
            },
            token: 'guest-token-' + Date.now()
          }));
        } else if (account && password) {
          // 账号密码登录
          console.log('Account login:', account);
          // 简单的验证
          if (password === 'test') {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              success: true,
              user: {
                id: '1',
                name: '测试用户',
                avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
                level: 1
              },
              token: 'account-token-' + Date.now()
            }));
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 401;
            res.end(JSON.stringify({ error: '账号或密码错误' }));
          }
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 400;
          res.end(JSON.stringify({ error: '请提供账号和密码' }));
        }
      } catch (error) {
        console.error('Login error:', error);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: '服务器内部错误' }));
      }
    });
    return;
  }
  
  // 处理404请求
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 404;
  res.end(JSON.stringify({ error: '接口不存在' }));
}

// 创建服务器
const server = http.createServer(handleRequest);

// 启动服务器
server.listen(PORT, () => {
  console.log(`简单Node.js服务器运行在 http://localhost:${PORT}`);
});
