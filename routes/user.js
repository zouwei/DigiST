const express = require('express')
const bodyParser = require('body-parser')
var router = express.Router()
var userHandler = require('../handlers/user');


router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))

/**
 * 用户注册
 */
router.post('/userRegister', userHandler.userRegister);

module.exports = exports = router
