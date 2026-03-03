import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;

function handleRequest(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // 处理根路径
  if (req.url === '/') {
    const filePath = path.join(__dirname, 'test-login.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading test-login.html: ${err}`);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`测试服务器运行在 http://localhost:${PORT}`);
});