#!/bin/bash

# 四星手语后端服务启动脚本

echo "=== 启动四星手语后端服务 ==="

# 进入脚本所在目录
cd "$(dirname "$0")"

# 检查 .env 文件是否存在
if [ ! -f ".env" ]; then
    echo "错误: .env 文件不存在!"
    echo "请创建 .env 文件并配置以下环境变量:"
    echo "  - SUPABASE_URL"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - JWT_SECRET"
    exit 1
fi

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "依赖安装失败!"
        exit 1
    fi
fi

# 检查 PM2 是否安装
if ! command -v pm2 &> /dev/null; then
    echo "正在安装 PM2..."
    npm install -g pm2
fi

# 停止旧服务
echo "停止旧服务..."
pm2 stop star-sign-language-backend 2>/dev/null || true
pm2 delete star-sign-language-backend 2>/dev/null || true

# 启动新服务
echo "启动新服务..."
pm2 start server.js --name star-sign-language-backend --env production

# 保存 PM2 配置
echo "保存 PM2 配置..."
pm2 save

# 检查服务状态
echo "服务状态:"
pm2 status star-sign-language-backend

# 等待服务启动
sleep 3

# 测试健康检查
echo "测试健康检查..."
if curl -s http://localhost:3001/api/health | grep -q "success"; then
    echo "✅ 服务启动成功!"
else
    echo "❌ 服务启动失败，查看日志:"
    pm2 logs star-sign-language-backend --lines 20
    exit 1
fi

echo "=== 启动完成 ==="
