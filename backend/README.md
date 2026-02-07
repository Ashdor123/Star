# 四星手语平台后端API

## 项目概述

这是"四星手语"儿童学习平台的后端API服务，提供用户认证、课程管理和学习进度跟踪等功能。

## 技术栈

- **后端框架**: Node.js + Express
- **数据库**: Supabase
- **认证**: JWT (JSON Web Tokens)
- **API格式**: RESTful JSON

## 项目结构

```
backend/
├── config/              # 配置文件
│   └── supabase.js      # Supabase数据库配置
├── middleware/          # 中间件
│   └── auth.js          # 认证中间件
├── routes/              # API路由
│   ├── user.js          # 用户相关路由
│   ├── lesson.js        # 课程相关路由
│   └── progress.js      # 学习进度相关路由
├── utils/               # 工具函数
│   └── auth.js          # 认证相关工具函数
├── scripts/             # 脚本文件
│   └── database-init.js # 数据库初始化脚本
├── services/            # 服务
├── .env                 # 环境变量
├── package.json         # 项目配置
├── server.js            # 服务器入口
└── README.md            # 项目文档
```

## 环境变量

在运行项目之前，需要在 `.env` 文件中配置以下环境变量：

```env
# Supabase配置
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT配置
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# 服务器配置
PORT=3001
NODE_ENV=development
```

## 安装和运行

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm start
```

服务器将在 `http://localhost:3001` 上运行。

## API文档

### 认证相关API

#### POST /api/auth/register
- **描述**: 用户注册
- **请求体**: `{ "name": "用户名", "avatar": "头像URL" }`
- **响应**: `{ "success": true, "user": { ... }, "token": "jwt-token" }`

#### POST /api/auth/login
- **描述**: 用户登录
- **请求体**: `{}`
- **响应**: `{ "success": true, "user": { ... }, "token": "jwt-token" }`

#### GET /api/users/me
- **描述**: 获取当前用户信息
- **请求头**: `Authorization: Bearer jwt-token`
- **响应**: `{ "success": true, "user": { ... } }`

#### PUT /api/users/me
- **描述**: 更新用户信息
- **请求头**: `Authorization: Bearer jwt-token`
- **请求体**: `{ "name": "新用户名", "avatar": "新头像URL" }`
- **响应**: `{ "success": true, "user": { ... } }`

### 课程相关API

#### GET /api/lessons
- **描述**: 获取课程列表
- **响应**: `{ "success": true, "lessons": [ ... ] }`

#### GET /api/lessons/:id
- **描述**: 获取课程详情（包含步骤）
- **响应**: `{ "success": true, "lesson": { ... } }`

#### GET /api/lessons/featured
- **描述**: 获取推荐课程
- **响应**: `{ "success": true, "lessons": [ ... ] }`

### 学习进度相关API

#### GET /api/progress
- **描述**: 获取用户学习进度
- **请求头**: `Authorization: Bearer jwt-token`
- **响应**: `{ "success": true, "progress": [ ... ] }`

#### GET /api/progress/:lessonId
- **描述**: 获取用户特定课程的学习进度
- **请求头**: `Authorization: Bearer jwt-token`
- **响应**: `{ "success": true, "progress": { ... } }`

#### PUT /api/progress/:lessonId
- **描述**: 更新用户学习进度
- **请求头**: `Authorization: Bearer jwt-token`
- **请求体**: `{ "progress": 50, "completed": false }`
- **响应**: `{ "success": true, "progress": { ... } }`

## 数据库设计

### 用户表 (users)
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | UUID | 用户唯一标识 |
| name | TEXT | 用户名 |
| avatar | TEXT | 头像URL |
| level | INTEGER | 用户等级 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 课程表 (lessons)
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | TEXT | 课程唯一标识 |
| title | TEXT | 课程标题 |
| pinyin | TEXT | 拼音 |
| thumbnail | TEXT | 缩略图URL |
| tip | TEXT | 小贴士 |
| created_at | TIMESTAMP | 创建时间 |

### 步骤表 (steps)
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | INTEGER | 步骤ID |
| lesson_id | TEXT | 关联课程ID |
| title | TEXT | 步骤标题 |
| description | TEXT | 步骤描述 |
| image | TEXT | 步骤图片URL |
| order | INTEGER | 步骤顺序 |

### 学习进度表 (learning_progress)
| 字段名 | 数据类型 | 描述 |
|-------|---------|------|
| id | UUID | 记录唯一标识 |
| user_id | UUID | 关联用户ID |
| lesson_id | TEXT | 关联课程ID |
| completed | BOOLEAN | 是否完成 |
| progress | INTEGER | 完成进度百分比 |
| last_accessed | TIMESTAMP | 最后访问时间 |

## 开发说明

1. **模拟数据**: 在没有配置Supabase的情况下，系统会使用模拟数据进行开发。
2. **错误处理**: 所有API都包含了错误处理，确保系统稳定性。
3. **日志记录**: 系统会记录所有API请求，便于调试和监控。

## 部署说明

1. **Supabase配置**: 在部署前，需要在Supabase控制台创建项目并获取配置信息。
2. **环境变量**: 在生产环境中，需要设置真实的环境变量。
3. **CORS配置**: 在生产环境中，应该设置具体的前端域名，而不是使用 `*`。

## 注意事项

- 本项目仅供学习和开发使用，生产环境需要进一步优化和安全加固。
- 所有敏感信息（如JWT密钥、Supabase密钥）都应该通过环境变量配置，不要硬编码在代码中。