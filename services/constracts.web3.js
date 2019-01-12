// web3智能合约
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
     * 
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

        let gasEstimate = 968355 - 50000;

        //  return Promise.resolve({ "abi": abi, "bytecode": bytecode });

        // 创建合约部分
        console.log('gasEstimate start ');
        // 估算交易的gas用量
        // let gasEstimate = await web3.eth.estimateGas({ data: '0x' + bytecode });
        console.log('gasEstimate: ' + gasEstimate);
        console.log('deploying contract...', args.fromaddress, (gasEstimate + 50000).toString());

        console.log(JSON.stringify({
            from: args.fromaddress,             // 发布人地址            
            gas: 30000000000,                        // provide as fallback always 5M gas
            gasPrice: (gasEstimate + 50000).toString(),      // 用于交易的gas价格（单位：wei）
            value: 0
        }));
 

        // 创建合约对象
        let myContract = new web3.eth.Contract(abi, {
            data: '0x' + bytecode,
            from: args.fromaddress,                         // 发布人地址            
            gas: 30000000000,                               // provide as fallback always 5M gas
            gasPrice: gasEstimate + 50000
        });


        console.debug("Contract >>");
        console.log("gasPrice>>", myContract.options.gasPrice);
        console.log("from>>", myContract.options.from);

 


        // return myContract.balanceOf(args.fromaddress, function (error, balance) {
        //     console.log("error.>", error);
        //     console.log("error.>", balance);
        //     return Promise.resolve({ "balance": balance })
        // });

        // 部署合约
        return myContract.deploy({
            data: '0x' + bytecode,	                    //已0x开头
            arguments: [1000000000000000, "test contract Aa", "tcaa"]	                            //传递构造函数的参数
        }).send({
            from: args.fromaddress,                         // 发布人地址            
            gas: 30000000000,                               // provide as fallback always 5M gas
            gasPrice: gasEstimate + 50000// (gasEstimate + 50000).toString()      // 用于交易的gas价格（单位：wei）

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



    }


}


module.exports = { ConstractsWeb3 };