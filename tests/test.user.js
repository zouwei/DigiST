const { expect, assert } = require("chai");
const { suite, test, setup, teardown } = require("mocha");
const { RedisCache } = require('../common/redis.class');
const { User } = require("../services/user");
const { UserInfo, Sequelize } = require("../modelservices");

suite('User unit  testing', function () {

    // 用户注册测试
    test("test getCaptcha()", function () {
        // 测试验证码生成
        User.getCaptcha().then(data => {
            // 验证码输出4位字符串，表示测试通过
            assert.lengthOf(data.text, 4);
        });
    });


    // 用户注册测试
    test("test userRegister()", function () {
        /**
         * 功能性测试，跳过发送短信的步骤
         * 1.设定一个假的手机测试号码，直接从数据库中删除（88888888888）
         * 2.伪造一个redis短信消息
         * 3.进行注册
         * 4.验证注册结果
         */

        // Question.findOne({where: {id: 0}}).then((question) => {
        //     expect(question.id).to.equal(0, "question 0 should be existed");
        // });

        let mobile = "88888888888";
        let verifyCode = "1234";

        UserInfo.destroy({ where: { mobile: mobile } }).then(destroy => {
            // 写入redis
            return RedisCache.set("MOBILE:" + mobile, verifyCode, 20);
        }).then(data => {
            // 进行注册
            return User.userRegister({
                "mobile": mobile,                  //手机号码
                "verifyCode": verifyCode,          //手机验证码
            });
        }).then(data => {
            // 注册结果

            console.log('注册结果', data);
            assert.isObject(data);


        }).catch(ex => {
            console.log(ex);
        })




    });


});