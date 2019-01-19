
const config = require('config');
const configSpace = config.get('global.space');
const ResultCode = require('../common/result.code');
const { ProjectService } = require('../services/project');


// module.exports.

/**
 * 用户添加/解除关注
 * @param {JSON} args 
 * {
 *      "user_id":"",               // 用户id
 *      "fundraising_id":"",            // 募资项目id
 *      "action":"ADD"              // 动作（ADD表示关注、DELETE表示解除关注）
 * }
 */
module.exports.userFollowProject = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.fundraising_id || body.fundraising_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少fundraising_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.action || body.action == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少actionfromaddress参数", configSpace.systemName, '请求失败');
    }
    return ProjectService.userFollowProject(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        console.log(ex)
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}


module.exports.getUserFollowProject = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.fundraising_id || body.fundraising_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少fundraising_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.action || body.action == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少actionfromaddress参数", configSpace.systemName, '请求失败');
    }
    return ProjectService.getUserFollowProject(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        console.log(ex)
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}


module.exports.getUserInvestmentProject = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.fundraising_id || body.fundraising_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少fundraising_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.action || body.action == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少actionfromaddress参数", configSpace.systemName, '请求失败');
    }
    return ProjectService.getUserInvestmentProject(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        console.log(ex)
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}

/**
 * 查询用户投资项目详情
 * @param {JSON} args 
 * {
 *      "id":""
 * }
 */
module.exports.getUserInvestmentProjectDetail = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.id || body.id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少id参数", configSpace.systemName, '请求失败');
    }

    return ProjectService.getUserInvestmentProjectDetail(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        console.log(ex)
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}