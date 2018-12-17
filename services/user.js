const svgCaptcha = require('svg-captcha');
const { sms_requester } = require('../common/sms_sdk');
const { RedisCache } = require('../common/redis.class');
const { CharacterHelper } = require("../common/characterHelper");
const idgen = require('../common/generateid');
// ORM对象模块
const { DstUserInfo } = require("../modelservices");

// 用户密码采用RAS加密，暂时写死
const PASSWORDCERTCONFIG = {
    "public_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArtnXQm0EU+ZVOqia01+o4zDAkPCCa81nxQ/IypxmjrjRjdeZ+/BMfEI4GX3ElKEasbRh8k0fKHGb9zI6soDFtYTN6fa/kaYK/1ci+a88cOe5yTI3H4D2ETygu8Pm/S2nFzdH8GiUyt/0uvF6uCDOZUkN8FzGwYSfH4K/Cdi6YMfOS2HLMiVwZVA9/5LF5CpPRWeCg0mnnOvoPkr7Xx8Aahmdo+265lpXTb2vhz/Fm1HhKhZwfRsU8og9vllVoKTZds5TkPHGQMnkBk/6axikQbhMswAVcqpVXw1lxm396ernYMO+5xqzwQnt1tKxisYMWgOsEvsJo6QWZeB1S2M4UQIDAQAB",
    "private_key": "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCu2ddCbQRT5lU6qJrTX6jjMMCQ8IJrzWfFD8jKnGaOuNGN15n78Ex8QjgZfcSUoRqxtGHyTR8ocZv3MjqygMW1hM3p9r+Rpgr/VyL5rzxw57nJMjcfgPYRPKC7w+b9LacXN0fwaJTK3/S68Xq4IM5lSQ3wXMbBhJ8fgr8J2Lpgx85LYcsyJXBlUD3/ksXkKk9FZ4KDSaec6+g+SvtfHwBqGZ2j7brmWldNva+HP8WbUeEqFnB9GxTyiD2+WVWgpNl2zlOQ8cZAyeQGT/prGKRBuEyzABVyqlVfDWXGbf3p6udgw77nGrPBCe3W0rGKxgxaA6wS+wmjpBZl4HVLYzhRAgMBAAECggEBAJBLbf1/ggbLGqLh6YNuei2jWgdCtB7K0EwsDoRGNcyqcSUhPA5R7IzPCQTgaY5OtXzZY8tWIdR6jT+e0Bnnc0Gta1EdNFK6OHEoM9Dh8HssgIGtUxhIkMkAw5SwwrtFJZNfJ5sac1BJKensxl2VlT643yvxJIUnMToL6CP0Gzspy7fE8jGvmmhJV4w0TtSz5ATwKH8TBI1BMc44U+DpIpHgYrcu2YEq6Ax4H2jDqZ1l6W1m4+q1nXEfNf/IgTuF6vRCqk7zN8HcNPc3kiScSuYcHY+qdQRY4cp4/oaHOfIaswxjjCMjqhNzeJxIgVZmCC8QntweAb5M2dLgCnawgAECgYEA1iB7crniW1P0Nvg16TN+l6sJkM29rmOvJP4uyr/zk5Nxf7Rot/t98XTFLnghs2H0TLBtl/zmQFraDhzXaxQca4typMKh9Zt88lkKwOpOL8Ocx5zs/HCairb8JsuoEBZz8PjNHO12XiRDSFuJZbh+Lv4OmD0+0TglSzbjkZsralECgYEA0QslKF2/IlwSgmk/6tQjqFayoIHI7BnzcApZCETB34+y5/7/8YR3cEhpnQ65aM1QchhgrxEUDkn0jBGtOzSg78FMlKatPTSSE2tI2nmVpt0BxZf/Czro98JaUxuws8ncwzbWbKBydTKbwwAGHMbd5olpsuRPWAmT7EL94vS5bgECgYB5hCWKjgLvYU2OhH3Twe1tlRrwmlGyzc9vZvCXDyfj8CDRIEjtYEOw61uba4F0k3pYqycGwfbJPsXQjH2Tvu4B+jktV2ciQwM9ZVq88Ds+z/wBLAUxnZWWcxHV0m2l85gIgKmmaPxroJiuT4RBvdmeQX921gr4IKzJanTrBOw2gQKBgHI6yN85+wvnjCW/JbJIogOG/K1Avm5l7+S1gtlF2Ts05upnKazsWef9adjtBtwB9YejUpHXn0H/n6Y6spK7u4XH9vTz746Wf4wk//aCoghAlItI95FHa66XgYwQgYp9MClsedd6BZGNShhQlwZ6lR84z411vPW6ph5grSOr3vgBAoGBALPWPaWMYxjJI/4+PmYn0VxzzbMOfRukXU6SsVd84/62BcCqhnV23n2aRrwIh4I7GIeS52LniLEYAUzpzWAvQbflnqfxtp+M9z1PBI2AXvIv65XqlysCk0yp10AcYIvONKmmc9G3RzOjJvlVYknn7XukmHvMGd8fWl59E3Kob89P";
}




/**
 * 用户模块
 */
class User {



