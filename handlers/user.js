/**
 * 
 */
const config = require('config');
const configSpace = config.get('global.space');
const ResultCode = require('../common/result.code');
const { UserService } = require('../services/user');

/**
 * 图形验证码
 */
module.exports.getCaptcha = (ctx) => {
    // 发送短信验证码
    return UserService.getCaptcha({}).then((svgcaptcha) => {
        // session缓存方案
        ctx.session.captcha = svgcaptcha.text;
        // 输出给前端
        // res.set('Content-Type', 'image/svg+xml');
        ctx.response.type = 'svg';
        ctx.response.body = svgcaptcha.data;
    }).catch((ex) => {
        // 出现错误，可以给一个默认图片（标识出错误提示，SVG的格式）
        ctx.response.body = ex.message;
    });

}



/**
 * 发送短信验证码
 */
module.exports.sendVerificationCode = (ctx) => {
    // 参数
    let body = ctx.body;     // ctx.body;
    console.log("output args>>", body);
    // 验证参数
    if (!body.mobile || body.mobile == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入正确的手机号", configSpace.systemName, '请求失败');
    }

    // 图形验证码
    body.captcha = ctx.session.captcha;     // 图形验证码的key值

    // 发送短信验证码
    return UserService.sendVerificationCode(body).then(data => {
        // 短信验证码发送成功
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });

}

/**
 * 用户注册
 */
module.exports.userRegister = (ctx) => {

    // 参数验证
    let body = ctx.body;

    // 验证参数
    if (!body.mobile || body.mobile == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入正确的手机号", configSpace.systemName, '请求失败');
    }
    if (!body.verifyCode || body.verifyCode == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入正确的手机号验证码", configSpace.systemName, '请求失败');
    }

    return UserService.userRegister(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });

}

/**
 * 找回密码
 * {
 *   "mobile":"",               // 手机号码
 *   "verifyCode":"1234",       // 手机验证码
 *   "password":""              // 密码
 * }
 */
module.exports.retrievePassword = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.mobile || body.mobile == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入正确的手机号", configSpace.systemName, '请求失败');
    }
    if (!body.verifyCode || body.verifyCode == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入正确的手机号验证码", configSpace.systemName, '请求失败');
    }
    if (!body.password || body.password == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入密码", configSpace.systemName, '请求失败');
    }

    return UserService.retrievePassword(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });

}

/**
 * 用户登录
 * {
 *      "mobile":"88888888888",         // 登录手机号码
 *      "password":""
 * } 
 */
module.exports.userLogin = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.mobile || body.mobile == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入正确的手机号", configSpace.systemName, '请求失败');
    }
    if (!body.password || body.password == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入密码", configSpace.systemName, '请求失败');
    }

    return UserService.userLogin(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}


/**
 * 修改密码
 * {
 *   "user_id":"",                   // 用户id
 *   "old_password":"12345678",      // 旧密码
 *   "new_password":"12345678"       // 新密码
 * }
 */
module.exports.changePassword = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.new_password || body.new_password == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入新密码", configSpace.systemName, '请求失败');
    }

    return UserService.changePassword(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}

/**
 *  修改支付密码（首次设置直接设置支付密码）
 * {
 *   "user_id":"",                       // 用户id
 *   "old_pay_password":"12345678",      // 手机验证码
 *   "new_pay_password":"12345678"       // 密码
 * }
 */
module.exports.changePayPassword = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.new_password || body.new_password == "") {
        return ctx.body = ResultCode.returnResult('1', "请输入支付密码", configSpace.systemName, '请求失败');
    }

    return UserService.changePayPassword(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}

/**
 * 查询用户钱包
 */
module.exports.getUserWallet = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }

    return UserService.getUserWallet(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}

/**
 * 查询用户钱包（包含TOKEN代币）账户余额
 */
module.exports.getUserWalletBalance = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }

    return UserService.getUserWalletBalance(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}

/**
 * 创建用户钱包
 */
module.exports.createUserWallet = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }

    return UserService.createUserWallet(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}



