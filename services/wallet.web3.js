/**
 * 钱包
 * 基于以太坊（web3）的区块链的钱包开发
 */
const { UserInfo } = require("../modelservices");
const config = require('config')
const WEB3CONFIG = config.get('global.web3');
let Web3 = require('web3');
// 助记词
let bip39 = require('bip39');
let hdkey = require('ethereumjs-wallet/hdkey');
let util = require('ethereumjs-util');
// 以太坊交易
var Tx = require('ethereumjs-tx');

// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser. Web3.givenProvider || 
let web3 = new Web3(WEB3CONFIG.givenProvider);

class WalletWeb3 {

    /**
     * 定义需要使用到的业务API
     * 【创建钱包】
     * 1.创建钱包（身份名、密码、密码提示）
     * 注意：创建完账号之后，提供keystore文件+私钥+助记词
     * 为了是app的流程更加简化，前期推荐只使用助记词的方式走完完整的业务闭环，一个业务流程用户体验也是好的，关键是不懵逼
     * （在没看完100多页的以太坊钱包PDF之前，我也没搞明白）
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
     * 
     * 【创建智能合约】
     * 1.新建智能合约（Token代币）
     * 
     * 【交易&转账】
     * 1.余额查询
     * 2.以太币转账（可以暂缓开发）
     * 3.Token代币转账（重点）
     */


    /**
     * 创建钱包
     * 创建钱包的方式有多重，我们采用助记词的方式
     * @param {JSON} args 
     */
    static createWallet() {


        // console.log('web3>>', web3);
        // // 创建助记词
        // let mnemonic = bip39.generateMnemonic();
        // console.log("mnemonic>>", mnemonic);

        // // 创建账户
        // let account = web3.eth.accounts.create(mnemonic);

        // let myAccount = {
        //     "address": account.address,                 // 地址（可公开）
        //     "mnemonic": mnemonic,                       // 助记词（绝对保密）
        //     "privateKey": account.privateKey,           // 私钥（绝对保密）
        //     "keystore": account.encrypt(mnemonic)       // keystore（相对保密）
        // }
        // console.log("myAccount>>", JSON.stringify(myAccount));

        // return Promise.resolve(myAccount);


        console.log('web3>>', web3);
        // 创建助记词
        let mnemonic = bip39.generateMnemonic();
        console.log("mnemonic>>", mnemonic);

        var seed = bip39.mnemonicToSeed(mnemonic)
        var hdWallet = hdkey.fromMasterSeed(seed)
        // 默克尔树根
        var key1 = hdWallet.derivePath("m/44'/60'/0'/0/0")
        console.log("私钥：" + util.bufferToHex(key1._hdkey._privateKey));

        var address1 = util.pubToAddress(key1._hdkey._publicKey, true)
        console.log("地址：" + util.bufferToHex(address1))

        address1 = util.toChecksumAddress(address1.toString('hex'))
        console.log("Encoding Address 地址：" + address1)
        // 账户
        let myAccount = {
            "address": address1,                                            // 地址（可公开）
            "mnemonic": mnemonic,                          // 助记词（绝对保密）
            "privateKey": address1,        // 私钥（绝对保密）
            "keystore": ""                                                  // keystore，未导出，不保存
        }
        console.log("myAccount>>", JSON.stringify(myAccount));

        return Promise.resolve(myAccount);
    }


    /**
     * 导入钱包助记词获取私钥
     * @param {String} mnemonic 根据助记词导入钱包
     * @param {String} derivePath      m/44'/60'/0'/0/0
     */
    static importWalletMnemonic(mnemonic, derivePath) {

        // 根据助记词导入钱包
        //将助记词转换成为seed
        let seed = bip39.mnemonicToSeed(mnemonic)
        //通过hdkey将seed生成HDWallet
        let hdWallet = hdkey.fromMasterSeed(seed)
        //生成的钱包中在m/44'/60'/0'/0/0路径的第一个账户的eypair。
        let key = hdWallet.derivePath(derivePath)
        //获取私钥
        return util.bufferToHex(key._hdkey._privateKey);

    }