    /**
     * 生成图片验证码
     * @param {JSON} args 
     * {
     *      "captcha_key":""        // 图形验证码的key值，由前端生成一个唯一id值（uuid即可）
     * }
     */
    static getCaptcha(args) {
        // 图形验证码（普通验证码）
        let option = {
            "ignoreChars": "0o1i",           // 排除字符
            "noise": 0,                     // 干扰线的数量
            "color": true,                  // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
            // "background":"cc9966",          // 图片是否有背景颜色
            // width: 100,
            // height: 42,
            // fontSize: 42
        };
        // 创建图形
        let svgcaptcha = svgCaptcha.create(option);

        // 创建算数式验证码
        // let svgcaptcha = captcha.createMathExpr();

        // // 验证码的值存入redis（可以用session缓存验证码的值）
        // redis.set(captche, args.captcha_key.toLowerCase(), 600).then(() => {
        //     return Promise.resolve(svgcaptcha);
        // }).catch(() => {
        //     return Promise.reject(new Error("生成验证码出现错误"));
        // });


        return Promise.resolve(svgCaptcha);

    };

    /**
     * 发送短信验证码
     * 注意：暂时未写限制发送短信的限制逻辑，存在风险
     * @param {JSON} args 
     * {
     *      "mobile":"" ,                   // 手机号码
     *      "graphVerifyCode":""            // 图形验证码，如果用图形验证码，必传 captcha
     * }
     */
    static sendVerificationCode(args) {

        // 图形验证码验证
        let verifyGraphCode = (graphVerifyCode) => {

            // 验证码处理（过滤可能出现歧义的字符，推荐在发送验证码的时候处理）

            if (!args.captcha || args.captcha == "")
                return Promise.reject(new Error("图形验证码已失效"));

            // 验证码
            if (graphVerifyCode == args.captcha) {
                // RedisCache.del(captche);        // 验证码通过之后，可注销掉redis缓存的验证码（但是需要前端及时刷新）
                return Promise.resolve(captcha);
            } else {
                return Promise.reject(new Error("图形验证码错误，请重新输入"));
            }

            // // 需要验证图形验证码（key值）
            // let captcha = args.captcha;

            // // 取值图形验证码的值（redis方案）
            // return RedisCache.get(captcha)
            //     .then(_graphCode => {
            //         if (!_graphCode)
            //             return Promise.reject(new Error("图形验证码失效，请刷新图像验证码"));

            //         // 验证码
            //         if (graphVerifyCode == _graphCode) {
            //             // RedisCache.del(captcha);        // 验证码通过之后，可注销掉redis缓存的验证码（但是需要前端及时刷新）
            //             return Promise.resolve(captcha);
            //         } else {
            //             return Promise.reject(new Error("图形验证码错误，请重新输入"));
            //         }

            //     }).catch(() => {
            //         return Promise.reject(new Error("校验图形验证码出现异常"));
            //     });

        };

        // 数字验证码
        let code = CharacterHelper.randomNumber(4);
        let sms_content = { "phones": args.mobile, "content": `您好，您的手机验证码为：${code}，有效期3分钟，请勿将验证码泄露给任何人。` };

        // 缓存数据
        return RedisCache.get("MOBILE:" + mobile).then(data => {
            // 发送短信验证码
            return sms_requester.send(sms_content, {})
        }).then(data => {
            // 发送成功
            return Promise.resolve("短信验证码发送成功");
        });


        // // 带图形验证码校验的版本
        // return verifyGraphCode(args.graphVerifyCode).then(() => {
        //     // 缓存验证码
        //     return RedisCache.get("MOBILE:" + args.mobile, code);
        // }).then(data => {
        //     // 发送短信验证码
        //     return sms_requester.send(sms_content, {});
        // }).then(() => {
        //     // 验证通过删除验证码
        //     return Promise.resolve("短信验证码发送成功");
        // });
    }


    /**
     * 用户注册
     * @param {JSON} args 
     * {
     *    "mobile":"",                  //手机号码
     *    "verifyCode":"1234",          //手机验证码
     * }
     */
    userRegister(args) {
        // 验证码验证
        let verifyCode = (verifyCode, mobile) => {

            // 获取验证码并且进行验证
            return RedisCache.get("MOBILE:" + mobile).then(data => {
                if (data == verifyCode) {
                    // 手机验证通过
                    return Promise.resolve(true);
                } else {
                    return Promise.reject(new Error("验证码不正确"));
                }
            }).catch(ex => {
                console.log('异常错误', ex);
                return Promise.reject(new Error("检索验证码时出现异常"));
            });

        };

        // 用户注册流程
        return verifyCode(p.verifyCode, p.telephone).then(() => {
            // 手机号码验证通过，注册（要先验证手机号码是否存在）
            let user_info = {
                id: idgen.getID("ID"),
                mobile: args.phones,
                password: "",            // 无密码
                pay_password: "",
                name: "",
                remark: "",
                created_time: new Date(),
                created_id: "",
                update_time: new Date(),
                update_id: "",
                valid: 1,
            }
            // 写入数据库
            return DstUserInfo.insert(user_info);
        }).then(data => {
            // 新增完成
            return Promise.resolve(data);
        });

    }




    /**
     * 找回密码
     * @param {JSON} args 
     * {
     *   "mobile":"",               // 手机号码
     *   "verifyCode":"1234",       // 手机验证码
     *   "password":""              // 密码
     * }
     */
    retrievePassword(args) {

    }

}

module.exports = { User }