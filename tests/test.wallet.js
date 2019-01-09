

const { expect, assert } = require("chai");
const { suite, test, setup, teardown } = require("mocha");
const { WalletWeb3 } = require('../services/wallet.web3');


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

    // // 钱包：创建钱包
    // test("test createWallet()", function () {

    //     // 查询列表
    //     WalletWeb3.createWallet().then(data => {
    //         console.log("钱包>>>", JSON.stringify(data));
    //         assert.isObject(data, "钱包创建成功");
    //     });
    // });


    // 钱包：根据助记词导入钱包
    test("test importWallet(by mnemonic)", function () {

        // 查询列表
        let derivePath = "m/44'/60'/0'/0/";
        for (let i = 0; i < 10; i++) {
            let data = WalletWeb3.importWallet({
                "derivePath": derivePath + i,           // "m/44'/60'/0'/0/0",
                "mnemonic": "cradle peanut cost half reform entry guilt soccer invest material element trouble"
            });
            console.log("钱包私钥>>>", data);
            // 解锁账户
            let account = WalletWeb3.unlockWallet({ privateKey: data });
            console.log('解锁账户>>', JSON.stringify(account));

            assert.isString(data, "导入钱包");
        }
    });


});