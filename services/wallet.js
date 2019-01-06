/**
 * 钱包
 * 基于以太坊（web3）的区块链的钱包开发
 */
let Web3 = require('web3');
// 助记词
let bip39 = require('bip39');
// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
let web3 = new Web3(Web3.givenProvider || 'https://kovan.infura.io/v3/254312daf2f14aa39dee341d40080b3b');

class Wallet {

    /**
     * 定义需要使用到的业务API
     * 【创建钱包】
     * 1.创建钱包（身份名、密码、密码提示）
     * 注意：创建完账号之后，提供keystore文件+私钥+助记词
     * 为了是app的流程更加简化，前期推荐只使用助记词的方式走完完整的业务闭环，一个业务流程用户体验也是好的，关键是不懵逼（再没看完100多页的以太坊钱包PDF之前，我也没搞明白）
     * 
     * 【导入钱包】
     * 1.根据助记词导入钱包
     * 2.根据私钥导入钱包（私钥导入流程可以省略）
     * 
     * 【解锁账户】
     * 1.通过助记词解锁
     * 2.通过私钥解锁（暂缓开发）
     * 3.通过keystore+密码解锁（暂缓开发）
     * 
     * 【创建智能合约】
     * 1.新建智能合约（Token代币）
     * 
     * 【交易&转账】
     * 1.以太币转账（可以暂缓开发）
     * 2.Token代币转账（重点）
     */


    /**
     * 创建钱包
     * @param {JSON} args 
     */
    static createWallet() {
        console.log('web3>>', web3);
        // 创建助记词
        let mnemonic = bip39.generateMnemonic();
        console.log("mnemonic>>", mnemonic);

        // 创建账户
        let account = web3.eth.accounts.create(mnemonic);

        let myAccount = {
            "address": account.address,                 // 地址（可公开）
            "mnemonic": mnemonic,                       // 助记词（绝对保密）
            "privateKey": account.privateKey,           // 私钥（绝对保密）
            "keystore": account.encrypt(mnemonic)       // keystore（相对保密）
        }
        console.log("myAccount>>", JSON.stringify(myAccount));

        return Promise.resolve(myAccount);

    }


    /**
     * 导入钱包
     * @param {JSON} args 
     * {
     *      "mnemonic":"",              // 根据助记词导入钱包
     * }
     */
    static importWallet(args) {

        if (args.mnemonic) {
            // 根据助记词导入钱包

        }

    }


    /**
     * 解锁钱包
     * @param {JSON} args 
     * {
     *      "privateKey":"",                // 【解锁方式一】使用web3通过私钥解锁账号
     *      "":""
     * }
     * @returns Object 一个账户
     */
    static unlockWallet(args) {
        if (args.privateKey && args.privateKey != "") {
            // 根据私钥解锁账户
            web3.eth.accounts.privateKeyToAccount(privateKey);
        }

    }



}

module.exports = { Wallet };