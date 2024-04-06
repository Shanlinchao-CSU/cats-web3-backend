// 导入 express 模块
const express = require('express')
const redisHandler = require('./handler/redisHandler')
// 创建 express 的服务器实例
const app = express()
// 之后的其他配置都写在这里

// 导入 cors 中间件
const cors = require('cors')

// 导入并注册用户路由模块
const Router = require('./router/router')
// 将 cors 注册为全局中间件，允许跨域请求
app.use(cors())
app.use('/api', Router)

// 定义一个中间件函数，用来过滤请求
let filter = (req, res, next) => {
    //TODO 鉴权逻辑
    // 获取请求头中的 token
    let token = req.headers['authorization']
    // 判断 token 是否存在
    let id = redisHandler.get(token)
    if (token) {
        // 如果 token 存在，则继续处理请求
        next()
    }
}

// app.use(filter)

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(8888, function () {
    console.log('server is running at http://127.0.0.1:8888')
})