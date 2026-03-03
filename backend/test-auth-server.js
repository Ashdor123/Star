import http from 'http';

const PORT = 3001;

function handleRequest(req, res) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  
  // 健康检查
  if (req.url === '/api/health' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, message: '服务器运行正常' }));
    return;
  }
  
  // 登录请求
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({
      success: true,
      user: {
        id: '1',
        name: '游客',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSW_4Vemod3sTNTovtXknl5nGwKmnu2glkFk7b-9IlUdT3UZmOxlRBi_-r4PtN6zuNAC8bhKmI1Rr8ymbqqD28KhJFd4-jZN3_9hJteTDA15tmX9SSqyZQruYohwT0bPCJvS04B-p2MqILmEwCNWBf1lnlIUVi7KGfIi8JrERsAr9YXjRjwppJ4qjdrIfzwExN8ti82iT0-95v5qgfeQBbsUmi48sGjJEHCWIdDrx7ACBo2YVVXPoeJtvi_xL5Jv7TsBkvgoF7cTg',
        level: 1
      },
      token: 'test-token-123'
    }));
    return;
  }
  
  // 404处理
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 404;
  res.end(JSON.stringify({ error: '接口不存在' }));
}

const server = http.createServer(handleRequest);

server.on('error', (error) => {
  console.error('Server error:', error);
});

server.listen(PORT, () => {
  console.log(`测试认证服务器运行在 http://localhost:${PORT}`);
});

// 监听进程错误
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});