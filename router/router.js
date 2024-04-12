const express = require('express')
const router = express.Router()

// 导入用户路由处理函数模块
const Handler = require('../handler/handler')
// 处理登录请求的映射关系
router.get('/login', Handler.login)
// 处理提交碳报告请求的映射关系
router.post('/submitCarbonReport', Handler.submitCarbonReport)
// 处理发放碳币请求的映射关系
router.post('/mintCarbonCoin', Handler.mintCarbonCoin)
// 处理重置碳币额度请求的映射关系
router.post('/resetCarbonAllowance', Handler.resetCarbonAllowance)
// 处理注册时进行发放碳币和碳额度请求的映射关系
router.post('/register', Handler.register)
//  测试接口
// router.get('/test', Handler.test)
// 获取所有碳报告
router.get('/getCarbonReports', Handler.getCarbonReport)

module.exports = router