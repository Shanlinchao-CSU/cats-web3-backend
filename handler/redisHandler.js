const {redis} = require("../config/redisConfig");


exports.get = (key) => {
    let data = null
    redis.get(key, (err, data) => {
        if (err) {
            console.error('Redis get error:', err);
        } else {
            this.data = data
        }
    });
    return data
}

exports.set = (key, value) => {
    let status = false
    redis.set(key, value, (err) => {
        if (err) {
            console.error('Redis set error:', err);
        } else {
            status = true
            console.log('Set value:', value);
        }
    });
    return status
}