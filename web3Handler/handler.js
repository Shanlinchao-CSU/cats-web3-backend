const { default: Web3 } = require('web3');

const { abi: CarbonCoinABI } = require('../contracts/CarbonCoin.json');
const { abi: CarbonCreditsABI } = require('../contracts/CarbonCredits.json');
const {getPrivateKeyByPublicKey} = require("../handler/mysqlHandler");
const {decrypt, parseKey, encryptByDefaultKey} = require("../utils/AES");

const providerUrl = 'http://120.78.1.201:8545'; // 以太坊节点的地址
const accounts = ["0xa512dc579dad9e019c2953c6085e130e8633f7ca", // 0 系统
    "0x35afb612b9f26bba267eb7310d20c3bc1b0a9548", // 1 数据审核员
    "0x4d92bc92e8421b4079fbf1b1ef3cece011d16830"] // 2 第三方机构

const web3 = new Web3(providerUrl);

const carbonCoinContractAddress = "0xBeAa1C479D634372b80ba1F538B5a850e56d542E"; // CarbonCoin 智能合约地址
const carbonCreditsContractAddress = "0x561067595417797Bf55D5e40C75eF0e4561bBF50"; // CarbonCredits 智能合约地址

const carbonCoin = new web3.eth.Contract(CarbonCoinABI, carbonCoinContractAddress);
const carbonCredits = new web3.eth.Contract(CarbonCreditsABI, carbonCreditsContractAddress);

/**
 * 提交碳报告
 *
 * @param report    碳报告
 * @param amount    碳排放量
 * @param publicKey 公钥
 * @return {Promise<number>}    0: 成功 1: 失败
 */
module.exports.submitCarbonReport = async function (report, amount, publicKey) {
    let code = 0;
    try {
        // 获取 Gas 价格
        // const gasPrice = await web3.eth.getGasPrice();
        const gasPrice = 2000000000; // 2 Gwei

        // 构造交易对象
        const txObject = {
            from: accounts[1], // 数据审核员
            gasPrice: gasPrice,
            gas: 10000000, // 设置 Gas 限制
            password: "123456mm"
        };
        // 调用智能合约方法提交碳报告
       let result = await carbonCredits.methods.submitCarbonReport(publicKey, amount, report).send(txObject);
    } catch (error) {
        code = 1;
        console.error('Error submitting carbon report:', error);
    }
    return code;
}

/**
 * 发放碳币
 *
 * @param publicKey 公钥
 * @param amount    数量
 * @return {Promise<number>}   0: 成功 1: 失败
 */
module.exports.mintCarbonCoin = async function (publicKey, amount) {
    let code = 0;
    try {
        // 获取 Gas 价格
        // const gasPrice = await web3.eth.getGasPrice();
        const gasPrice = 20000000000; // 20 Gwei

        // 构造交易对象
        const txObject = {
            from: accounts[0], // 系统
            gasPrice: gasPrice,
            gas: 10000000, // 设置 Gas 限制
        };

        // 调用智能合约方法发送碳币
       await carbonCoin.methods
       .transfer(publicKey, web3.utils.toWei(amount,"ether"))
       .send(txObject);

    } catch (error) {
        code = 1;
        console.error('Error mint carbon coin:', error);
    }
    return code;
}

/**
 * 重置碳排放额度
 *
 * @param publicKey 公钥
 * @param amount    数量
 * @return {Promise<number>}    0: 成功 1: 失败
 */
module.exports.resetCarbonAllowance = async function (publicKey, amount) {
    let code = 0;
    try {
        // 获取 Gas 价格
        // const gasPrice = await web3.eth.getGasPrice();
        const gasPrice = 20000000000; // 20 Gwei

        // 构造交易对象
        const txObject = {
            from: accounts[0], // 系统
            gasPrice: gasPrice,
            gas: 10000000, // 设置 Gas 限制
        };

        // 调用智能合约方法重置碳排放额度
       await carbonCredits.methods
       .resetAllowance(publicKey, amount)
       .send(txObject);

    } catch (error) {
        code = 1;
        console.error('Error reset carbon allowance:', error);
    }
    return code;
}

/**
 * 获取碳报告
 *
 * @return  碳报告
 */
module.exports.getCarbonReport = async function () {
    // 调用智能合约事件
    const events = await carbonCredits.getPastEvents('CarbonReportSubmitted', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    let result = []
    for (const item of events) {
        let address = item.returnValues.account
        address = address.toLowerCase()
        let private_key = await getPrivateKeyByPublicKey(encryptByDefaultKey(address))
        let report = decrypt(item.returnValues.carbonReport[0], parseKey(private_key))
        result.push({address: address, report: report})
    }
    return result;
}
