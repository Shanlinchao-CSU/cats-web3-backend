// 引入 mysql2 模块
const mysql = require('mysql2');
const mysql2 = require('mysql2/promise');

// 创建连接池
const pool = mysql.createPool({
    // host: '47.107.29.163',      // 数据库主机名
    // port: 30336,             // 端口号
    host: 'localhost',
    port: 3306,
    user: 'root',       // 数据库用户名
    password: 'root',   // 数据库密码
    database: 'cnts',  // 数据库名
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const pool2 = mysql2.createPool({
    // host: '47.107.29.163',      // 数据库主机名
    // port: 30336,             // 端口号
    host: 'localhost',
    port: 3306,
    user: 'root',       // 数据库用户名
    password: 'root',   // 数据库密码
    database: 'cnts',  // 数据库名
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// pool.getConnection((err, connection) => {
//     if (err) {
//         console.log('mysql connected error:', err);
//     } else {
//         console.log('mysql connected');
//     }
// })
// pool2.getConnection().then(r => {
//     console.log('mysql2 connected');
// }).catch(err => {
//     console.log('mysql2 connected error:', err);
// });

exports.mysql = pool;
exports.mysql2 = pool2;