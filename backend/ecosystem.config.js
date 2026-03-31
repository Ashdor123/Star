module.exports = {
  apps: [{
    name: 'star-sign-language-backend',
    script: './server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    kill_timeout: 5000,
    listen_timeout: 10000,
    // 健康检查
    health_check_grace_period: 30000,
    // 自动重启配置
    min_uptime: '10s',
    max_restarts: 5,
    // 日志配置
    log_type: 'json',
    log_max_size: '10MB',
    log_rotate_interval: '1d',
    log_rotate_keep: 7
  }]
};
