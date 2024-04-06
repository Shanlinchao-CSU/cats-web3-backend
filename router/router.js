const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const Handler = require('../handler/handler')
// 处理登录请求的映射关系
router.get('/login', Handler.login)
// 处理提交碳报告请求的映射关系
router.post('/submitCarbonReport', Handler.submitCarbonReport)

module.exports = router