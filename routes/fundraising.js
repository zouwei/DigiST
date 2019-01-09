
var router = require('koa-router')({ "prefix": "/ws_digist/fundraising" });

var fundraisingHandler = require('../handlers/fundraising');

// 发起募资
router.post('/initiateFundraising', fundraisingHandler.initiateFundraising);

// 募资列表查询
router.post('/getFundraisingList', fundraisingHandler.getFundraisingList);

// 募资项目详情信息查询
router.get('/getFundraisingDetail/:id', fundraisingHandler.getFundraisingDetail);





module.exports = exports = router
