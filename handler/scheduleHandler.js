const schedule = require('node-schedule');
const {queryAllCarbonAllowance, resetCurCarbonAllowance} = require("./mysqlHandler");
const {resetCarbonAllowance} = require("../web3Handler/handler");

const everyMonth = '0 0 0 1 * *';

/**
 * 每月月初1号晚12点（0点）执行 重置碳排放额度
 * 1.数据库中重置当月碳排放额度
 * 2.查询所有用户的碳排放额度
 * 3.区块链中重置所有用户的碳排放额度
 */
exports.resetCarbonAllowance = () => {
    schedule.scheduleJob(everyMonth, async () => {
        // 查询所有用户的碳排放额度
        let res = await queryAllCarbonAllowance();

        // 重置碳排放额度
        await resetCurCarbonAllowance();
        res.forEach((item) => {
            resetCarbonAllowance(item.public_key, item.t_limit)
        })
    });
}