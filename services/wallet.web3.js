/**
 * 钱包
 * 基于以太坊（web3）的区块链的钱包开发
 */
const { UserInfo } = require("../modelservices");
const config = require('config')
const WEB3CONFIG = config.get('global.web3');
let Web3 = require('web3');
// "Web3.providers.givenProvider" will be set if in an Ethereum supported browser. Web3.givenProvider || 
let web3 = new Web3(WEB3CONFIG.givenProvider);
// 以太坊交易
var Tx = require('ethereumjs-tx');
// 助记词
let bip39 = require('bip39');
let hdkey = require('ethereumjs-wallet/hdkey');
let util = require('ethereumjs-util');
// 智能合约
const solc = require('solc');
const fs = require('fs');

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
            "mnemonic": mnemonic,                                           // 助记词（绝对保密）
            "privateKey": util.bufferToHex(key1._hdkey._privateKey),        // 私钥（绝对保密）
            "keystore": ""                                                  // keystore，未导出，不保存
        }
        // 添加进入账户
        let account = web3.eth.accounts.privateKeyToAccount(myAccount.privateKey);
        web3.eth.accounts.wallet.add(account);


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
        console.log('转账金额', number, balance);

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


    /**
     * 查询代币余额
     * @param {JOSN} args 
     * {
     *      "contract_address":"",          // 合约地址
     *      "fromaddress":""                // 查询账户地址
     * }
     */
    static getTokenBalance(args) {
        // 参数解构
        let { contract_address, fromaddress } = args;
        // 指定地址发出的交易数量 
        let source = fs.readFileSync("./contracts/token.sol", 'utf8');
        console.log('compiling contract...');
        let compiledContract = solc.compile(source);
        console.debug('compile done');
        
        // 检查编译合约是否报错 
        if (compiledContract.errors) {
            for (let i = 0; i < compiledContract.errors.length; i++) {
                let err = compiledContract.errors[i]
                return Promise.reject(err);
            }
        }

        // 生成字节码
        let abi = JSON.parse(compiledContract.contracts[":ERC20"].interface);

        console.log('args.contract_address', contract_address)
        // 创建合约对象

        let myContract = new web3.eth.Contract(abi, contract_address);
        // 查询合约代币余额
        return myContract.methods.balanceOf(fromaddress).call().then(myBalance => {
            console.log('myBalance>>>', myBalance);
            // 单位换算
            myBalance = web3.utils.fromWei(myBalance);
            // 返回代币余额
            return Promise.resolve(myBalance);
        });


    }



    /**
     * 创建新合约
     * @param {JSON} args 
     * { 
     *      "fromaddress":"",           // 发起交易地址
     * }
     */
    static createContract(args) {

        //编译合约
        let source = fs.readFileSync("./contracts/token.sol", 'utf8');

        console.log('compiling contract...');
        let compiledContract = solc.compile(source);
        console.debug('compile done');

        // 检查编译合约是否报错 
        if (compiledContract.errors) {
            for (let i = 0; i < compiledContract.errors.length; i++) {
                // 直接抛错
                return Promise.reject(new Error(compiledContract.errors[i]));
            }
        }

        // 生成字节码
        let bytecode = compiledContract.contracts[":ERC20"].bytecode;
        let abi = JSON.parse(compiledContract.contracts[":ERC20"].interface);

        // 创建合约部分
        console.log('bytecode')
        console.log('gasEstimate start ');
        console.log('deploying contract...');

        // 需要把钱包
        let account = web3.eth.accounts.privateKeyToAccount(args.privateKey);
        web3.eth.accounts.wallet.add(account);

        // 创建合约对象
        let myContract = new web3.eth.Contract(abi);

        console.debug("Contract >>");
        console.log("gasPrice>>", myContract.options.gasPrice);
        console.log("from>>", myContract.options.from);

        // 估算交易的gas用量
        return web3.eth.estimateGas({ data: '0x' + bytecode }).then(gasEstimate => {

            // 发行量，需要转换成为wei的单位值
            let totalSupply = web3.utils.toWei(args.totalSupply.toString(), 'ether');
            // 部署合约
            return myContract.deploy({
                data: '0x' + bytecode,	                    //已0x开头
                arguments: [totalSupply, args.name, args.symbol]	      //传递构造函数的参数 1000000, "test contract Aa", "tcaa"
            }).send({
                from: args.fromaddress,                 // 发布人地址            
                gas: 3000000,                           // provide as fallback always 5M gas
                gasPrice: gasEstimate + 50000,          // (gasEstimate + 50000).toString()      // 用于交易的gas价格（单位：wei）
                value: 0
            }, function (error, transactionHash) {
                console.log("send回调");
                console.log("error:", error);
                console.log("send transactionHash:" + transactionHash);
            })
                .on('error', function (error) { console.error("error>>", error) })
                .then(function (newContractInstance) {
                    var newContractAddress = newContractInstance.options.address
                    console.log("新合约地址:" + newContractAddress);
                    return Promise.resolve(newContractAddress);
                }).catch(ex => {
                    console.log("ex", ex);
                    return Promise.resolve(ex);
                });
        });

    }



}

module.exports = { WalletWeb3 };