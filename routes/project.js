
var router = require('koa-router')({ "prefix": "/ws_digist/project" });

var projectHandler = require('../handlers/project');


// 查询投资项目详情
router.post('/getUserInvestmentProjectDetail', projectHandler.getUserInvestmentProjectDetail);



module.exports = exports = router
