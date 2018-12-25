const { RedisCache } = require('../common/redis.class');
const { CharacterHelper } = require("../common/characterHelper");
const idgen = require('../common/generateid');
// 加密模块
const { RSASecurity } = require('../common/security');
// ORM对象模块
const { Fundraising } = require("../modelservices");


/**
 * 募资模块
 */
class FundraisingService {

    /**
     * 发起募资项目
     * @param {JSON} args 
     * {
     *      "company_name":"霸得蛮有限公司",                    // 公司名称
     *      "project_name":"活着就是搞事情",                    // 项目名称
     *      "company_description":"这是一家善于搞事情的公司",    // 公司介绍
     *      "corporate":"老王",                                 // 公司法人名称
     *      "company_contact":"18888888888",                     // 公司联系方式
     *      "company_emergency_contact":"1899999999",           //公司紧急联系方式
     *      "pledged_stock":20,                                 // 质押股票比例（百分比）
     *      "project_description":"这是个很牛的项目，轻轻松进账几分钱。",       // 项目简介
     *      "project_file":"dee123454612353245134523423",    // 项目文件
     *      "project_scale":0,                       // 筹集规模（货币单位：分）
     *      "equity_income":10,                      // 股权收益权（单位：百分比） 
     *      "project_token":"MANA/TRUE",             // 项目代币
     *      "investment_period":"3Y",                // 投资年限:3Y（最后一位表示日期单位：Y、M、D，分别表示年、月、日）
     *      "minimum_subscription":1000,             // 最低认购数量
     * }
     */
    static initiateFundraising(args) {
        // 定义
        let entity = {
            id: idgen.getID("USER"),
            user_id: args.user_id,                                      // user_id
            company_name: args.company_name,                            // 公司名称
            company_description: args.company_description,              // 公司介绍
            corporate: args.corporate,                                  // 公司法人名称
            company_contact: args.company_contact,                      // 公司联系方式
            company_emergency_contact: args.company_emergency_contact,  // 公司紧急联系方式
            pledged_stock: args.pledged_stock,                          // 质押股票比例（百分比）
            project_name: args.project_name,                            // 项目名称
            project_description: args.project_description,              // 项目简介
            project_file: args.project_file,                            // 项目文件
            project_val: -1,                                            // 项目估值（货币单位：分）
            currency: args.currency || "CNY",                           // 发行项目估值货币单位：CNY、USD……（参考世界各国货币名称符号大全）
            project_token: args.project_token || "MANA/TRU",            // 项目代币：MANA/TRUE
            project_scale: args.project_scale || -1,                    // 筹集规模（货币单位：分）
            project_mode: args.project_mode || "项目收益权",             // 筹集规模式:项目收益权、
            minimum_subscription: args.minimum_subscription || 1000,    // 最低认购数量
            investment_period: args.investment_period || "3Y",          // 投资年限:3Y（最后一位表示日期单位：Y、M、D，分别表示年、月、日）
            equity_income: args.equity_income,                          // 股权收益权（单位：百分比）
            exit_early: args.exit_early || "无",                        // 提前退出窗口
            project_status: "new",                                      // 项目状态:new、voting、raise、finished、fail、closed
            follow: 0,                                                  // 关注度
            vote_target: 0,                                             // 选票目标
            subscribed_quantity: 0,                                     // 已认购数量
            subscribed_frequency: 0,                                    // 已认购次数
            vote: 0,                                                    // 已获取票数
            remark: "",
            created_time: new Date(),
            created_id: args.user_id,
            update_time: new Date(),
            update_id: args.user_id,
            valid: 1
        }

        // 募资
        return Fundraising.create(entity).then(data => {
            // 返回
            return Promise.resolve(entity);
        });

    }



    // 一键发币
    static publishToken(args) {
        /**
         * 发币分为几个步骤：
         * 1.发布智能合约（上链成功之后写入合约信息）
         * 2.修改募资状态信息
         */


    }


    /**
     * 募资列表查询（状态查询）
     * @param {JSON} args 
     * {
     *      "pageIndex":1,          // 页码从1开始
     *      "pageSize":10           // 分页大小
     * }
     */
    static getFundraisingList(args) {

        // 默认分页
        args.pageSize = args.pageSize || 10;
        args.pageIndex = args.pageIndex || 1;
        // 查询条件
        args.order = args.order || [['created_time', 'DESC']]

        // 查询条件
        let p = {
            where: args.where || {},                        //为空，获取全部，也可以自己添加条件
            offset: (args.pageIndex - 1) * args.pageSize,   //开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
            order: args.order,                              // 排序
            limit: args.pageSize                            //每页限制返回的数据条数
        }

        return Fundraising.findAndCountAll(p).then(data => {
            // 返回 
            return Promise.resolve({
                "recordsTotal": data.count,
                "data": data.rows
            });
        });
    }



    /**
     * 募资项目详情信息查询
     * @param {JSON} args 
     * {
     *      "id":""             // 募资项目id
     * }
     */
    static getFundraisingDetail(args) {

        return Fundraising.findOne({
            where: {
                id: args.id
            }
        }).then(data => {
            // 返回 
            return Promise.resolve(data);
        });
    }



}

module.exports = { FundraisingService };