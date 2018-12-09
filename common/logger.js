const log4js = require("log4js");
const path = require("path");
log4js.configure(path.join(__dirname, "../config/logging.json"));

module.exports = {
    logger: log4js.getLogger(), // 默认的日志记录
    aLogger: log4js.getLogger("apis"),
    dLogger: log4js.getLogger("debug"), // 仅用于debug信息
    eLogger: log4js.getLogger("oops"), // 用于关键的错误地方
    log4js
};
