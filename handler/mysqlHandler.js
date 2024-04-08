const { mysql } = require('../config/mysqlConfig');
const {Decimal} = require('../utils/decimal')

/**
 * 报告上链后新增一条记录
 *
 * @param account_id
 * @param amount
 * @return {boolean} true: 成功 false: 失败
 */
exports.updateCMessage = (account_id, amount) => {
    let selectSql = `SELECT t_limit FROM cnts.account_limit WHERE account_id = ?`
    let selectParams = [account_id]
    let flag = false

    // 查询用户的额度
    mysql.query(selectSql, selectParams, (err, result) => {
        if (err) {
            console.log('[SELECT ERROR] - ', err.message)
            return
        }
        flag = true
        let limit = result[0].t_limit

        let remain = Decimal.sub(limit - amount)
        remain = remain.toFixed(15) // 精度为15位

        let updateSql = `UPDATE cnts.cmessage SET t_limit = ? and t_remain = ? WHERE account_id = ?`
        let updateParams = [limit - amount, remain, account_id]

        // 更新用户的额度
        mysql.query(updateSql, updateParams, (err, result) => {
            if (err) {
                flag = false
                console.log('[UPDATE ERROR] - ', err.message)
            }
        })
    })

    if (flag) {
        return true
    }else {
        return false
    }
}