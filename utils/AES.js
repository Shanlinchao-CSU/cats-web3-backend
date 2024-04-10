const crypto = require('crypto');

/**
 * 加密函数
 * @param {string} text 要加密的数据
 * @param {Buffer} key 密钥
 * @returns {string} 返回加密后的数据
 */
exports.encrypt = (text, key) => {
    // const iv = crypto.randomBytes(16); // 生成一个随机的初始化向量
    // 根据密钥生成初始化向量 32位
    let iv = Buffer.from(key, 'hex');
    iv = iv.subarray(0, 16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted
}

/**
 * 解密函数
 * @param {string} encryptedText 加密后的数据
 * @param {Buffer} key 密钥
 * @returns {string} 返回解密后的数据
 */
exports.decrypt = (encryptedText, key) =>{
    let iv  = Buffer.from(key, 'hex');
    iv = iv.subarray(0, 16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


/**
 * 生成密钥
 * @param {string} address 地址(公钥)
 * @returns {Buffer} 返回生成的密钥
 */
function generateKey(address) {
    const keyA = crypto.createHash('sha256').update(address).digest('hex');
    return Buffer.from(keyA, 'hex');
}

/**
 * 将String解析为密钥
 *
 * @param {string} privateKey
 * @returns {Buffer} 返回生成的密钥
 */
exports.parseKey= (privateKey) => {
    return Buffer.from(privateKey, 'hex');
}



// function demo() {
// //
//     const address = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
//
// // 使用address生成密匙
// //     const key = generateKey(address);
//
//     const key = Buffer.from("2a34575d0f1b7cb39a2c117c0650311a4d3a6e4f507142b45cc3d144bd62ec41", "hex")
//
//     console.log('密钥:', key.toString()); // 密钥根据地址来计算——区块链的公钥
// // 要加密的数据
//     const originalText = 'Hello World!Where are you?I am here!';
//
//
// // 加密数据
// //     const encryptedText = encrypt(originalText, key);
//     const encryptedText = "1c6d684787d4b99f9c01b0254ef1a9c578aa52bffb33d774cec6bf4d83f215df32c8804e270a5a6a8a556e3ce76bc2c1"
//     console.log('加密后的数据:', encryptedText);
//     console.log('加密数据长度:', encryptedText.length); // 加密数据长度不固定，根据原始数据长度变化
//
// // 解密数据
//     const decryptedText = decrypt(encryptedText, key);
//     console.log('解密后的数据:', decryptedText);
//
// }
//
// demo();