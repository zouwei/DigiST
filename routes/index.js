let koa = require("koa");
let session = require("koa-session");         //注意这里的引入，一定要用improt from的姿势，不能用require的方法，不然会报错……
//通过koa创建一个应用程序
let app = new koa();
let koaBody = require("koa-body")
// 跨域
let cors = require('koa-cors');
app.use(cors());


// let static = require("koa-static")
// let path = require("path")
// let views = require("koa-views")



//针对文件上传的时候，可以解析多个字段
app.use(koaBody({ multipart: true }));

app.use(async (ctx, next) => {
    ctx.body = ctx.request.body;        //`Request Body: ${JSON.stringify(ctx.request.body)}`;

    console.log(`${ctx.method} ${ctx.url} ..........`)
    await next()
});

app.keys = ['some secret hurr'];
// session
app.use(session({
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
}, app));


// //注册静态文件的库到中间件
// app.use(static(path.join(__dirname, "static")))
// //注册模板引擎的库到中间件
// app.use(views(path.join(__dirname, "views"), {
//     extension: "ejs", map:
//         { html: "ejs" }
// }))
//   app.use(router.routes())

app.use(require("./user").routes())
app.use(require("./fundraising").routes())




module.exports = exports = app;
