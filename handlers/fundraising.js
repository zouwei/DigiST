
const config = require('config');
const configSpace = config.get('global.space');
const ResultCode = require('../common/result.code');
const { FundraisingService } = require('../services/fundraising');

// 发起募资
module.exports.initiateFundraising = (ctx) => {
    // 参数
    let body = ctx.body;     // ctx.body;
    console.log("output args>>", body);
    // // 验证参数
    // if (!body.mobile || body.mobile == "") {
    //     return ctx.body = ResultCode.returnResult('1', "请输入正确的手机号", configSpace.systemName, '请求失败');
    // }


    // 发起募资
    return FundraisingService.initiateFundraising(body).then(data => {
        // 返回结果
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });

}


// 一键发币
module.exports.publishToken = (ctx) => {
    // 参数
    let body = ctx.body;     // ctx.body;
    console.log("output args>>", body);
    // 验证参数
    if (!body.id || body.id == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入项目id参数", configSpace.systemName, '请求失败');
    }
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入user_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.address || body.address == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入address参数", configSpace.systemName, '请求失败');
    }

    // 募资列表查询
    return FundraisingService.publishToken(body).then(data => {
        // 返回结果
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });

}

// 募资列表查询
module.exports.getFundraisingList = (ctx) => {
    // 参数
    let body = ctx.body;     // ctx.body;
    console.log("output args>>", body);
    // // 验证参数
    // if (!body.mobile || body.mobile == "") {
    //     return ctx.body = ResultCode.returnResult('1', "请输入正确的手机号", configSpace.systemName, '请求失败');
    // }


    // 募资列表查询
    return FundraisingService.getFundraisingList(body).then(data => {
        // 返回结果
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });

}


// 募资项目详情信息查询
module.exports.getFundraisingDetail = (ctx) => {
    // 参数
    let body = ctx.params;     // ctx.body;
    console.log("output args>>", body);
    // // 验证参数
    // if (!body.mobile || body.mobile == "") {
    //     return ctx.body = ResultCode.returnResult('1', "请输入正确的手机号", configSpace.systemName, '请求失败');
    // }


    // 募资项目详情信息查询
    return FundraisingService.getFundraisingDetail(body).then(data => {
        // 返回结果
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });

}

