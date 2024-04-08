// 登录请求的处理函数
const handler = require("../web3Handler/handler");
const {updateCMessage} = require("./mysqlHandler");
exports.login = (req, res) => {
    res.send('login OK')
}


// 提交碳报告
exports.submitCarbonReport = (req, res) => {
    // 获取请求参数
    let { report, amount, publicKey, account_id } = req.query;
    handler.submitCarbonReport(report, amount, publicKey).then(r => {
        if(updateCMessage(account_id, amount)){
            res.send(r === 0 ? '提交成功' : '提交失败');
        }else {
            res.send(r === 0 ? '提交成功,额度更新失败' : '提交失败')
        }

    })
}

// 发放碳币
exports.mintCarbonCoin = (req, res) => {
    // 获取请求参数
    let { publicKey, amount } = req.query;
    handler.mintCarbonCoin(publicKey, amount).then(r => {
        res.send(r === 0 ? '发放成功' : '发放失败');
    })
}


// 重置碳币额度
exports.resetCarbonAllowance = (req, res) => {
    // 获取请求参数
    let { publicKey, amount } = req.query;
    handler.resetCarbonAllowance(publicKey, amount).then(r => {
        res.send(r === 0 ? '重置成功' : '重置失败');
    })
}