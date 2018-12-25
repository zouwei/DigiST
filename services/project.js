const { RedisCache } = require('../common/redis.class');
const { CharacterHelper } = require("../common/characterHelper");
const idgen = require('../common/generateid');
// 加密模块
const { RSASecurity } = require('../common/security');
// ORM对象模块
const { ProjectFollow } = require("../modelservices");


/**
 * 用户参与的项目信息
 */
class ProjectService {

    // 查询用户关注的项目
    static getUserFollwProject(args) {

    }


    // 查询用户投资的项目(状态查询、)
    static getUserInvestmentProject(args) {

    }


    // 查询用户投资项目详情
    static getUserInvestmentProjectDetail(args) {

    }






}

module.exports = { ProjectService };