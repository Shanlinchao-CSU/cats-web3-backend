const { mysql, mysql2} = require('../config/mysqlConfig');
const {Decimal} = require('../utils/decimal')
const {decryptByDefaultKey} = require("../utils/AES");

/**
 * 报告上链后新增一条记录
 * 中间计算使用 Decimal.js和toFixed 来保证15位精度
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
    return flag;
}

/**
 * 获取密钥
 *
 * @param account_id
 * @return {string} 密钥
 */
exports.getPrivateKey = async (account_id) => {
    return new Promise((resolve, reject) => {
        let selectSql = `SELECT secret_key
                         FROM cnts.account
                         WHERE account_id = ?`;
        let selectParams = [account_id];

        mysql.query(selectSql, selectParams, (err, result) => {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                reject(err);
                return;
            }
            let privateKey = result[0].secret_key;

            resolve(privateKey);
        });
    });
};

/**
 * 获取当月碳排放额度授额
 * 遍历所有用户，将account_limit表中的t_limit字段更新为limit_next_month字段
 * 将limit_next_month字段更新为null
 */
exports.resetCurCarbonAllowance = async () => {
    return new Promise((resolve, reject) => {
        let selectSql = `SELECT account_id, limit_next_month
                     FROM cnts.account_limit`
        let updateSql = `UPDATE cnts.account_limit
                     SET t_limit          = limit_next_month,
                         limit_next_month = null
                     WHERE account_id = ?`
        let flag = true

        mysql.query(selectSql, (err, result) => {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message)
                reject(err)
                return
            }

            result.forEach((item) => {
                if (item.limit_next_month === null) return
                let updateParams = [item.account_id]
                mysql.query(updateSql, updateParams, (err, result) => {
                    if (err) {
                        flag = false
                        console.log('[UPDATE ERROR] - ', err.message)
                        reject(err)
                    }
                })
            })
        })
        resolve(flag)
    });
}

/**
 * 查询所有用户的碳排放额度
 */
exports.queryAllCarbonAllowance = async () => { // 确保传入mysql实例
    try {
        let selectSql = `SELECT * FROM cnts.account_limit`;
        let selectPublicKeySql = `SELECT public_key FROM cnts.account WHERE account_id = ?`;

        return await Promise.all(
            await mysql2.query(selectSql).then(result => {
                let [rows, _] = result;
                // 假设每个account_id对应一个t_limit
                return rows.map(item => ({account_id: item.account_id,
                    t_limit: item.limit_next_month===null ? item.t_limit : item.limit_next_month}));
            }).then(accounts => {
                return Promise.all(
                    accounts.map(account => {
                        return mysql2.query(selectPublicKeySql, [account.account_id]).then(pubResult => {
                            if (pubResult.length > 0) {
                                let publicKey = pubResult[0][0].public_key
                                if (publicKey === undefined)  return account;
                                account.public_key = decryptByDefaultKey(publicKey);
                                return account;
                            }
                            return account; // 如果没有公钥，返回原始账户信息
                        });
                    })
                );
            })
        ); // 这里results已经是填充好的数组
    } catch (err) {
        throw err; // 抛出错误，以便调用者可以处理
    }
};