    /**
     * 解锁钱包
     * @param {JSON} args 
     * {
     *      "privateKey":"",                // 【解锁方式一】使用web3通过私钥解锁账号
     *      "keystore,":"",                 // 【解锁方式二】keystore + 密码
     *      "password":"",                  // 【解锁方式二】密码
     *      "mnemonic":"",                  // 【解锁方式三】根据助记词导入钱包
     * }
     * @returns Object 一个账户对象
     * {
     *      "address":"0x2c7536E3605D9C16a7a3D7b1898e529396a65c23",
     *      "privateKey":"0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318",
     *      ...
     * }
     */
    static unlockWallet(args) {
        if (args.privateKey && args.privateKey != "") {
            // 【解锁方式一】使用web3通过私钥解锁账号
            return web3.eth.accounts.privateKeyToAccount(args.privateKey);
        } else { // (args.keystore && args.keystore != "" && args.password && args.password != "") {
            // 【解锁方式二】keystore + 密码
            return web3.eth.accounts.decrypt(args.keystore, args.password);            // keystoreJsonV3
        }
    }

    /**
     * 加密钱包Keystore
     * @param {*} args 
     * {
     *      "privateKey":"",            // 私钥
     *      "password":""               // 支付密码
     * }
     */
    static encryptWalletKeystore(privateKey, password) {
        let account = web3.eth.accounts.encrypt(privateKey, password);
        return account;
    }


    /**
     * 查询以太币余额
     * @param {JSON} args
     * {
     *      "address":"",               // 地址
     *      "defaultBlock":"",           // (可选)如果传递此值，则不会使用web3.eth.defaultBlock设置默认快
     *      "unit":""                   // 余额单位：默认ether
     * }
     */
    static getBalance(args) {
        // 查询余额 , args.defaultBlock
        return web3.eth.getBalance(args.address, args.defaultBlock || null).then(number => {
            console.log('number  ', number)
            // 输出的number单位是wei，需要转换成为ether
            // 可能的单位包含
            // wei : ‘1’
            // kwei : ‘1000’
            // mwei : ‘1000000’
            // gwei : ‘1000000000’
            // micro : ‘1000000000000’
            // finney : ‘1000000000000000’
            // ether : ‘1000000000000000000’
            // kether : ‘1000000000000000000000’
            // mether : ‘1000000000000000000000000’
            // gether : ‘1000000000000000000000000000’
            // tether : ‘1000000000000000000000000000000’

            let balance = web3.utils.fromWei(number, args.unit || 'ether');
            console.log('balance  ', balance)
            // 返回余额
            return Promise.resolve(balance);
        });
    }


    // /**
    //  * 发送签名之后的交易
    //  * @param {*} args 
    //  * {
    //  *      "fromaddress":"",               // 发送人地址
    //  *      "toaddress":"",                 // 接收人地址
    //  *      "number":0.001,                 // 转账数量
    //  *      "privatekey":""                 // 私钥 
    //  * }
    //  */
    // static async sendSignedTransaction(args) {
    //     let { fromaddress, toaddress, number, privatekey } = args;

    //     let nonce = await web3.eth.getTransactionCount(fromaddress)
    //     let gasPrice = await web3.eth.getGasPrice();
    //     let balance = await web3.utils.toWei(number)

    //     var privateKey = new Buffer(privatekey.slice(2), 'hex')
    //     var rawTx = {
    //         from: fromaddress,
    //         nonce: nonce,
    //         gasPrice: gasPrice,
    //         to: toaddress,
    //         value: balance,
    //         data: '0x00'//转Token代币会用的一个字段
    //     }
    //     //需要将交易的数据进行gas预估，然后将gas值设置到参数中
    //     let gas = await web3.eth.estimateGas(rawTx)
    //     rawTx.gas = gas


    //     var tx = new Tx(rawTx);
    //     tx.sign(privateKey);
    //     var serializedTx = tx.serialize();
    //     let responseData;
    //     await web3.eth.sendSignedTransaction('0x' +
    //         serializedTx.toString('hex'), function (err, data) {
    //             console.log(err)
    //             console.log(data)


