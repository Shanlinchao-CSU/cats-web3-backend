// 登录请求的处理函数
const handler = require("../web3Handler/handler");
const {updateCMessage, getPrivateKey, resetCurCarbonAllowance, queryAllCarbonAllowance} = require("./mysqlHandler");
const {mysql} = require("../config/mysqlConfig");
const {parseKey, encrypt} = require("../utils/AES");
const {getCarbonReport} = require("../web3Handler/handler");
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
    // report = "2e2ee1611d1199ec51047d1902495d303ffbc13cd2d2a8ff442a3b969c2de84ce1d3c89e8482ac7b075b95b9bfa07832a8b30979792637d410f72523e6337b2ac8e2ae1c59f1658d8c9d2c3398b76a1d2421952f942f44468a885267aee09ed3b5783b5ae97c883053fef068c0683fd56d7942a1abf8d9155d1082e18ed22c7dd7fc6e68aebff192d5d5917d8b96b4af4fc80075cf60bf9adbb2a7bb6a8d4dc5843d2dddad7c2ec2701a4c93016d7fcdc919cb68d3710b70109fc7941f887fb9efafaedfb43fb0df11939b38bb171710049d4aceade9fafbe088242a4ec1d9e8fb9b96f0cbda14632d43f97bcb5d8240"
    console.log('report:', report)
    handler.submitCarbonReport(report, amount, publicKey).then(async r => {
        let flag = await updateCMessage(account_id, amount);
        if (flag) {
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

// 获取所有碳报告
exports.getCarbonReport = async (req, res) => {
    let result = await getCarbonReport();

    res.send(result);
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
