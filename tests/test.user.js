const { expect, assert } = require("chai");
const { suite, test, setup, teardown } = require("mocha");
const { RedisCache } = require('../common/redis.class');
const { UserService } = require("../services/user");
const { UserInfo, Sequelize } = require("../modelservices");

suite('User unit  testing', function () {

    // // 测试验证码生成
    // test("test getCaptcha()", function () {
    //     // 测试验证码生成
    //     UserService.getCaptcha().then(data => {
    //         // 验证码输出4位字符串，表示测试通过
    //         assert.lengthOf(data.text, 4);
    //     });
    // });


    // // 测试用户注册
    // test("test userRegister()", function () {
    //     /**
    //      * 功能性测试，跳过发送短信的步骤
    //      * 1.设定一个假的手机测试号码，直接从数据库中删除（88888888888）
    //      * 2.伪造一个redis短信消息
    //      * 3.进行注册
    //      * 4.验证注册结果
    //      */

    //     let mobile = "88888888888";
    //     let verifyCode = "1234";

    //     UserInfo.destroy({ where: { mobile: mobile } }).then(destroy => {
    //         // 写入redis
    //         return RedisCache.set("MOBILE:" + mobile, verifyCode, 20);
    //     }).then(data => {
    //         // 进行注册
    //         return UserService.userRegister({
    //             "mobile": mobile,                       // 手机号码
    //             "password": "12345678",                 // 登录密码
    //             "verifyCode": verifyCode,               // 手机验证码
    //         });
    //     }).then(data => {
    //         // 注册结果  
    //         assert.isObject(data, "测试用户注册，成功");
    //     }).catch(ex => {
    //         console.log(ex);
    //     });
    // });

    // // 测试找回密码
    // test("test retrievePassword()", function () {
    //     let mobile = "78888888888";
    //     let verifyCode = "1234";

    //     return RedisCache.set("MOBILE:" + mobile, verifyCode, 20).then(data => {
    //         // 进行注册
    //         return UserService.retrievePassword({
    //             "mobile": mobile,                       //手机号码
    //             "password": "12345678",                 // 登录密码
    //             "verifyCode": verifyCode,               //手机验证码
    //         });
    //     }).then(data => {
    //         // 修改密码结果 
    //         assert.isObject(data, "测试找回密码，成功");
    //     }).catch(ex => {
    //         console.log(ex);
    //     });
    // });

    // // 用户登录测试
    // test("test userLogin()", function () {
    //     let mobile = "78888888888";

    //     // 用户登录
    //     UserService.userLogin({ "mobile": mobile, "password": "12345678" }).then(data => {
    //         assert.isObject(data, "登录验证成功")
    //     }).catch(ex => {
    //         assert.isObject(null, ex.message);
    //     });
    // });

    // // 测试修改登录密码
    // test("test changePassword()", function () {
    //     // 修改密码
    //     return UserService.changePassword({
    //         "user_id": "49440100583A36F61E5C0000",       //用户id
    //         "old_password": "12345678",                  // 登录密码
    //         "new_password": "12345678",                  //手机验证码
    //     }).then(data => {
    //         // 修改密码结果 
    //         assert.isObject(data, "测试修改登录密码，成功");
    //     }).catch(ex => {
    //         console.log(ex);
    //     });
    // })

    // // 测试修改支付密码
    // test("test changePayPassword()", function () {
    //     // 修改密码
    //     return UserService.changePayPassword({
    //         "user_id": "49440100583A36F61E5C0000",           //用户id
    //         "old_pay_password": "12345678",                 // 登录密码
    //         "new_pay_password": "12345678",                  //手机验证码
    //     }).then(data => {
    //         console.log(data)
    //         // 修改密码结果 
    //         assert.isObject(data, "测试修改支付密码，成功");
    //     }).catch(ex => {
    //         console.log(ex);
    //     });
    // });

    // // 测试创建钱包
    // test("test createUserWallet()", function () {
    //     // 修改密码
    //     return UserService.createUserWallet({ "user_id": "49440100583A36F61E5C0000" }).then(data => {
    //         console.log(data)
    //         // 修改密码结果 
    //         assert.isObject(data, "钱包创建成功");
    //     }).catch(ex => {
    //         console.log(ex);
    //         assert.equal(ex.message, "当前不允许创建多钱包账户", "重复性创建验证成功");
    //     });
    // });

    // // 测试：查询用户钱包
    // test("test getUserWallet()", function () {
    //     // 修改密码
    //     return UserService.getUserWallet({ "user_id": "49440100583A36F61E5C0000" }).then(data => {
    //         console.log(data)
    //         // 修改密码结果 
    //         assert.isObject(data, "查询用户钱包成功");
    //     });
    // });

    // // 测试：导入用户钱包
    // test("test getUserWallet()", function () {
    //     // 修改密码
    //     return UserService.getUserWallet({ "user_id": "49440100583A36F61E5C0000" }).then(data => {
    //         console.log(data)
    //         // 修改密码结果 
    //         assert.isObject(data, "查询用户钱包成功");
    //     });
    // });

    // // 测试：转账交易
    // test("test sendSignedTransaction()", function () {

    //     let args = {
    //         user_id: "4449010040510C20375C0000",
    //         fromaddress: "0x25090d091a19cabd722f508776ffc2c44119c24b",                // 18816644630
    //         toaddress: "0xa78928eac28219c7d1b1563e9568ada8bfc7677d",                  // 88888888888
    //         number: "0.0001"                                           // 转账金额，必须是字符串类型的数字格式
    //     }

    //     // 转成交易
    //     return UserService.sendSignedTransaction(args).then(data => {
    //         console.log("转成交易成功>>", JSON.stringify(data))
    //         // 结果 
    //         assert.isObject(data, "转成交易成功");
    //     }).catch(ex=>{
    //         console.log(ex)
    //     });
    // });


    // 测试：token代币转账
    test("test sendSignedTransactionToConstracts()", function () {

        let args = {
            "user_id": "44490100782A0F0C365C0000",
            "contract_address": "0x5821feC54CE3081F61ca863fb57C0602047EaE8c",               // 合约地址
            "fromaddress": "0xa78928eAc28219C7d1B1563E9568AdA8BfC7677d",                    // 购买人 
            "toaddress": "0x25090d091a19CAbD722F508776ffc2c44119C24B",                      // 代币发起人地址
            "number": "1"                                                               // 转账金额，必须是字符串类型的数字格式
        }

        // 转成交易
        return UserService.sendSignedTransactionToConstracts(args).then(data => {
            console.log("转成交易成功>>", JSON.stringify(data))
            // 结果 
            assert.isObject(data, "转成交易成功");
        }).catch(ex => {
            console.log(ex)
        });
    });





});

