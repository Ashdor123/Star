# 四星手语平台部署文档

## 一、部署环境准备

### 1. 阿里云服务器配置
- **推荐配置：** 2核4GB内存，40GB SSD，5Mbps带宽
- **操作系统：** CentOS 7.6
- **安全组：** 开放80、443、22端口

### 2. 宝塔面板安装
执行以下命令安装宝塔面板：
```bash
yum install -y wget && wget -O install.sh http://download.bt.cn/install/install_6.0.sh && sh install.sh
```

安装完成后，记录面板登录地址、用户名和密码。

### 3. 环境安装（通过宝塔面板）
- **Node.js：** 安装v18+版本
- **Nginx：** 宝塔面板默认安装
- **PM2：** 通过npm全局安装

## 二、前端部署

### 1. 上传前端文件
- 通过宝塔面板的文件管理上传本地构建的`dist`文件夹到服务器
- 建议路径：`/www/wwwroot/star-sign-language`

### 2. Nginx配置
- 在宝塔面板创建网站
- 域名设置：填写你的域名（如无域名，可使用服务器IP）
- 网站目录：指向`/www/wwwroot/star-sign-language/dist`
- 启用HTTPS（推荐）

### 3. 配置反向代理
在Nginx配置文件中添加以下配置：
```nginx
location /api {
    proxy_pass http://localhost:3001/api;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## 三、后端部署

### 1. 上传后端代码
- 通过宝塔面板上传后端代码到服务器
- 建议路径：`/www/wwwroot/star-sign-language-backend`

### 2. 安装依赖
在服务器后端目录执行：
```bash
npm install
```

### 3. 配置环境变量
编辑`.env`文件，确保配置正确：
```
# Supabase配置
SUPABASE_URL=https://xhzqhuynpvtrcwpdeipn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_publishable_sbS8ljbGYFxoM9jcKdkMKA_DIPco2BE

# JWT配置
JWT_SECRET=four-star-sign-language-secret-key-2026
JWT_EXPIRES_IN=7d

# 服务器配置
PORT=3001
NODE_ENV=production
```

### 4. 启动服务
使用PM2启动后端服务：
```bash
npm install -g pm2
npm start # 或直接使用 pm2 start server.js --name star-sign-language-backend
pm2 save && pm2 startup
```

## 四、Supabase配置

### 1. 数据库表结构
确保Supabase数据库中创建了以下表：

#### users表
- id: uuid (主键)
- name: text
- account: text (唯一)
- password: text
- avatar: text
- level: integer
- created_at: timestamp

#### lessons表
- id: uuid (主键)
- title: text
- pinyin: text
- thumbnail: text
- tip: text
- created_at: timestamp

#### progress表
- id: uuid (主键)
- user_id: uuid (外键，关联users表)
- lesson_id: uuid (外键，关联lessons表)
- completed: boolean
- progress: integer
- last_accessed: timestamp

### 2. 配置Row Level Security
为表配置适当的访问权限，确保用户只能访问自己的数据。

## 五、多媒体内容配置

### 1. 存储方案
- **方案A：** 使用Supabase Storage
- **方案B：** 使用阿里云OSS存储（推荐，国内访问更快）

### 2. 阿里云OSS配置
- 创建OSS存储空间
- 配置访问权限
- 集成到前端和后端代码

### 3. CDN加速
配置阿里云CDN加速静态资源，提高国内访问速度。

## 六、安全配置

### 1. 服务器安全
- 配置宝塔面板防火墙
- 定期更新系统和软件
- 禁用不必要的端口

### 2. 应用安全
- 使用HTTPS
- 密码加密存储
- API接口认证
- 防止SQL注入

### 3. Supabase安全
- 保护API密钥
- 配置适当的Row Level Security
- 定期轮换密钥

## 七、性能优化

### 1. 前端优化
- 静态资源压缩
- 图片懒加载
- 代码分割
- 缓存策略

### 2. 后端优化
- API响应缓存
- 数据库查询优化
- 连接池管理

### 3. 多媒体优化
- 视频转码和压缩
- CDN加速
- 按需加载

## 八、部署验证

### 1. 功能验证
- 访问网站首页
- 测试用户注册和登录
- 测试课程浏览
- 测试学习进度保存

### 2. 性能验证
- 测量页面加载速度
- 测试API响应时间
- 验证多媒体内容加载速度

### 3. 安全验证
- 检查HTTPS配置
- 测试用户权限控制
- 验证数据传输加密

## 九、常见问题解决

### 1. 国内访问速度慢
- **解决方案：** 使用阿里云OSS存储多媒体内容，配置CDN加速

### 2. Supabase连接不稳定
- **解决方案：** 配置API代理，增加超时和重试机制

### 3. 前端构建失败
- **解决方案：** 确保Node.js版本正确，依赖安装完整

### 4. 后端服务无法启动
- **解决方案：** 检查端口占用，查看错误日志，确保环境变量配置正确

### 5. 数据库连接失败
- **解决方案：** 检查Supabase API密钥和URL配置，确保网络连接正常

## 十、部署成本估算

### 1. 服务器成本
- 阿里云ECS：约300-500元/月（2核4GB配置）
- 带宽费用：按实际使用计费

### 2. 域名费用
- 域名注册：约50-100元/年
- SSL证书：免费（Let's Encrypt）或付费

### 3. 存储成本
- 阿里云OSS：按实际使用计费
- 或使用服务器本地存储：包含在服务器费用中

### 4. Supabase成本
- 免费计划：适合小型项目（有使用限制）
- 付费计划：根据使用量计费

## 十一、维护计划

### 1. 日常维护
- 监控服务器状态
- 检查应用日志
- 备份数据库

### 2. 定期维护
- 每月：更新系统和软件
- 每季度：数据库优化，代码审计
- 每年：服务器配置评估，性能优化

## 十二、技术支持

### 1. 官方文档
- [阿里云文档](https://help.aliyun.com/)
- [宝塔面板文档](https://www.bt.cn/docs/)
- [Supabase文档](https://supabase.com/docs)
- [Node.js文档](https://nodejs.org/docs/)

### 2. 故障排查
- 查看Nginx错误日志：`/www/wwwlogs/`
- 查看应用日志：`pm2 logs`
- 检查服务器状态：`top`、`df -h`、`free -m`

---

本部署文档确保平台在国内稳定运行，用户不需要翻墙就能访问网站，同时支持用户注册登录和多媒体内容的后续扩展。