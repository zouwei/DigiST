const { expect, assert } = require("chai");
const { suite, test, setup, teardown } = require("mocha");
const { RedisCache } = require('../common/redis.class');
const { ProjectService } = require("../services/project");
const { Sequelize } = require("../modelservices");

suite('ProjectService unit testing', function () {

    // 项目：测试用户关注项目
    test("test userFollowProject() 关注操作", function () {
        // 定义参数
        let p = {
            "action": "ADD",
            "user_id": "49440100583A36F61E5C0000",
            "project_id": "555301005C316A04225C0000"
        }
        ProjectService.userFollowProject(p).then(data => {
            assert.isObject(data, "关注项目（成功）");
        });
    });

    // 项目：测试用户取消关注项目
    test("test userFollowProject() 取消关注操作", function () {
        // 定义参数
        let p = {
            "action": "DELETE",
            "user_id": "49440100583A36F61E5C0000",
            "project_id": "555301005C316A04225C0000"
        }
        ProjectService.userFollowProject(p).then(data => {
            console.log("取消关注项目结果", data);
            assert.isNumber(data, "取消关注项目（成功）");
        });
    });



    // 项目：投资（未完成的接口）
    test("test userInvestProject()", function () {


        let p = {
            "user_id": "49440100583A36F61E5C0000",
            "fundraising_id": "555301000C119D03225C0000",
            "subscription_quantity": 1000
        }


        ProjectService.userInvestProject(p).then(data => {
            // console.log("投资项目结果", data);
            assert.isObject(data, "投资项目结果（成功）");
        });

    });

    // 项目：查询用户关注的项目
    test("test getUserFollowProject()", function () {
        ProjectService.getUserFollowProject({
            where:
                { "user_id": "5553010010546D03225C0000" }
        }).then(data => {
            assert.isObject(data, "查询用户关注的项目（成功）");
        });
    });


    // 项目： 查询用户投资的项目
    test("test getUserInvestmentProject()", function () {
        ProjectService.getUserInvestmentProject({
            where: {
                user_id: "49440100583A36F61E5C0000"
            }
        }).then(data => {
            // console.log(JSON.stringify(data));
            assert.isObject(data, "查询用户投资的项目（成功）");
        });
    });

    // 项目：查询用户投资项目详情
    test("test getUserInvestmentProjectDetail()", function () {
        ProjectService.getUserInvestmentProjectDetail({ id: "444901003C0C0B41235C0100" }).then(data => {
            console.log(JSON.stringify(data));
            assert.isObject(data, "查询用户投资项目详情（成功）");
        });
    });

});