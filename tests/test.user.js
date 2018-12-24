const { expect, assert } = require("chai");
const { suite, test, setup, teardown } = require("mocha");
const { RedisCache } = require('../common/redis.class');
const { User } = require("../services/user");
const { UserInfo, Sequelize } = require("../modelservices");

suite('User unit  testing', function () {

    // 测试验证码生成
    test("test getCaptcha()", function () {
        // 测试验证码生成
        User.getCaptcha().then(data => {
            // 验证码输出4位字符串，表示测试通过
            assert.lengthOf(data.text, 4);
        });
    });


    // 测试用户注册
    test("test userRegister()", function () {
        /**
         * 功能性测试，跳过发送短信的步骤
         * 1.设定一个假的手机测试号码，直接从数据库中删除（88888888888）
         * 2.伪造一个redis短信消息
         * 3.进行注册
         * 4.验证注册结果
         */

        let mobile = "88888888888";
        let verifyCode = "1234";

        UserInfo.destroy({ where: { mobile: mobile } }).then(destroy => {
            // 写入redis
            return RedisCache.set("MOBILE:" + mobile, verifyCode, 20);
        }).then(data => {
            // 进行注册
            return User.userRegister({
                "mobile": mobile,                       // 手机号码
                "password": "12345678",                 // 登录密码
                "verifyCode": verifyCode,               // 手机验证码
            });
        }).then(data => {
            // 注册结果  
            assert.isObject(data, "测试用户注册，成功");
        }).catch(ex => {
            console.log(ex);
        });
    });

    // 测试找回密码
    test("test retrievePassword()", function () {
        let mobile = "78888888888";
        let verifyCode = "1234";

        return RedisCache.set("MOBILE:" + mobile, verifyCode, 20).then(data => {
            // 进行注册
            return User.retrievePassword({
                "mobile": mobile,                       //手机号码
                "password": "12345678",                 // 登录密码
                "verifyCode": verifyCode,               //手机验证码
            });
        }).then(data => {
            // 修改密码结果 
            assert.isObject(data, "测试找回密码，成功");
        }).catch(ex => {
            console.log(ex);
        });
    });

    // 用户登录测试
    test("test userLogin()", function () {
        let mobile = "78888888888";

        // 用户登录
        User.userLogin({ "mobile": mobile, "password": "12345678" }).then(data => {
            assert.isObject(data, "登录验证成功")
        }).catch(ex => {
            assert.isObject(null, ex.message);
        });
    });

    // 测试修改登录密码
    test("test changePassword()", function () {
        // 修改密码
        return User.changePassword({
            "user_id": "49440100583A36F61E5C0000",       //用户id
            "old_password": "12345678",                  // 登录密码
            "new_password": "12345678",                  //手机验证码
        }).then(data => {
            // 修改密码结果 
            assert.isObject(data, "测试修改登录密码，成功");
        }).catch(ex => {
            console.log(ex);
        });
    })

    // 测试修改支付密码
    test("test changePayPassword()", function () {
        // 修改密码
        return User.changePayPassword({
            "user_id": "49440100583A36F61E5C0000",           //用户id
            "old_pay_password": "12345678",                 // 登录密码
            "new_pay_password": "12345678",                  //手机验证码
        }).then(data => {console.log(data)
            // 修改密码结果 
            assert.isObject(data, "测试修改支付密码，成功");
        }).catch(ex => {
            console.log(ex);
        });
    })

});

