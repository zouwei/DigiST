const { RedisCache } = require('../common/redis.class');
const { CharacterHelper } = require("../common/characterHelper");
const idgen = require('../common/generateid');
// 加密模块
const { RSASecurity } = require('../common/security');
// ORM对象模块
const { Fundraising, ProjectFollow, Invest } = require("../modelservices");


/**
 * 用户参与的项目信息
 */
class ProjectService {

    /**
     * 用户添加/解除关注
     * @param {JSON} args 
     * {
     *      "user_id":"",               // 用户id
     *      "fundraising_id":"",            // 项目id
     *      "action":"ADD"              // 动作（ADD表示关注、DELETE表示解除关注）
     * }
     */
    static userFollowProject(args) {

        // 添加关注
        const addFollow = () => {
            // 定义
            let entity = {
                id: idgen.getID("DIGIST"),
                user_id: args.user_id,                                      // user_id
                fundraising_id: args.fundraising_id,                                // 项目id
                remark: "",
                created_time: new Date(),
                created_id: args.user_id,
                update_time: new Date(),
                update_id: args.user_id,
                valid: 1
            }

            // 添加关注项目
            return ProjectFollow.create(entity).then(data => {
                // 返回
                return Promise.resolve({
                    "id": entity.id,
                    "remark": "项目关注成功"
                });
            });
        }
        // 删除关注
        const deleteFollow = () => {
            // 添加关注项目
            return ProjectFollow.destroy({
                where: {
                    user_id: args.user_id,
                    fundraising_id: args.fundraising_id
                }
            }).then(destroy => {
                // 返回
                return Promise.resolve(destroy);
            });
        }

        // 执行业务逻辑
        if (args.action.toUpperCase() == "ADD")
            return addFollow();
        else
            return deleteFollow();
    }

    /**
     * 查询用户关注的项目
     * @param {JSOn} args 
     */
    static getUserFollowProject(args) {


        // 默认分页
        args.pageSize = args.pageSize || 10;
        args.pageIndex = args.pageIndex || 1;
        // 查询条件
        args.order = args.order || [['created_time', 'DESC']]

        // 查询条件
        let p = {
            where: args.where || {},             //为空，获取全部，也可以自己添加条件
            offset: (args.pageIndex - 1) * args.pageSize,   //开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
            order: args.order,                              // 排序
            limit: args.pageSize                            //每页限制返回的数据条数
        }

        return ProjectFollow.findAndCountAll(p).then(data => {
            // 返回 
            return Promise.resolve({
                "recordsTotal": data.count,
                "data": data.rows
            });
        });
    }


    /**
     * 【重要】投资项目（这个接口已经迁移到user.js了）
     * @param {JSON} args 
     * {
     *      "user_id":"",                           // 用户id
     *      "fundraising_id":"",                    // 募资项目id
     *      "subscription_quantity":1000            // 认购数量
     * }
     */
    static userInvestProject(args) {

        /**
         * 项目投资涉及钱包操作，这部分逻辑先空着
         * 交易确认这个流程还不清楚，这一块先空着
         * 
         */
        const queryFundraisingInfo = () => {
            return Fundraising.findOne({ where: { id: args.fundraising_id } }).then(data => {
                // 募资项目id
                if (data)
                    return Promise.resolve(data);
                else
                    return Promise.reject(new Error("未查询到相关的募资项目"));
            })
        }

        // 新增记录
        const addInvest = (fundraising_info) => {
            // 定义
            let entity = {
                id: idgen.getID("DIGIST"),
                project_name: fundraising_info.project_name,            // 项目名称
                user_id: args.user_id,                                      // user_id
                fundraising_id: args.fundraising_id,                        // 募资项目id
                subscription_quantity: args.subscription_quantity,          // 认购数量
                project_status: "new",
                remark: "",
                created_time: new Date(),
                created_id: args.user_id,
                update_time: new Date(),
                update_id: args.user_id,
                valid: 1
            }

            // 写入投资项目记录
            return Invest.create(entity).then(data => {
                // 返回
                return Promise.resolve(entity);
            });
        }


        return queryFundraisingInfo().then(data => {
            return addInvest(data);
        });


    }

    /**
     * 查询用户投资的项目(状态查询等信息查询)
     * @param {JSON} args 
     * {
     *      "where":{},                                 // 条件查询
     *      "order":[['created_time', 'DESC']],         // 排序条件，
     *      "pageIndex":1,                              // 页码从1开始
     *      "pageSize":10                               // 分页大小
     * }
     */
    static getUserInvestmentProject(args) {
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

        return Invest.findAndCountAll(p).then(data => {
            // 返回 
            return Promise.resolve({
                "recordsTotal": data.count,
                "data": data.rows
            });
        });
    }


    /**
     * 查询用户投资项目详情
     * @param {JSON} args 
     * {
     *      "id":""
     * }
     */
    static getUserInvestmentProjectDetail(args) {
        return Invest.findOne({
            where: {
                id: args.id
            }
        }).then(data => {
            // 返回 
            return Promise.resolve(data);
        });
    }






}

module.exports = { ProjectService };