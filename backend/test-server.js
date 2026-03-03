const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, message: '服务器运行正常' }));
});

server.listen(3001, () => {
  console.log('测试服务器运行在 http://localhost:3001');
});
