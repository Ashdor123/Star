const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// 简单的日志中间件
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// 导入路由
const userRoutes = require('./routes/user');
const lessonRoutes = require('./routes/lesson');
const progressRoutes = require('./routes/progress');
const batchRoutes = require('./routes/batch');

const app = express();
const PORT = process.env.PORT || 3001;

// 速率限制中间件
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 10, // 每个IP在窗口期内最多10次请求
  message: { error: '请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // 跳过非认证路由
    return !req.url.includes('/api/auth');
  }
});

// 通用速率限制
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP在窗口期内最多100次请求
  message: { error: 'API请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false
});

// 中间件
app.use(logger);
app.use(cors({
  origin: '*', // 在生产环境中，你应该设置具体的前端域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authLimiter); // 应用认证速率限制
app.use('/api', apiLimiter); // 应用API速率限制

// 路由
app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/batch', batchRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: '服务器运行正常' });
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
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;