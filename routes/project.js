
var router = require('koa-router')({ "prefix": "/ws_digist/project" });

var projectHandler = require('../handlers/project');

// 用户添加/解除关注
router.post('/userFollowProject', projectHandler.userFollowProject);
// 查询用户关注的项目列表
router.post('/getUserFollowProject', projectHandler.getUserFollowProject);

// 查询投资项目详情
router.post('/getUserInvestmentProjectDetail', projectHandler.getUserInvestmentProjectDetail);
// 查询用户投资的项目
router.post('/getUserInvestmentProject', projectHandler.getUserInvestmentProject);

module.exports = exports = router