    //             if (err) {
    //                 responseData = fail(err)
    //             }
    //         })
    //         .then(function (data) {
    //             console.log(data)
    //             if (data) {
    //                 responseData = success({
    //                     "transactionHash": data.transactionHash
    //                 })
    //             } else {
    //                 responseData = fail("交易失败")
    //             }
    //         })
    //     return Promise.resolve(responseData);
    // }


    // 获取代币，这个用来测试
    static getContract() {
        let ABI = [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "name": "_symbol",
                        "type": "string"
                    },
                    {
                        "name": "_decimals",
                        "type": "uint8"
                    },
                    {
                        "name": "_totalSupply",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "name": "_spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "name": "remaining",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "balance",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "decimals",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "name",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "symbol",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [

                ],
                "name": "totalSupply",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
        ];

        let contractAddress = "0xe5b2f5a38d6fe39a45f825d39d4cbf0a0aef5a7e"
        let myContract = new web3.eth.Contract(ABI, contractAddress)
        return myContract
    }



    /**
     * 创建合约
     * @param {*} args 
     * {
     *      "ABI":[...],                // ABI
     *      "contractAddress":"",       // 合约地址
     * 
     * }
     */
    static createContract(args) {
        // 参数解构
        let { ABI, contractAddress } = args;
        // 创建合约
        var myContract = new web3.eth.Contract(ABI, contractAddress, {
            from: '0x1234567890123456789012345678901234567891',         // 交易发起的地址
            gasPrice: '10000000000000',                                 // 用户交易的gas价格
            // gas: 1000000,         // 为交易最大提供的最大gas
            // data: ""             // 合约的字节代码，合约部署时使用

        });

        // 调用线上合约
        return myContract.methods.myFunction().call().then(data => {
            // {
            //     myNumber: '23456',
            //     myString: 'Hello!%',
            //     0: '23456', // these are here as fallbacks if the name is not know or  given
            //     1: 'Hello!%'
            // }
            return Promise.resolve(data);
        });
    }


    /**
     * 转账
     * 注意：以太币和Token代币转账是一样的
     * @param {*} args 
     */
    static async sendSignedTransaction(args) {
        // 参数解构
        let { fromaddress, toaddress, number, privatekey } = args;
        // 指定地址发出的交易数量
        let nonce = await web3.eth.getTransactionCount(fromaddress);
        // 获取当前gas价格，该价格由最近的若干块 的gas价格中值决定
        let gasPrice = await web3.eth.getGasPrice();
        // 转账金额转换成为wei
        let balance = await web3.utils.toWei(number);

        // 私钥
        var privateKey = new Buffer(privatekey.slice(2), 'hex')
        var rawTx = {
            from: fromaddress,
            nonce: nonce,
            gasPrice: gasPrice,
            to: toaddress,//如果转的是token代币，那么这个to就是合约地址
            value: balance,
            data: "0x00" //tokenData                 //转Token代币会用的一个字段
        }


        // 如果是转token代币
        if (args.token) {
            let decimals = await myContract.methods.decimals().call();
            let balance = number * Math.pow(10, decimals);
            let myBalance = await myContract.methods.balanceOf(fromaddress).call();
            if (myBalance < balance) {
                return Promise.reject(new Error("余额不足"));
            }
            let tokenData = await myContract.methods.transfer(toaddress, balance).encodeABI();
            // 转账参数
            rawTx = {
                from: fromaddress,
                nonce: nonce,
                gasPrice: gasPrice,
                to: myContract.options.address,         // 那么这个to就是合约地址
                data: tokenData                         // 指定转token代币
            }
        }

        // 需要将交易的数据进行gas预估，然后将gas值设置到参数中
        let gas = await web3.eth.estimateGas(rawTx);
        // gas费
        rawTx.gas = gas;
        // 交易对象
        var tx = new Tx(rawTx);
        // 签名
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        let responseData;
        // 发送签名交易
        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, data) {
            console.log("err>>", err)
            console.log("data>>", data)
            if (err) {
                return Promise.reject(err);
            }
        }).then(data => {
            console.log("转账结果", data)
            if (data) {
                responseData = data;        // 转账hash值
            } else {
                return Promise.reject(new Error("交易失败"));
            }
        });

        return Promise.resolve(responseData);
    }



}

module.exports = { WalletWeb3 };