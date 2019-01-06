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



module.exports = exports = router
