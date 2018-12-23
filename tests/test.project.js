const { expect, assert } = require("chai");
const { suite, test, setup, teardown } = require("mocha");
const { RedisCache } = require('../common/redis.class');
const { User } = require("../services/user");
const { UserInfo, Sequelize } = require("../modelservices");

suite('Fundraising unit testing', function () {

    // 用户注册测试
    test("test function()", function () {
        // 测试验证码生成
        User.getCaptcha().then(data => {
            // 验证码输出4位字符串，表示测试通过
            assert.lengthOf(data.text, 4);
        });
    });

 


});