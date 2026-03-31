#!/bin/bash

# 四星手语平台部署脚本
# 用于在服务器上手动部署或更新应用

set -e

echo "========================================"
echo "四星手语平台部署脚本"
echo "========================================"

# 配置变量
BACKEND_DIR="/www/wwwroot/star-sign-language-backend"
FRONTEND_DIR="/www/wwwroot/star-sign-language"
NGINX_CONF="/www/server/panel/vhost/nginx/star-sign-language.conf"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 函数：打印信息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 函数：检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 未安装，请先安装"
        exit 1
    fi
}

# 检查必要的命令
check_command node
check_command npm
check_command pm2
check_command nginx

print_info "环境检查通过"

# 检查后端目录
if [ ! -d "$BACKEND_DIR" ]; then
    print_error "后端目录不存在: $BACKEND_DIR"
    exit 1
fi

# 部署后端
print_info "开始部署后端..."
cd $BACKEND_DIR

# 检查 .env 文件
if [ ! -f ".env" ]; then
    print_warn ".env 文件不存在，正在创建默认配置..."
    cat > .env << EOF
# Supabase配置
SUPABASE_URL=https://xhzqhuynpvtrcwpdeipn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_sbS8ljbGYFxoM9jcKdkMKA_DIPco2BE

# JWT配置
JWT_SECRET=four-star-sign-language-secret-key-2026
JWT_EXPIRES_IN=7d

# 服务器配置
PORT=3001
NODE_ENV=production
EOF
    print_info ".env 文件已创建"
fi

# 安装依赖
print_info "安装后端依赖..."
npm install

# 创建日志目录
mkdir -p logs
mkdir -p uploads/lessons uploads/steps uploads/avatars
chmod 755 uploads uploads/lessons uploads/steps uploads/avatars

# 停止旧服务
print_info "停止旧的后端服务..."
pm2 stop star-sign-language-backend 2>/dev/null || true
pm2 delete star-sign-language-backend 2>/dev/null || true

# 启动新服务
print_info "启动新的后端服务..."
pm2 start ecosystem.config.js
pm2 save

# 检查服务状态
sleep 3
if pm2 describe star-sign-language-backend > /dev/null 2>&1; then
    print_info "后端服务启动成功"
    pm2 status
else
    print_error "后端服务启动失败"
    exit 1
fi

# 检查前端目录
if [ -d "$FRONTEND_DIR" ]; then
    print_info "前端目录存在: $FRONTEND_DIR"
    
    # 检查 Nginx 配置
    if [ -f "$NGINX_CONF" ]; then
        print_info "Nginx 配置存在"
        
        # 测试 Nginx 配置
        if nginx -t; then
            print_info "Nginx 配置测试通过"
            
            # 重载 Nginx
            print_info "重载 Nginx..."
            nginx -s reload
            print_info "Nginx 重载成功"
        else
            print_error "Nginx 配置测试失败，请检查配置"
        fi
    else
        print_warn "Nginx 配置文件不存在: $NGINX_CONF"
        print_info "请手动配置 Nginx"
    fi
else
    print_warn "前端目录不存在: $FRONTEND_DIR"
fi

# 健康检查
print_info "进行健康检查..."
sleep 2

if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    print_info "后端服务健康检查通过"
else
    print_warn "后端服务健康检查未通过，服务可能还在启动中"
fi

echo "========================================"
print_info "部署完成！"
echo "========================================"
echo ""
echo "后端服务状态:"
pm2 status
echo ""
echo "访问地址:"
echo "- 前端: http://$(hostname -I | awk '{print $1}')"
echo "- 后端API: http://$(hostname -I | awk '{print $1}'):3001"
echo ""
echo "常用命令:"
echo "- 查看日志: pm2 logs star-sign-language-backend"
echo "- 重启服务: pm2 restart star-sign-language-backend"
echo "- 停止服务: pm2 stop star-sign-language-backend"
echo "========================================"
