// const express = require('express')
// const bodyParser = require('body-parser')
// var router = express.Router()
// var userHandler = require('../handlers/user');


// router.use(bodyParser.json())
// router.use(bodyParser.urlencoded({ extended: false }))

// // 获取图形码
// router.post('/getCaptcha', userHandler.getCaptcha);
// // 发送短信验证码
// router.post('/sendVerificationCode', userHandler.sendVerificationCode);
// // 用户注册
// router.post('/userRegister', userHandler.userRegister);
// // 找回密码
// router.post('/retrievePassword', userHandler.retrievePassword);
// // 用户登录
// router.post('/userLogin', userHandler.userLogin);
// // 修改登录密码
// router.post('/changePassword', userHandler.changePassword);
// // 修改支付密码
// router.post('/changePayPassword', userHandler.changePayPassword);




var router = require('koa-router')({ "prefix": "/ws_digist/user" });

var userHandler = require('../handlers/user');


// 获取图形码
router.get('/getCaptcha', userHandler.getCaptcha);
// 发送短信验证码
router.post('/sendVerificationCode', userHandler.sendVerificationCode);
// 用户注册
router.post('/userRegister', userHandler.userRegister);
// 找回密码
router.post('/retrievePassword', userHandler.retrievePassword);
// 用户登录
router.post('/userLogin', userHandler.userLogin);
// 修改登录密码
router.post('/changePassword', userHandler.changePassword);
// 修改支付密码
router.post('/changePayPassword', userHandler.changePayPassword);

// **********************************************************************************
// 查询用户钱包
router.post('/getUserWallet', userHandler.getUserWallet);
// 查询用户以太币账户余额
router.post('/getUserWalletBalance', userHandler.getUserWalletBalance);
// 创建用户钱包
router.post('/createUserWallet', userHandler.createUserWallet);
// 根据助记词导入用户钱包
router.post('/importWalletByMnemonic', userHandler.importWalletByMnemonic);
// 根据keystore+密码导入用户钱包
router.post('/importWalletByKeystore', userHandler.importWalletByKeystore);
// 导出keystore（需要根据支付密码设置）
router.post('/exportWalletKeystore', userHandler.exportWalletKeystore);
// 分页查询用户交易列表
router.post('/getUserTradeList', userHandler.getUserTradeList);
// 以太币转账
router.post('/sendSignedTransaction', userHandler.sendSignedTransaction);
// 代币转账
router.post('/sendSignedTransactionToConstracts', userHandler.sendSignedTransactionToConstracts);
// 代币余额查询
router.post('/getTokenBalance', userHandler.getTokenBalance);


module.exports = exports = router
