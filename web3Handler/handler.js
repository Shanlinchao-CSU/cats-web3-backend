const { default: Web3 } = require('web3');

const { abi: CarbonCoinABI } = require('../contracts/CarbonCoin.json');
const { abi: CarbonCreditsABI } = require('../contracts/CarbonCredits.json');

const providerUrl = 'http://120.78.1.201:8545'; // 以太坊节点的地址
const account = '0x8b751a0226707ef8df389078b288d13a415343b7'; // 以太坊账户地址

const web3 = new Web3(providerUrl);

const carbonCoinContractAddress = '0x5Cd0C2F8f49722a952589e164F5dfAec172Ea762'; // CarbonCoin 智能合约地址
const carbonCreditsContractAddress = '0x893C5df07B54e3be0454B8f5fBf5CfeE02f73bD4'; // CarbonCredits 智能合约地址

const carbonCoin = new web3.eth.Contract(CarbonCoinABI, carbonCoinContractAddress);
const carbonCredits = new web3.eth.Contract(CarbonCreditsABI, carbonCreditsContractAddress);

module.exports.submitCarbonReport = async function (report) {
    let code = 0;
    try {
        // 获取 Gas 价格
        const gasPrice = await web3.eth.getGasPrice();

        // 构造交易对象
        const txObject = {
            from: account,
            gasPrice: gasPrice,
            gas: 100, // 设置 Gas 限制
        };

        // 调用智能合约方法提交碳报告
       await carbonCredits.methods.submitCarbonReport(account, 500, report).send(txObject);

    } catch (error) {
        code = 1;
        console.error('Error submitting carbon report:', error);
    }
    return code;
}

