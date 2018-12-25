/**
 * 
 */
const config = require('config')
const configSpace = config.get('global.space')
const { UserService } = require('../services/user')

/**
 * 图形验证码
 */
module.exports.getCaptcha = (req, res) => {
    // 参数
    let p = req.body;
    // 验证参数
    if (!p.telephone || p.telephone == "") {
        return res.status(200).json(ResultCode.returnResult('1', "请输入正确的手机号", configSpace.systemName, '请求失败'));
    }
    // if (!p.graphVerifyCode || p.graphVerifyCode == "") {
    //     return res.status(200).json(ResultCode.returnResult('1', "请输入正确的图形验证码", configSpace.systemName, '请求失败'));
    // }

    // 发送短信验证码
    return UserService.getCaptcha(p).then((svgcaptcha) => {
        // session缓存方案
        req.session.captcha = svgcaptcha.text;
        // 输出给前端
        // res.set('Content-Type', 'image/svg+xml');
        res.type('svg');
        res.send(svgcaptcha.data);
    }).catch((ex) => {
        // 出现错误，可以给一个默认图片（标识出错误提示，SVG的格式）
        res.end("");
    });

}



/**
 * 发送短信验证码
 */
module.exports.sendVerificationCode = (req, res) => {
    // 参数
    let body = req.body;
    // 验证参数
    if (!p.telephone || p.telephone == "") {
        return res.status(200).json(ResultCode.returnResult('1', "请输入正确的手机号", configSpace.systemName, '请求失败'));
    }
    // if (!p.graphVerifyCode || p.graphVerifyCode == "") {
    //     return res.status(200).json(ResultCode.returnResult('1', "请输入正确的图形验证码", configSpace.systemName, '请求失败'));
    // }

    // 图形验证码
    body.captcha = req.session.captcha;     // 图形验证码的key值

    // 发送短信验证码
    return UserService.sendVerificationCode(body).then(data => {
        // 短信验证码发送成功
        return res.status(200).json(ResultCode.success(data, configSpace.systemName, '请求成功'));
    }).catch(ex => {
        return res.status(200).json(ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败'));
    });

}

/**
 * 用户注册
 */
module.exports.userRegister = (req, res) => {

    // 参数验证
    let body = req.body;
    // 验证参数
    if (!body.mobile || body.mobile == "") {
        return res.status(200).json(ResultCode.returnResult('1', "请输入正确的手机号", configSpace.systemName, '请求失败'));
    }
    if (!body.verifyCode || body.verifyCode == "") {
        return res.status(200).json(ResultCode.returnResult('1', "请输入正确的手机号验证码", configSpace.systemName, '请求失败'));
    }


    // 用户注册
    return UserService.userRegister(body).then(data => {
        return res.status(200).json(ResultCode.success(data, configSpace.systemName, '请求成功'));
    }).catch(ex => {
        return res.status(200).json(ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败'));
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
module.exports.retrievePassword = (req, res) => {

    // 参数验证
    let body = req.body;
    // 验证参数
    if (!body.mobile || body.mobile == "") {
        return res.status(200).json(ResultCode.returnResult('1', "请输入正确的手机号", configSpace.systemName, '请求失败'));
    }
    if (!body.verifyCode || body.verifyCode == "") {
        return res.status(200).json(ResultCode.returnResult('1', "请输入正确的手机号验证码", configSpace.systemName, '请求失败'));
    }
    if (!body.password || body.password == "") {
        return res.status(200).json(ResultCode.returnResult('1', "请输入密码", configSpace.systemName, '请求失败'));
    }

    // 用户注册
    return UserService.retrievePassword(body).then(data => {
        return res.status(200).json(ResultCode.success(data, configSpace.systemName, '请求成功'));
    }).catch(ex => {
        return res.status(200).json(ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败'));
    });

}

/**
 * 用户登录
 * {
 *      "mobile":"88888888888",         // 登录手机号码
 *      "password":""
 * } 
 */
module.exports.userLogin = (req, res) => {

    // 参数验证
    let body = req.body;
    // 验证参数
    if (!body.mobile || body.mobile == "") {
        return res.status(200).json(ResultCode.returnResult('1', "请输入正确的手机号", configSpace.systemName, '请求失败'));
    }
    if (!body.password || body.password == "") {
        return res.status(200).json(ResultCode.returnResult('1', "请输入密码", configSpace.systemName, '请求失败'));
    }

    // 用户注册
    return UserService.userLogin(body).then(data => {
        return res.status(200).json(ResultCode.success(data, configSpace.systemName, '请求成功'));
    }).catch(ex => {
        return res.status(200).json(ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败'));
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
module.exports.changePassword = (req, res) => {

    // 参数验证
    let body = req.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return res.status(200).json(ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败'));
    }
    if (!body.new_password || body.new_password == "") {
        return res.status(200).json(ResultCode.returnResult('1', "请输入新密码", configSpace.systemName, '请求失败'));
    }

    // 用户注册
    return UserService.changePassword(body).then(data => {
        return res.status(200).json(ResultCode.success(data, configSpace.systemName, '请求成功'));
    }).catch(ex => {
        return res.status(200).json(ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败'));
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
module.exports.changePayPassword = (req, res) => {

    // 参数验证
    let body = req.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return res.status(200).json(ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败'));
    }
    if (!body.new_password || body.new_password == "") {
        return res.status(200).json(ResultCode.returnResult('1', "请输入支付密码", configSpace.systemName, '请求失败'));
    }

    // 用户注册
    return UserService.changePayPassword(body).then(data => {
        return res.status(200).json(ResultCode.success(data, configSpace.systemName, '请求成功'));
    }).catch(ex => {
        return res.status(200).json(ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败'));
    });
}




