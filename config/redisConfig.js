const redis = require('redis');

// 创建 Redis 客户端
const client = redis.createClient({
    host: '47.107.29.163',
    port: 52726,
    // 如果 Redis 服务器需要密码认证，请添加以下字段
    password: 'root'
});

// 监听连接错误
client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

exports.redis = client;
