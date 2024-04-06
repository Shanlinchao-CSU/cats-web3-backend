const { default: Web3 } = require('web3');

const { abi: CarbonCoinABI } = require('../contracts/CarbonCoin.json');
const { abi: CarbonCreditsABI } = require('../contracts/CarbonCredits.json');

const providerUrl = 'http://120.78.1.201:8545'; // 以太坊节点的地址
const accounts = ["0xc387a9155b36850cded153182e37f86dbf6064e3", // 0 管理员
    "0x8b751a0226707ef8df389078b288d13a415343b7", // 1 数据审核员
    "0x2f875a7c2069a7b389c24e6227755cde6494e56d"] // 2 第三方机构

const web3 = new Web3(providerUrl);

const carbonCoinContractAddress = '0x5Cd0C2F8f49722a952589e164F5dfAec172Ea762'; // CarbonCoin 智能合约地址
const carbonCreditsContractAddress = '0x893C5df07B54e3be0454B8f5fBf5CfeE02f73bD4'; // CarbonCredits 智能合约地址

const carbonCoin = new web3.eth.Contract(CarbonCoinABI, carbonCoinContractAddress);
const carbonCredits = new web3.eth.Contract(CarbonCreditsABI, carbonCreditsContractAddress);

module.exports.submitCarbonReport = async function (report, amount, publicKey) {
    let code = 0;
    try {
        // 获取 Gas 价格
        // const gasPrice = await web3.eth.getGasPrice();
        const gasPrice = 20000000000; // 20 Gwei

        // 构造交易对象
        const txObject = {
            from: accounts[1], // 数据审核员
            gasPrice: gasPrice,
            gas: 210000, // 设置 Gas 限制
        };

        // 调用智能合约方法提交碳报告
       await carbonCredits.methods.submitCarbonReport(publicKey, amount, report).send(txObject);

    } catch (error) {
        code = 1;
        console.error('Error submitting carbon report:', error);
    }
    return code;
}

