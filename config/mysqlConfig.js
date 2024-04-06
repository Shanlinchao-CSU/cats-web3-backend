// 引入 mysql2 模块
const mysql = require('mysql2');

// 创建连接池
const pool = mysql.createPool({
    host: '47.107.29.163',      // 数据库主机名
    port: 30336,             // 端口号
    user: 'root',       // 数据库用户名
    password: 'root',   // 数据库密码
    database: 'cnts',  // 数据库名
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


exports.mysql = pool;