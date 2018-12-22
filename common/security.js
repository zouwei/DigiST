const crypto = require('crypto');
const NodeRSA = require('node-rsa');

/**
 * 通用方法
 */
class SecurityCommon {

    /**
     * 证书格式化
     * 在指定位置插入字符串
     * @param str
     * @param insert_str
     * @param sn
     * @returns {string}
     */
    static certFormat(str, symbol, sn) {
        var newstr = ''
        for (var i = 0; i < str.length; i += sn) {
            var tmp = str.substring(i, i + sn)
            newstr += tmp + symbol
        }
        return newstr;
    }
}


class RSASecurity {
    /**
     * 加签
     * @param {*} src_sign 
     * @param {*} self_private 
     * @param {*} encoding 
     * @param {*} algorithm 
     */
    static sign(src_sign, self_private, encoding, algorithm) {
        var _private = '-----BEGIN PRIVATE KEY-----\n' + SecurityCommon.certFormat(self_private, '\n', 64) + '-----END PRIVATE KEY-----'
        return crypto.createSign(algorithm || 'RSA-SHA1')
            .update(new Buffer(src_sign, 'utf-8'))
            .sign(_private, encoding || 'base64')
    }

    /**
     * 验签
     * @param {*} src_sign 
     * @param {*} signature 
     * @param {*} public_key 
     * @param {*} encoding 
     * @param {*} algorithm 
     */
    static verify(src_sign, signature, public_key, encoding, algorithm) {
        const _public = '-----BEGIN PUBLIC KEY-----\n' + SecurityCommon.certFormat(public_key, '\n', 64) + '-----END PUBLIC KEY-----'
        return crypto.createVerify(algorithm || 'RSA-SHA1')
            .update(new Buffer(src_sign, 'utf-8'))
            .verify(_public, signature, encoding || 'base64')
    }


    /**
     * 加密
     * @param src_data
     * @param public_key
     * @param encoding
     * @returns {string|Buffer}
     */
    static encrypt(src_data, public_key, encoding) {
        let _public = '-----BEGIN PUBLIC KEY-----\n' + SecurityCommon.certFormat(public_key, '\n', 64) + '-----END PUBLIC KEY-----';
        let _NodeRSA = new NodeRSA(_public, { encryptionScheme: "pkcs1" });
        return _NodeRSA.encrypt(src_data, encoding ? encoding : 'base64');
    };

    /**
     * 解密
     * @param cryptograph
     * @param private_key
     * @param encoding
     * @returns {Buffer|Object|string}
     */
    static decrypt(cryptograph, private_key, encoding) {
        let _private = '-----BEGIN PRIVATE KEY-----\n' + SecurityCommon.certFormat(private_key, "\n", 64) + '-----END PRIVATE KEY-----';
        let _NodeRSA = new NodeRSA(_private, { encryptionScheme: "pkcs1" });
        return _NodeRSA.decrypt(cryptograph, encoding ? encoding : 'utf-8');
    };

    /**
     * rsa公钥解密
     * @param {*} text 
     * @param {*} publicKey 
     * @param {*} encoding 
     */
    static rsaPubDcrypt(text, publicKey, encoding) {
        var _NodeRSA = new NodeRSA(publicKey, { encryptionScheme: "pkcs1" });
        return _NodeRSA.decryptPublic(text, encoding ? encoding : 'utf-8');

    };
}


module.exports = exports = { SecurityCommon, RSASecurity }