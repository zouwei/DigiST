const { expect, assert } = require("chai");
const { suite, test, setup, teardown } = require("mocha");
const { RedisCache } = require('../common/redis.class');
const { FundraisingService } = require("../services/fundraising");
const { Sequelize } = require("../modelservices");

suite('Fundraising unit testing', function () {

    // 募资：发起募资项目
    test("test initiateFundraising()", function () {
        // 定义参数
        let p = {
            "user_id": "49440100583A36F61E5C0000",
            "company_name": "霸得蛮有限公司",                    // 公司名称
            "project_name": "活着就是搞事情",                    // 项目名称
            "company_description": "这是一家善于搞事情的公司",    // 公司介绍
            "corporate": "老王",                                 // 公司法人名称
            "company_contact": "18888888888",                     // 公司联系方式
            "company_emergency_contact": "1899999999",           //公司紧急联系方式
            "pledged_stock": 20,                                 // 质押股票比例（百分比）
            "project_description": "这是个很牛的项目，轻轻松进账几分钱。",       // 项目简介
            "project_file": "dee123454612353245134523423",    // 项目文件
            "project_scale": 0,                       // 筹集规模（货币单位：分）
            "equity_income": 10,                      // 股权收益权（单位：百分比） 
            "project_token": "MANA/TRUE",             // 项目代币
            "investment_period": "3Y",                // 投资年限:3Y（最后一位表示日期单位：Y、M、D，分别表示年、月、日）
            "minimum_subscription": 1000,             // 最低认购数量
        }
        FundraisingService.initiateFundraising(p).then(data => {
            // 验证码输出4位字符串，表示测试通过 
            assert.isObject(data, "发起募资项目（成功）");
        });
    });

    // 募资：募资列表查询（状态查询）
    test("test getFundraisingList()", function () {

        let p = {
            where: {
                // "project_status": "closed"
                "project_status": {
                    $in: ["closed"]
                }
            }
        };
        // 查询列表
        FundraisingService.getFundraisingList(p).then(data => {
            console.log("查询结果>>>", data.recordsTotal);
            assert.isObject(data, "募资列表查询（成功）");
        });
    });


    // 募资：募资项目详情信息查询
    test("test getFundraisingDetail()", function () {
        FundraisingService.getFundraisingDetail({ id: "5553010010546D03225C0000" }).then(data => {
            console.log("查询结果>>>", data);
            assert.isObject(data, "募资列表查询（成功）");
        });
    });


});