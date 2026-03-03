import http from 'http';

const data = JSON.stringify({
  account: 'test',
  password: 'test'
});

const options = {
  hostname: 'localhost',
  port: 3003,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers)}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

// 写入数据到请求体
req.write(data);
req.end();
