/**
 * 作废
 */
const fs = require('fs');
const solc = require('solc');
// web3
const config = require('config')
const WEB3CONFIG = config.get('global.web3');
let Web3 = require('web3');
let web3 = new Web3(WEB3CONFIG.givenProvider);

class ConstractsWeb3 {


    // 编译合约

    /**
     * 创建新合约
     * @param {JSON} args 
     * { 
     *      "fromaddress":"",           // 发起交易地址
     * }
     */
    static compile(args) {
        // compile.js

        //编译合约
        let source = fs.readFileSync("./contracts/token.sol", 'utf8');

        console.log('compiling contract...');
        let compiledContract = solc.compile(source);
        console.debug('done', JSON.stringify(compiledContract));


        // //   let output = JSON.parse(compiledContract);
        // if (compiledContract.errors) {
        //     for (let i = 0; i < compiledContract.errors.length; i++) {
        //         let err = compiledContract.errors[i]
        //         return Promise.reject(err);
        //     }
        // }


        // 生成字节码
        let bytecode = compiledContract.contracts[":ERC20"].bytecode;
        let abi = JSON.parse(compiledContract.contracts[":ERC20"].interface);



        console.log('bytecode', bytecode)

        // for (let contractName in compiledContract.contracts) {
        //     bytecode = compiledContract.contracts[contractName].bytecode;
        //     abi = JSON.parse(compiledContract.contracts[contractName].interface);
        //       continue;
        // }



        // 创建合约部分
        console.log('gasEstimate start ');


        console.log('deploying contract...');

        // console.log(JSON.stringify({
        //     from: args.fromaddress,             // 发布人地址            
        //     gas: 50000,                        // provide as fallback always 5M gas
        //     gasPrice: (gasEstimate + 50000).toString(),      // 用于交易的gas价格（单位：wei）
        //     value: 0
        // }));





        // 需要把钱包
        let account = web3.eth.accounts.privateKeyToAccount(args.privateKey);
        web3.eth.accounts.wallet.add(account);


        // web3.eth.accounts.wallet.add(args.privateKey);
        console.log("1111>>>", web3.eth.accounts[0]);
        // 创建合约对象
        let myContract = new web3.eth.Contract(abi);

        console.debug("Contract >>");
        console.log("gasPrice>>", myContract.options.gasPrice);
        console.log("from>>", myContract.options.from);

        // 估算交易的gas用量
        return web3.eth.estimateGas({ data: '0x' + bytecode }).then(gasEstimate => {

            // 部署合约
            return myContract.deploy({
                data: '0x' + bytecode,	                    //已0x开头
                arguments: [1000000000000000, "test contract Aa", "tcaa"]	                            //传递构造函数的参数
            }).send({
                from: args.fromaddress,                         // 发布人地址            
                gas: 3000000,                               // provide as fallback always 5M gas
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


    /**
         * 转账
         * 注意：以太币和Token代币转账是一样的
         * @param {*} args 
         */
    static async sendSignedTransactionToConstracts(args) {
        // 参数解构
        let { contract_address, fromaddress, toaddress, number, privatekey } = args;
        // 指定地址发出的交易数量
        let nonce = await web3.eth.getTransactionCount(fromaddress);
        // 获取当前gas价格，该价格由最近的若干块 的gas价格中值决定
        let gasPrice = await web3.eth.getGasPrice();
        // 转账金额转换成为wei
        let balance = web3.utils.toWei(number, "ether");
        console.log('转账金额', number, balance);

        // 私钥
        var privateKey = new Buffer(privatekey.slice(2), 'hex');

        // var rawTx = {
        //     from: fromaddress,
        //     nonce: nonce,
        //     gasPrice: gasPrice,
        //     to: toaddress,//如果转的是token代币，那么这个to就是合约地址
        //     value: balance,
        //     data: "0x00" //tokenData                 //转Token代币会用的一个字段
        // }



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



        // const contract = new web3.eth.Contract(iterface);
        // contract.options.address = contractAddress;
        // const account = web3.eth.accounts.decrypt(keystore, password);
        // web3.eth.accounts.wallet.add(account);
        // const value_wei = web3.utils.toWei(value, 'ether');


        // const data = contract.methods.transfer(toAddr, value_wei).encodeABI();
        // web3.eth.sendTransaction({
        //     from: fromAddr,
        //     to: contractAddress,
        //     value: '0x00',
        //     gasPrice,
        //     gas,
        //     data,
        // },
        //     (error, txhash) => {
        //         callabck(error, txhash);
        //     });




        // 生成字节码
        // let bytecode = compiledContract.contracts[":ERC20"].bytecode;
        let abi = JSON.parse(compiledContract.contracts[":ERC20"].interface);

        // 需要把钱包
        let account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        console.log('args.contract_address', contract_address)
        // 创建合约对象

        let myContract = new web3.eth.Contract(abi, contract_address);

        // let decimals = await myContract.methods.decimals().call();
        // let balance = number * Math.pow(10, decimals);

        let myBalance = await myContract.methods.balanceOf(fromaddress).call();         //fromaddress

        console.log('myBalance', myBalance, balance)
        console.log('gasPrice', gasPrice)
        console.log('合约发起人地址>>', myContract.options.address)
        // if (myBalance < balance) {
        //     return Promise.reject(new Error("余额不足"));
        // }
        let tokenData = await myContract.methods.transfer(toaddress, balance).encodeABI();          //toaddress
        // 转账参数
        let rawTx = {
            from: fromaddress,
            nonce: nonce,
            // value: '0x00',
            gasPrice: gasPrice + 50000,             // gasPrice,+ 50000
            // gasLimit: 7000000,
            to: contract_address,                   // 那么这个to就是合约地址 myContract.options.address
            data: tokenData                         // 指定转token代币
        }

        // 需要将交易的数据进行gas预估，然后将gas值设置到参数中
        let gas = await web3.eth.estimateGas(rawTx);
        console.log("gas>>>", gas);
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


module.exports = { ConstractsWeb3 };