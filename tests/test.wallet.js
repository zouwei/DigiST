

const { expect, assert } = require("chai");
const { suite, test, setup, teardown } = require("mocha");
const { Wallet } = require('../services/wallet');

suite('Wallet unit testing', function () {

    // 钱包：公私钥生成
    test("test create privateKey", function () {

        var Crypto = require('crypto')
        var secp256k1 = require('secp256k1')
        var keccak = require('keccak')

        var privateKey = Crypto.randomBytes(32);
        var pubKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
        var address = keccak('keccak256').update(pubKey).digest().slice(-20);

        console.log(privateKey.toString('hex'));
        console.log(pubKey.toString('hex'));
        console.log(address.toString('hex'));

        assert.isString(privateKey.toString('hex'), '生成私钥成功');
        assert.isString(pubKey.toString('hex'), '生成公钥成功');
        assert.isString(address.toString('hex'), '生成地址成功');

    });

    // 钱包：创建钱包
    test("test createWallet()", function () {

        let p = {};
        // 查询列表
        Wallet.createWallet(p).then(data => {

            assert.isObject(data, "钱包创建成功");
        });
    });


});