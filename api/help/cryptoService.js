const { log } = require('console');
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const value = require('./value')
const key = value.keyCrypto;
const iv = value.VICrypto

module.exports = {
    Encrypt,
    Decrypt,
    Compare
};


async function Encrypt(str) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const crypted = cipher.update(str, 'utf8', 'hex')
    const rs = crypted.toString('hex');
    return rs;
}
async function Decrypt(str) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    var dec = decipher.update(str, 'hex', 'utf8')
    const rs = dec.toString('utf8');
    return rs;
}

function Compare(str, encode) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    var dec = decipher.update(encode, 'hex', 'utf8')
    const rs = dec.toString('utf8');
    return rs === str;

}

