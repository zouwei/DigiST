

const { expect, assert } = require("chai");
const { suite, test, setup, teardown } = require("mocha");
const { WalletWeb3 } = require('../services/wallet.web3');


suite('Wallet unit testing', function () {

    // // 钱包：公私钥生成
    // test("test create privateKey", function () {

    //     var Crypto = require('crypto')
    //     var secp256k1 = require('secp256k1')
    //     var keccak = require('keccak')

    //     var privateKey = Crypto.randomBytes(32);
    //     var pubKey = secp256k1.publicKeyCreate(privateKey, false).slice(1);
    //     var address = keccak('keccak256').update(pubKey).digest().slice(-20);

    //     console.log(privateKey.toString('hex'));
    //     console.log(pubKey.toString('hex'));
    //     console.log(address.toString('hex'));

    //     assert.isString(privateKey.toString('hex'), '生成私钥成功');
    //     assert.isString(pubKey.toString('hex'), '生成公钥成功');
    //     assert.isString(address.toString('hex'), '生成地址成功');

    // });

    // // 钱包：创建钱包
    // test("test createWallet()", function () {

    //     // 查询列表
    //     WalletWeb3.createWallet().then(data => {
    //         console.log("新建钱包>>>", JSON.stringify(data));
    //         assert.isObject(data, "钱包创建成功");
    //         // 马上解锁账户
    //         let account = WalletWeb3.unlockWallet({ privateKey: data.privateKey })
    //         console.log('解锁账户>>', JSON.stringify(account));
    //     });
    // });


    // // 钱包：根据助记词导入钱包
    // test("test importWallet(by mnemonic)", function () { 
    //     let derivePath = "m/44'/60'/0'/0/0";

    //     let data = WalletWeb3.importWalletMnemonic("farm usual marble endorse voice tobacco weird swear color fall search jar", derivePath);
    //     console.log("钱包私钥>>>", data);
    //     // 解锁账户
    //     let account = WalletWeb3.unlockWallet({ privateKey: data });
    //     console.log('解锁账户>>', JSON.stringify(account));

    //     assert.isString(data, "导入钱包");

    // });

    // // 钱包：导出keystore
    // test("test encryptWalletKeystore()", function () {

    //     let account = WalletWeb3.encryptWalletKeystore("0x3a6333c21287dbcec96556196dbc314ffbcf33d752817eac8366ba2d931d9ed3", "12345678");
    //     console.log("钱包>>>", JSON.stringify(account));
    //     // 

    //     // // 解锁账户
    //     let unaccount = WalletWeb3.unlockWallet({ privateKey: "0x3a6333c21287dbcec96556196dbc314ffbcf33d752817eac8366ba2d931d9ed3", "password": "12345678" });
    //     console.log('解锁账户>>', JSON.stringify(unaccount));

    //     assert.isObject(account, "导入钱包");

    // });

    // // 钱包：根据keystore+密码导入账户
    // test("test unlockWallet()", function () {

    //     let keystore = WalletWeb3.encryptWalletKeystore("0x3a6333c21287dbcec96556196dbc314ffbcf33d752817eac8366ba2d931d9ed3", "12345678");
    //     console.log("导出keystore>>>", JSON.stringify(keystore));

    //     // 解锁账户
    //     let walletAccount = WalletWeb3.unlockWallet({ keystore: keystore, password: "12345678" });
    //     console.log("导入钱包>>>", JSON.stringify(walletAccount));

    //     assert.isObject(keystore, "导入钱包");

    // });


    //  // 钱包：导出keystore
    //  test("test getBalance()", function () {

    //     let account = WalletWeb3.getBalance("address":"");
    //     console.log("钱包>>>", JSON.stringify(account));
    //     // // 解锁账户
    //     // let account = WalletWeb3.unlockWallet({ privateKey: data });
    //     // console.log('解锁账户>>', JSON.stringify(account));

    //     assert.isObject(account, "导入钱包");

    // });


    // // 钱包：查询账户余额
    // test("test getBalance()", function () {

    //     WalletWeb3.getBalance({ "address": "0x6d7d4a3c274813A00a4e34B842582021733f1a6C" }).then(balance => {
    //         console.log("钱包余额>>>", balance);
    //         assert.isString(balance, "钱包余额查询");
    //     });
    // });



    // 钱包：转账
    test("test sendSignedTransaction()", function () {
        // 转账参数
        let args = {
            fromaddress: "0x25090d091a19cabd722f508776ffc2c44119c24b",                // 18816644630
            toaddress: "0xa78928eac28219c7d1b1563e9568ada8bfc7677d",                  // 88888888888
            number: "0.0000001",
            privatekey: "0xe8999d39004a0642fd467423117407e3502fe0e6969d169b85c9a9750920e4df"
        }

        WalletWeb3.sendSignedTransaction(args).then(balance => {
            console.log("转账结果>>>", JSON.stringify(balance));
            assert.isObject(balance, "转账成功");
        });
    });


});