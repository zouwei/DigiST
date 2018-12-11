const express = require("express");
// const bodyParser = require("body-parser");
// const cookieParser = require('cookie-parser');

var app = express();

/**
 * 这里只配置URL，不写具体的函数
 */

// app.use(bodyParser.json({type: "application/*+json"}));
// app.use(bodyParser.text());
// app.use(bodyParser.urlencoded({extended: false}));

app.use("/ws_service/user", require("./user"));

module.exports = exports = app;
