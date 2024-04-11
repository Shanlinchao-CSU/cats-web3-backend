// 登录请求的处理函数
const handler = require("../web3Handler/handler");
const {updateCMessage, getPrivateKey, resetCurCarbonAllowance, queryAllCarbonAllowance} = require("./mysqlHandler");
const {mysql} = require("../config/mysqlConfig");
const {parseKey, encrypt} = require("../utils/AES");
exports.login = (req, res) => {
    res.send('login OK')
}


// 提交碳报告
exports.submitCarbonReport = async (req, res) => {
    // 获取请求参数
    let {report, amount, publicKey, account_id} = req.query;
    let privateKey = await getPrivateKey(account_id);

    if (privateKey === '' || privateKey === undefined) {
        res.send('获取密钥失败,提交失败');
        return;
    }

    report = encrypt(report, parseKey(privateKey));
    handler.submitCarbonReport(report, amount, publicKey).then(r => {
        if (updateCMessage(account_id, amount)) {
            res.send(r === 0 ? '提交成功' : '提交失败');
        } else {
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

// 注册时给用户发放碳币和碳额度
exports.register = (req, res) => {
    // 获取请求参数
    let { publicKey, coin, amount } = req.query;
    Promise.all([
        handler.mintCarbonCoin(publicKey, coin),
        handler.resetCarbonAllowance(publicKey, amount)
    ])
        .then(results => {
            const coinResult = results[0] === 0 ? '碳币发放成功' : '碳币发放失败';
            const allowanceResult = results[1] === 0 ? '额度发放成功' : '额度发放失败';
            res.send(`${coinResult}，${allowanceResult}`);
        })
        .catch(error => {
            res.status(500).send('处理请求时发生错误');
        });
}

exports.test = async (req, res) => {
    let resp = await queryAllCarbonAllowance()
    let flag = await resetCurCarbonAllowance();
    res.send(resp);
}

process.on('uncaughtException', (error) => {
    // 处理未捕获的异常
    console.error('An uncaught exception occurred:', error);
});
