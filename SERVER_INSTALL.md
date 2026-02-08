# 服务器环境安装指南

## 在阿里云服务器上安装Node.js

### 步骤1：更新软件包列表
在服务器终端执行：
```bash
apt update
```

### 步骤2：安装Node.js和npm
```bash
apt install -y nodejs npm
```

### 步骤3：验证安装
```bash
node -v
npm -v
```

### 步骤4：升级npm到最新版本（推荐）
```bash
npm install -g npm
```

### 步骤5：安装PM2进程管理器
```bash
npm install -g pm2
```

## 继续部署步骤

### 1. 安装项目依赖
```bash
cd /www/wwwroot/star-sign-language-backend
npm install
```

### 2. 启动后端服务
```bash
pm start
# 或使用PM2管理
pm2 start server.js --name star-sign-language-backend
pm2 save
pm2 startup
```

### 3. 查看服务状态
```bash
pm2 status
pm2 logs star-sign-language-backend
```

## 常见问题解决

### 1. npm命令未找到
- 确保已正确安装Node.js
- 检查PATH环境变量是否包含npm路径

### 2. 端口占用
- 检查3001端口是否被占用：`netstat -tlnp | grep 3001`
- 如果被占用，修改`.env`文件中的PORT配置

### 3. 权限问题
- 确保有足够的权限安装依赖：`sudo npm install`
- 确保有足够的权限启动服务

### 4. 网络问题
- 检查服务器网络连接
- 确保防火墙允许相关端口
- 检查Supabase连接是否正常