const svgCaptcha = require('svg-captcha');
const { sms_requester } = require('../common/sms_sdk');
const { RedisCache } = require('../common/redis.class');
const { CharacterHelper } = require("../common/characterHelper");
const idgen = require('../common/generateid');
// 加密模块
const { RSASecurity } = require('../common/security');
// ORM对象模块
var { UserInfo, Wallet, Trade, Fundraising, Invest } = require("../modelservices");
const config = require('config')
const PASSWORDCERTCONFIG = config.get('global.dataEncryption');
// web3钱包
const { WalletWeb3 } = require("./wallet.web3");

// 用户密码采用RAS加密，暂时写死(发布版本需要迁移到配置环境中)

/**
 * 用户模块
 */
class UserService {



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


        return Promise.resolve(svgcaptcha);

    };

    /**
     * 发送短信验证码
     * 注意：暂时未写限制发送短信的限制逻辑，存在风险
     * @param {JSON} args 
     * {
     *      "mobile":"" ,                   // 手机号码
     *      "graphVerifyCode":"",           // 图形验证码，如果用图形验证码，必传 captcha
     *      "verifyUser":true               // 【可选参数】验证用户：ture表示用户存在才发送短信，false表示用户不存在再发送短信；参数不存在则表示不验证用户
     * }
     */
    static sendVerificationCode(args) {
        // 过渡方案，去掉验证手机号码的正确性
        return Promise.resolve("短信验证码发送成功");

        // 验证用户
        let verifyUser = (verifyUser, mobile) => {
            if (args.hasOwnProperty('verifyUser') && args.verifyUser) {
                // 验证用户再发送短信
                return UserInfo.findOne({ where: { mobile: args.mobile } }).then(userInfo => {
                    if (userInfo) // 需要验证  
                        return Promise.reject(new Error("当前手机号码已经存在"));
                    else
                        return Promise.resolve(true);
                }).catch(ex => {
                    return Promise.resolve(new Error(ex.message));
                });
            } else {
                return Promise.resolve(true);       // 不验证用户直接发送短信
            }

        }

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
        return RedisCache.get("MOBILE:" + args.mobile).then(data => {
            // 发送短信验证码
            return sms_requester.send(sms_content, {});
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
     *    "password":"",                // 登录密码
     *    "verifyCode":"1234",          //手机验证码
     * }
     */
    static userRegister(args) {
        // 验证码验证
        let verifyCode = (verifyCode, mobile) => {
            // 过渡方案，去掉验证手机号码的正确性
            return Promise.resolve(true);

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
        return verifyCode(args.verifyCode, args.mobile).then(() => {
            // 手机号码验证通过，注册（要先验证手机号码是否存在）
            let user_info = {
                id: idgen.getID("DIGIST"),
                mobile: args.mobile,
                password: args.password ? RSASecurity.encrypt(args.password, PASSWORDCERTCONFIG.public_key, "base64") : "",            // 随机密码
                pay_password: "",
                name: args.mobile.substr(0, 3) + '****' + args.mobile.substr(7),        // 隐藏了手机号码中间四位
                is_mobile_auth: 1,      //是否手机认证:1表示已认证、0表示未认证
                email: "",        // 邮箱
                is_email_auth: 0, //是否邮箱认证：1表示已认证、0表示未认证
                idcard: "",   // 身份证
                is_idcard_auth: 0,    // 是否身份证认证:1表示已认证、0表示未认证
                second_auth_info: "{}",       // 第二级认证信息
                is_second_auth: 0,    // '是否第二级认证信息：1表示已认证、0表示未认证',
                third_auth_info: "{}",        // 第三级认证信息
                is_third_auth: 0,     // 是否第三级认证：1表示已认证、0表示未认证
                remark: "",
                created_time: new Date(),
                created_id: "",
                update_time: new Date(),
                update_id: "",
                valid: 1,
            }

            // 写入数据库
            return UserInfo.create(user_info);
        }).then(data => {
            // 新增完成
            return Promise.resolve({
                "user_id": data.id,
                "name": data.name,
                "is_mobile_auth": data.is_mobile_auth,
                "is_email_auth": data.is_email_auth,
                "is_idcard_auth": data.is_idcard_auth,
                "is_second_auth": data.is_second_auth,
                "is_third_auth": data.is_third_auth,
                "created_time": data.created_time
            });
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
    static retrievePassword(args) {

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
        return verifyCode(args.verifyCode, args.mobile).then(() => {
            // 查询用户
            return UserInfo.findOne({ where: { mobile: args.mobile } });
        }).then((userInfo) => {
            // 手机号码验证通过，注册（要先验证手机号码是否存在） 
            if (userInfo) {
                // 验证密码是否正确
                let password = RSASecurity.encrypt(args.password, PASSWORDCERTCONFIG.public_key, "base64");
                // 修改用户信息
                return UserInfo.update({
                    "password": password
                }, {
                        "where": {
                            "mobile": args.mobile
                        }
                    }).then((data) => {
                        // 返回信息
                        return Promise.resolve({
                            "user_id": userInfo.id,
                            "name": userInfo.name,
                            "mobile": userInfo.mobile,
                            "is_mobile_auth": userInfo.is_mobile_auth,
                            "is_email_auth": userInfo.is_email_auth,
                            "is_idcard_auth": userInfo.is_idcard_auth,
                            "is_second_auth": userInfo.is_second_auth,
                            "is_third_auth": userInfo.is_third_auth
                        });
                    });
            } else {
                return Promise.reject(new Error(`登录用户不存在`));
            }
        });







    }

    /**
     * 用户登录
     * @param {JSON} args 
     * {
     *      "mobile":"88888888888",         // 登录手机号码
     *      "password":""
     * }
     */
    static userLogin(args) {
        // 根据用户名&密码查询记录
        return UserInfo.findOne({ where: { mobile: args.mobile } }).then(userInfo => {
            if (userInfo) {
                // 验证密码是否正确
                let password = RSASecurity.decrypt(userInfo.password, PASSWORDCERTCONFIG.private_key);
                if (args.password !== password) {
                    return Promise.reject(new Error(`登录密码不正确`));
                } else {
                    return Promise.resolve({
                        "user_id": userInfo.id,
                        "name": userInfo.name,
                        "mobile": userInfo.mobile,
                        "isSetPassword": userInfo.password == "" ? false : true,
                        "isSetPayPassword": userInfo.pay_password == "" ? false : true,
                        "is_mobile_auth": userInfo.is_mobile_auth,
                        "is_email_auth": userInfo.is_email_auth,
                        "is_idcard_auth": userInfo.is_idcard_auth,
                        "is_second_auth": userInfo.is_second_auth,
                        "is_third_auth": userInfo.is_third_auth
                    });
                }
            } else {
                return Promise.reject(new Error(`登录用户不存在`));
            }
        });


    }



    // 修改登录密码（首次密码设置）

    /**
     * 修改密码
     * @param {JSON} args 
     * {
     *   "user_id":"",                   // 用户id
     *   "old_password":"12345678",      // 手机验证码
     *   "new_password":"12345678"       // 密码
     * }
     */
    static changePassword(args) {
        // 修改密码
        return UserInfo.findOne({ where: { id: args.user_id } }).then((userInfo) => {
            // 手机号码验证通过，注册（要先验证手机号码是否存在） 
            if (userInfo) {

                // 检查是否为第一次设置密码（第一次设置密码可以不用传值旧密码）
                if (userInfo.password !== "") {
                    // 直接修改密码 
                    // 需要验证密码是否正确
                    let password = RSASecurity.decrypt(userInfo.password, PASSWORDCERTCONFIG.private_key);
                    if (args.old_password !== password) {
                        // 旧密码不正确
                        return Promise.reject(new Error("旧密码不正确"));
                    }
                }

                // 新密码加密
                let new_password = RSASecurity.encrypt(args.new_password, PASSWORDCERTCONFIG.public_key, "base64");

                // 修改用户密码信息
                return UserInfo.update({
                    "password": new_password
                }, {
                        "where": { "id": args.user_id }
                    }).then((data) => {
                        // 返回信息
                        return Promise.resolve({
                            "user_id": userInfo.id,
                            "name": userInfo.name,
                            "mobile": userInfo.mobile,
                            "isSetPassword": true,
                            "isSetPayPassword": userInfo.pay_password == "" ? false : true,
                            "is_mobile_auth": userInfo.is_mobile_auth,
                            "is_email_auth": userInfo.is_email_auth,
                            "is_idcard_auth": userInfo.is_idcard_auth,
                            "is_second_auth": userInfo.is_second_auth,
                            "is_third_auth": userInfo.is_third_auth
                        });
                    });
            } else {
                return Promise.reject(new Error(`用户不存在`));
            }
        });
    }

    /**
     *  修改支付密码（首次设置直接设置支付密码）
     * @param {JSON} args 
     * {
     *   "user_id":"",                       // 用户id
     *   "old_pay_password":"12345678",      // 手机验证码
     *   "new_pay_password":"12345678"       // 密码
     * }
     */
    static changePayPassword(args) {
        // 修改密码
        return UserInfo.findOne({ where: { id: args.user_id } }).then((userInfo) => {
            // 手机号码验证通过，注册（要先验证手机号码是否存在） 
            if (userInfo) {

                // 检查是否为第一次设置密码（第一次设置密码可以不用传值旧密码）
                if (userInfo.pay_password !== "") {
                    // 直接修改密码 
                    // 需要验证密码是否正确
                    let pay_password = RSASecurity.decrypt(userInfo.pay_password, PASSWORDCERTCONFIG.private_key);
                    if (args.old_pay_password !== pay_password) {
                        // 旧密码不正确
                        return Promise.reject(new Error("旧密码不正确"));
                    }
                }

                // 新支付密码加密
                let new_pay_password = RSASecurity.encrypt(args.new_pay_password, PASSWORDCERTCONFIG.public_key, "base64");

                // 修改用户支付密码
                return UserInfo.update({
                    "pay_password": new_pay_password
                }, {
                        "where": { "id": args.user_id }
                    }).then((data) => {
                        // 返回信息
                        return Promise.resolve({
                            "user_id": userInfo.id,
                            "name": userInfo.name,
                            "mobile": userInfo.mobile,
                            "isSetPassword": true,
                            "isSetPayPassword": true,
                            "is_mobile_auth": userInfo.is_mobile_auth,
                            "is_email_auth": userInfo.is_email_auth,
                            "is_idcard_auth": userInfo.is_idcard_auth,
                            "is_second_auth": userInfo.is_second_auth,
                            "is_third_auth": userInfo.is_third_auth
                        });
                    });
            } else {
                return Promise.reject(new Error(`用户不存在`));
            }
        });
    }


    /**
     * 待开发接口
     * 1.钱包
     * 1.1钱包列表
     * 1.1钱包导入（官方、私钥）
     * 
     * 2.身份认证
     * 2.1一级认证
     * 2.2二级认证
     * 2.3三级认证
     * 2.4邮箱认证
     * 
     * 3.统计
     * 3.1投资投机
     * 3.2募资统计
     * 
     * 
     */




    /**
     * 查询用户钱包
     * @param {JSON} args 
     */
    static getUserWallet(args) {
        // 根据用户id查询用户钱包
        return Wallet.findOne({ where: { "user_id": args.user_id } }).then((walletInfo) => {
            // 直接返回钱包信息，如果没有创建则返回为null
            if (walletInfo)
                return Promise.resolve({
                    "id": walletInfo.id,
                    "address": walletInfo.address
                });
            else
                return Promise.resolve(null)
            // 如果钱包信息存在，（钱包余额怎么查询呢？）
        });
    }


    /**
     * 查询用户余额
     * @param {JSON} args 
     * {
     *      "user_id":"",               // 用户id
     *      "address":"",               // 地址
     *      "defaultBlock":"",          // (可选)如果传递此值，则不会使用web3.eth.defaultBlock设置默认快
     *      "unit":""                   // 余额单位：默认ether
     * }
     */
    static getUserWalletBalance(args) {

        // 根据用户id查询用户钱包
        return Wallet.findOne({ where: { "user_id": args.user_id, "address": args.address } }).then((walletInfo) => {
            // 直接返回钱包信息，如果没有创建则返回为null
            if (walletInfo)
                return WalletWeb3.getBalance(args);
            else
                return Promise.reject(new Error("未查询到钱包账户，请检查用户id与钱包地址的正确性"));
            // 如果钱包信息存在，（钱包余额怎么查询呢？）
        });
    }



    /**
     * 创建用户钱包
     * @param {JSON} args 
     */
    static createUserWallet(args) {

        // 验证钱包信息，如果用户已经创建过了钱包则不能创建了

        return Wallet.findOne({ where: { "user_id": args.user_id } }).then((walletInfo) => {
            // 检查钱包是否存在
            if (walletInfo) {
                return Promise.reject(new Error("当前不允许创建多钱包账户"));
            }
            // 钱包账户
            let walletAccount;
            // 创建钱包
            return WalletWeb3.createWallet().then(data => {
                walletAccount = data;
                console.log("钱包>>>", JSON.stringify(data));
                // 需要对钱包信息加密再创建钱包
                walletInfo = {
                    id: idgen.getID("DIGIST"),
                    user_id: args.user_id,
                    address: walletAccount.address,
                    mnemonic: RSASecurity.encrypt(walletAccount.mnemonic, PASSWORDCERTCONFIG.public_key, "base64"),  //助记词（数据加密）',
                    privateKey: RSASecurity.encrypt(walletAccount.privateKey, PASSWORDCERTCONFIG.public_key, "base64"), //私钥（数据加密）',
                    balance: 0,          //余额，仅做数据展示',
                    remark: "",
                    created_time: new Date(),
                    created_id: "",
                    update_time: new Date(),
                    update_id: "",
                    valid: 1,
                }
                // 创建钱包
                return Wallet.create(walletInfo);
            }).then(data => {
                // data是钱包账户信息
                return Promise.resolve({
                    "id": walletInfo.id,
                    "address": walletAccount.address,
                    "mnemonic": walletAccount.mnemonic
                });
            })
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
    static importWalletByMnemonic(args) {
        // 验证钱包信息，如果用户已经创建过了钱包则不能创建了

        return Wallet.findOne({ where: { "user_id": args.user_id } }).then((walletInfo) => {
            // 检查钱包是否存在
            if (walletInfo) {
                return Promise.reject(new Error("当前不允许导入多钱包账户"));
            }

            // 根据助记词获取默克尔树根的私钥
            let privateKey = WalletWeb3.importWalletMnemonic(args.mnemonic, "m/44'/60'/0'/0/0");
            console.log("钱包私钥>>>", privateKey);
            // 解锁账户
            let walletAccount = WalletWeb3.unlockWallet({ privateKey: privateKey });

            console.log("钱包>>>", JSON.stringify(walletAccount));
            // 需要对钱包信息加密再创建钱包
            walletInfo = {
                id: idgen.getID("DIGIST"),
                user_id: args.user_id,
                address: walletAccount.address,
                mnemonic: RSASecurity.encrypt(args.mnemonic, PASSWORDCERTCONFIG.public_key, "base64"),  //助记词（数据加密）',
                privateKey: RSASecurity.encrypt(walletAccount.privateKey, PASSWORDCERTCONFIG.public_key, "base64"), //私钥（数据加密）',
                balance: 0,                 //余额，仅做数据展示',
                remark: "",
                created_time: new Date(),
                created_id: "",
                update_time: new Date(),
                update_id: "",
                valid: 1,
            }
            // 创建钱包
            return Wallet.create(walletInfo).then(data => {
                // data是钱包账户信息
                return Promise.resolve({
                    "id": walletInfo.id,
                    "address": walletAccount.address,
                    "mnemonic": walletAccount.mnemonic
                });
            })
        });

    }

    /**
     * 根据keystore+密码导入用户钱包
     * @param {JSON} args 
     * {
     *      "user_id":"",               // 用户id
     *      "keystore":"",               // keystore
     *      "password":""
     * }
     */
    static importWalletByKeystore(args) {
        // 验证钱包信息，如果用户已经创建过了钱包则不能创建了

        console.log("参数>>>", JSON.stringify(args));

        return Wallet.findOne({ where: { "user_id": args.user_id } }).then((walletInfo) => {
            // 检查钱包是否存在
            if (walletInfo) {
                return Promise.reject(new Error("当前不允许导入多钱包账户"));
            }

            // // 根据助记词获取默克尔树根的私钥
            // let privateKey = WalletWeb3.importWalletMnemonic(args.mnemonic, "m/44'/60'/0'/0/0");
            // console.log("钱包私钥>>>", privateKey);
            console.log("参数2>>>", JSON.stringify(args));

            // 解锁账户
            let walletAccount = WalletWeb3.unlockWallet({ keystore: args.keystore, password: args.password });

            console.log("钱包>>>", JSON.stringify(walletAccount));
            // 需要对钱包信息加密再创建钱包
            walletInfo = {
                id: idgen.getID("DIGIST"),
                user_id: args.user_id,
                address: walletAccount.address,
                mnemonic: "",  //助记词（数据加密）',
                privateKey: RSASecurity.encrypt(walletAccount.privateKey, PASSWORDCERTCONFIG.public_key, "base64"), //私钥（数据加密）',
                balance: 0,                 //余额，仅做数据展示',
                remark: "",
                created_time: new Date(),
                created_id: "",
                update_time: new Date(),
                update_id: "",
                valid: 1,
            }
            // 创建钱包
            return Wallet.create(walletInfo).then(data => {
                // data是钱包账户信息
                return Promise.resolve({
                    "id": walletInfo.id,
                    "address": walletAccount.address,
                    "mnemonic": walletAccount.mnemonic
                });
            })
        });

    }

    /**
     * 导出keystore（需要根据支付密码设置）
     * @param {*} args 
     * {
     *      "user_id":"",               // 用户id
     *      "pay_password":"",          // 支付密码
     *      "address":""                // 钱包地址，这里没有根据用户查钱包地址，可能存在业务扩展为多钱包账户
     * }
     */
    static exportWalletKeystore(args) {

        // 验证钱包地址是否属于当前用户
        let verifyWalletAddress = () => {
            // 查询钱包信息
            return Wallet.findOne({ where: { user_id: args.user_id, address: args.address } }).then(wallet_info => {
                if (!wallet_info)
                    return Promise.reject(new Error(`当前钱包地址不属于当前用户`));
                // 返回钱包信息
                return Promise.resolve(wallet_info);

            })
        };

        // 验证用户 
        let user_info;
        return UserInfo.findOne({ where: { id: args.user_id } }).then(data => {
            user_info = data;
            return verifyWalletAddress();
        }).then(wallet_info => {
            // 钱包信息 
            // 用户信息不存在
            if (!user_info)
                return Promise.reject(new Error(`用户不存在`));
            // 检查是否设置了支付密码
            if (user_info.pay_password === "")
                return Promise.reject(new Error(`您当前账户还未设置支付密码，请设置支付密码之后再操作`));
            // 需要验证密码是否正确
            let pay_password = RSASecurity.decrypt(user_info.pay_password, PASSWORDCERTCONFIG.private_key);
            if (args.pay_password !== pay_password)
                return Promise.reject(new Error("验证支付密码错误"));
            // 导出keystore
            let privateKey = RSASecurity.decrypt(wallet_info.privateKey, PASSWORDCERTCONFIG.private_key);
            console.log('解密私钥>>', privateKey);
            let account = WalletWeb3.encryptWalletKeystore(privateKey, args.pay_password);
            console.log("钱包>>>", JSON.stringify(account));

            return Promise.resolve(account);
        });
    }




    /**
     * 发送交易
     * @param {JSON} args 
     * {
     *      "user_id":"",           // 用户id
     *      "fromaddress":"",       // 用户钱包地址
     *      "toaddress":"",         // 转账目标地址
     *      "number":"0.001"        // 转账金额
     * }
     */
    static sendSignedTransaction(args) {

        // let { fromaddress, toaddress, number } = args;
        // 验证钱包地址是否属于当前用户
        let verifyWalletAddress = () => {
            // 查询钱包信息
            return Wallet.findOne({ where: { user_id: args.user_id, address: args.fromaddress } }).then(wallet_info => {
                if (!wallet_info)
                    return Promise.reject(new Error(`当前钱包地址不属于当前用户`));
                // 返回钱包信息
                return Promise.resolve(wallet_info);
            });
        };


        let wallet_info;
        // 验证用户钱包
        return verifyWalletAddress().then(data => {
            wallet_info = data;
            // 私钥
            let privatekey = RSASecurity.decrypt(wallet_info.privateKey, PASSWORDCERTCONFIG.private_key);

            console.log('发送签名交易参数>>', JSON.stringify(args));
            // web3发送签名交易
            return WalletWeb3.sendSignedTransaction({
                "privatekey": privatekey,
                "fromaddress": args.fromaddress,
                "toaddress": args.toaddress,
                "number": args.number
            });
        }).then(tx => {
            // 写入交易记录
            console.log('交易之后的临时变量>>', JSON.stringify(args));

            let entity = {
                id: idgen.getID("DIGIST"),
                user_id: wallet_info.user_id,
                wallet_id: wallet_info.id,                  // 钱包id 
                transfer_amount: args.number,               // 转账金额，字符串格式
                block_hash: tx.blockHash,
                block_number: tx.blockNumber,
                contract_address: tx.contractAddress,
                cumulative_gas_used: tx.cumulativeGasUsed,
                fromaddress: tx.from,
                gas_used: tx.gasUsed,
                status: tx.status,
                toaddress: tx.to,
                transaction_hash: tx.transactionHash,
                transaction_index: tx.transactionIndex,
                remark: "",
                created_time: new Date(),
                created_id: "",
                update_time: new Date(),
                update_id: "",
                valid: 1,
            }
            // 创建钱包
            return Trade.create(entity);
        }).then(trade_info => {
            return Promise.resolve({
                "id": trade_info.id,
                "transaction_hash": trade_info.transaction_hash
            });
        }).catch(ex => {
            console.log(ex);
            return Promise.reject(ex);
        });
    }

    /**
     * 查询代币余额
     * @param {JOSN} args 
     * {
     *      "user_id":"",                       // 用户id
     *      "fromaddress":"",                   // 查询账户地址
     *      "contract_address":""               // 合约地址
     * }
     */
    static getTokenBalance(args) {

        // 验证钱包地址是否属于当前用户
        let verifyWalletAddress = () => {
            // 查询钱包信息
            return Wallet.findOne({ where: { user_id: args.user_id, address: args.fromaddress } }).then(wallet_info => {
                if (!wallet_info)
                    return Promise.reject(new Error(`当前钱包地址不属于当前用户`));
                // 返回钱包信息
                return Promise.resolve(wallet_info);
            });
        };

        // 查询余额
        return verifyWalletAddress().then(() => {
            return WalletWeb3.getTokenBalance(args);
        })


    }


    /**
     * 合约转账
     * 投资投资
     * @param {JSON} args 
     *   {
     *       "user_id":"44490100782A0F0C365C0000",	
     *       "contract_address":"0xA49D6ac4aDEAEfA6a951A3c91d75B80A03cA4ddc",
     *       "fromaddress":"0xa78928eAc28219C7d1B1563E9568AdA8BfC7677d", 
     *       "number": "1" 
     *   }
     */
    static sendSignedTransactionToConstracts(args) {

        // 验证钱包地址是否属于当前用户
        let verifyWalletAddress = () => {
            // 查询钱包信息
            return Wallet.findOne({ where: { user_id: args.user_id, address: args.fromaddress } }).then(wallet_info => {
                if (!wallet_info)
                    return Promise.reject(new Error(`当前钱包地址不属于当前用户`));
                // 返回钱包信息
                return Promise.resolve(wallet_info);
            });
        };
        // 验证合约地址
        let verifyFundraising = () => {
            return Fundraising.findOne({ where: { contract_address: args.contract_address } }).then(fundraising_info => {
                if (!fundraising_info)
                    return Promise.reject(new Error(`未查询到相关的合约项目`));
                // 返回钱包信息
                return Promise.resolve(fundraising_info);
            });
        }
        // 验证投资项目
        let verifyInvest = (user_id, fundraising_id) => {
            // 查询钱包信息
            return Invest.findOne({ where: { user_id: user_id, fundraising_id: fundraising_id } }).then(invest_info => {
                // 返回投资项目信息
                return Promise.resolve(invest_info);
            });
        };
        // 更新投资项目
        let updateInvestInfo = (fundraising_info, invest_info) => {
            // 交易信息
            if (invest_info) {
                // 需要更新的信息
                invest_info.subscription_quantity += parseFloat(args.number);
                invest_info.buying_times += 1;
                // 更新
                return Invest.update({
                    "subscription_quantity": invest_info.subscription_quantity,
                    "buying_times": invest_info.buying_times,
                    "update_time": new Date()
                }, {
                        "where": { "id": invest_info.id }
                    }).then(() => {
                        // 返回信息
                        return Promise.resolve(invest_info);
                    });
            } else {
                // 新增
                let entity = {
                    id: idgen.getID("DIGIST"),
                    user_id: args.user_id,
                    fundraising_id: fundraising_info.id,
                    project_name: fundraising_info.project_name,
                    subscription_quantity: args.number,
                    project_status: "已投资",
                    buying_times: 1,
                    contract_address: fundraising_info.contract_address,
                    remark: "",
                    created_time: new Date(),
                    created_id: args.user_id,
                    update_time: new Date(),
                    update_id: args.user_id,
                    valid: 1,
                }
                return Invest.create(entity).then(() => {
                    return Promise.resolve(entity);
                })
            }

        }
        // 更新募资项目
        let updateFundraisingInfo = (fundraising_info) => {
            // 需要更新的信息
            fundraising_info.subscribed_quantity += parseFloat(args.number);
            fundraising_info.subscribed_frequency += 1;
            // 更新
            return Fundraising.update({
                "subscribed_quantity": fundraising_info.subscribed_quantity,
                "subscribed_frequency": fundraising_info.subscribed_frequency,
                "update_time": new Date()
            }, {
                    "where": { "id": fundraising_info.id }
                }).then(() => {
                    // 返回信息
                    return Promise.resolve(fundraising_info);
                }); 
        }


        /*
            1.验证当前合约地址是否投资过了
            2.转账投资
            3.如果没有则写入投资记录
            4.如果有记录则修改记录
            5.写入交易记录

        */

        let wallet_info;
        let fundraising_info;
        let invest_info;
        let trade_info;        // 交易记录
        // 验证用户钱包
        return verifyWalletAddress().then(data => {
            // 钱包信息
            wallet_info = data;
            // 验证合约地址
            return verifyFundraising();
        }).then(data => {
            // 投资项目
            fundraising_info = data;
            // 验证投资项目
            return verifyInvest(args.user_id, fundraising_info.id);
        }).then((data) => {
            // 我的投资项目
            invest_info = data;
            // 通过之后进行转账
            // 私钥
            let privatekey = RSASecurity.decrypt(wallet_info.privateKey, PASSWORDCERTCONFIG.private_key);

            console.log('发送签名交易参数>>', JSON.stringify(args));
            // web3发送签名交易
            return WalletWeb3.sendSignedTransaction({
                "privatekey": privatekey,
                "fromaddress": args.fromaddress,
                "toaddress": args.contract_address,
                "number": args.number
            });
        }).then(tx => {
            // 交易记录 
            // 写入交易记录
            console.log('交易之后的临时变量>>', JSON.stringify(tx));
            // 交易记录
            trade_info = {
                id: idgen.getID("DIGIST"),
                user_id: wallet_info.user_id,
                wallet_id: wallet_info.id,                  // 钱包id 
                transfer_amount: args.number,               // 转账金额，字符串格式
                block_hash: tx.blockHash,
                block_number: tx.blockNumber,
                contract_address: args.contractAddress,           // 合约地址需要从入参指定
                cumulative_gas_used: tx.cumulativeGasUsed,
                fromaddress: tx.from,
                gas_used: tx.gasUsed,
                status: tx.status,
                toaddress: tx.to,
                transaction_hash: tx.transactionHash,
                transaction_index: tx.transactionIndex,
                remark: "",
                created_time: new Date(),
                created_id: args.user_id,
                update_time: new Date(),
                update_id: args.user_id,
                valid: 1,
            }
            // 创建钱包
            return Trade.create(trade_info);
        }).then(() => {
            // 更新或者写入投资项目记录
            return updateInvestInfo(fundraising_info, invest_info);
        }).then(() => {
            // 更新募资项目信息
            return updateFundraisingInfo(fundraising_info);
        }).then(() => {
            // 返回交易记录
            return Promise.resolve({
                "id": trade_info.id,
                "transaction_hash": trade_info.transaction_hash
            });
        }).catch(ex => {
            console.log(ex);
            return Promise.reject(ex);
        });
    }

    /**
     * 查询用户交易列表
     * @param {JSON} args 
     * {
     *      "where":{},                                 // 条件查询
     *      "order":[['created_time', 'DESC']],         // 排序条件，
     *      "pageIndex":1,                              // 页码从1开始
     *      "pageSize":10                               // 分页大小
     * }
     */
    static getUserTradeList(args) {

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

        return Trade.findAndCountAll(p).then(data => {
            // 返回 
            return Promise.resolve({
                "recordsTotal": data.count,
                "data": data.rows
            });
        });
    }

    /**
     * 【ok】查询用户钱包
     * 【ok】创建钱包（备份助记词）
     * 【ok】导入钱包（keystore方式、私钥方式）
     *  转账
     * 查询交易记录（直接查询数据表）
     * 
     * 统计分析
     */



}

module.exports = { UserService };