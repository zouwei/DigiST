const app = require("../routes");
const http = require("http");
const port = require('config').get('global.space.port')
const { logger, log4js } = require("../common/logger");

const server = http.createServer(app);

const closeLog4js = (reason) => {
    log4js.shutdown(() => {
        console.log("app server shutdown: %s", reason);
        process.exit(1);
    });
};

server.on("error", function (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    switch (error.code) {
        case 'EACCES':
            logger.error('requires elevated privileges');
            closeLog4js("server error");
            break;
        case 'EADDRINUSE':
            logger.error('%s is already in use', error.port);
            closeLog4js("server error");
            break;
        default:
            throw error;
    }
});

server.on("close", () => {
    closeLog4js("server close");
});

server.on("listening", function () {
    var addr = server.address();
    logger.info("app started: Listening on %s:%s", addr.address, addr.port);
});

server.listen(port, "0.0.0.0");
