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


/**
 * 根据助记词导入用户钱包
 * @param {JSON} args 
 * {
 *      "user_id":"",               // 用户id
 *      "mnemonic":""               // 助记词
 * }
 */
module.exports.importWalletByMnemonic = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.mnemonic || body.mnemonic == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少mnemonic参数", configSpace.systemName, '请求失败');
    }

    return UserService.importWalletByMnemonic(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}

/**
  * 根据keystore+密码导入用户钱包
  * @param {JSON} args 
  * {
  *      "user_id":"",                  // 用户id
  *      "keystore":"",                 // keystore
  *      "password":""                  // 密码
  * }
  */
module.exports.importWalletByKeystore = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.keystore || body.keystore == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少keystore参数", configSpace.systemName, '请求失败');
    }
    if (!body.password || body.password == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少password参数", configSpace.systemName, '请求失败');
    }

    return UserService.importWalletByKeystore(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        console.log(ex)
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}

/**
 * 导出keystore（需要根据支付密码设置）
 * @param {*} args 
 * {
 *      "user_id":"",
 *      "pay_password":"",          // 支付密码
 * }
 */
module.exports.exportWalletKeystore = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.pay_password || body.pay_password == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少pay_password参数", configSpace.systemName, '请求失败');
    }

    return UserService.exportWalletKeystore(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        console.log(ex)
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}


// 查询用户交易记录列表
module.exports.getUserTradeList = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.where) {
        return ctx.body = ResultCode.returnResult('1', "缺少where条件查询参数结构", configSpace.systemName, '请求失败');
    }

    if (!body.where.user_id || body.where.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少where.user_id参数", configSpace.systemName, '请求失败');
    }


    return UserService.getUserTradeList(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        console.log(ex)
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}


// 以太币转账
module.exports.sendSignedTransaction = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.fromaddress || body.fromaddress == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少fromaddress参数", configSpace.systemName, '请求失败');
    }
    if (!body.toaddress || body.toaddress == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少toaddress参数", configSpace.systemName, '请求失败');
    }
    if (!body.number || body.number == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少number参数", configSpace.systemName, '请求失败');
    }

    return UserService.sendSignedTransaction(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        console.log(ex)
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}


module.exports.getTokenBalance = (ctx) => {
    let body = ctx.body;
    return UserService.getTokenBalance(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        console.log(ex)
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });


}

// 代币转账
module.exports.sendSignedTransactionToConstracts = (ctx) => {

    // 参数验证
    let body = ctx.body;
    // 验证参数
    if (!body.user_id || body.user_id == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少user_id参数", configSpace.systemName, '请求失败');
    }
    if (!body.contract_address || body.contract_address == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少contract_address参数", configSpace.systemName, '请求失败');
    }
    if (!body.fromaddress || body.fromaddress == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少fromaddress参数", configSpace.systemName, '请求失败');
    }
    if (!body.toaddress || body.toaddress == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少toaddress参数", configSpace.systemName, '请求失败');
    }
    if (!body.number || body.number == "") {
        return ctx.body = ResultCode.returnResult('1', "缺少number参数", configSpace.systemName, '请求失败');
    }

    return UserService.sendSignedTransactionToConstracts(body).then(data => {
        return ctx.body = ResultCode.success(data, configSpace.systemName, '请求成功');
    }).catch(ex => {
        console.log(ex)
        return ctx.body = ResultCode.returnResult('1', ex.message, configSpace.systemName, '请求失败');
    });
}

