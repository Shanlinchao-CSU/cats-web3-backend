// 登录请求的处理函数
const handler = require("../web3Handler/handler");
exports.login = (req, res) => {
    res.send('login OK')
}


// 提交碳报告
exports.submitCarbonReport = (req, res) => {
    // 获取请求参数
    let { report } = req.query;
    handler.submitCarbonReport(report).then(r => {
        res.send(r)
    })
}
