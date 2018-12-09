const request = require("request");
const {logger} = require("./logger");
const config = require("config");

function delay (delay_time) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay_time);
    });
}

class BaseRequester {
    constructor (name, host, defaultHeaders) {
        this.name = name;
        this.host = host;
        this.defaultHeaders = defaultHeaders || {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        };
    }
    /**
     * 一个通用的请求类
     * @param {string} method  {post|get|put|delete|patch}
     * @param {string} url
     * @param {Object} options {headers: {}, body: {}, json: {}}
     */
    request (method, url, options) {
        console.log('入参2', options);
        if (!options.headers) {
            options.headers = this.defaultHeaders;
        }
        if (options.timeout === undefined) {
            options.timeout = 1000 * 10; // 没有设置超时的默认给10秒
        }
        let retry_count = options.retry_count || 0;
        console.log('retry_count', retry_count);
        if (retry_count > 0) {
            return this.constructor.doRequestWithRetry(method, url, options, retry_count);
        } else {
            return this.constructor.doRequest(method, url, options);
        }
    }

    get (url, options) {
        return this.request("get", url, options);
    }

    post (url, options) {
        return this.request("post", url, options);
    }

    delete (url, options) {
        return this.request("delete", url, options);
    }

    put (url, options) {
        return this.request("put", url, options);
    }

    patch (url, options) {
        return this.request("patch", url, options);
    }

    static doRequest (method, url, options) {
        return new Promise(function (resolve, reject) {
            request[method](url, options, function (err, res, body) {
                if (err) {
                    logger.error("[%s] %s Failed, error=%s: %s, options=%j", method, url, err.name, err.message, options);
                    reject(err);
                } else {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(body);
                    } else {
                        logger.error("[%s] %s return code=%s, options=%j", method, url, res.statusCode, options);
                        reject(body);
                    }
                }
            });
        });
    }

    static doRequestWithRetry (method, url, options, retry_count) {
        var self = this;
        return this.doRequest(method, url, options).catch(function (err) {
            if (err.message.indexOf("ECONNREFUSED") != -1) {
                if (retry_count <= 0) {
                    logger.error("[%s] %s Failed, max retries reached", method, url);
                    throw err;
                } else {
                    return delay(1000).then(() => {
                        return self.doRequestWithRetry(method, url, options, retry_count - 1);
                    });
                }
            } else {
                throw err;
            }
        });
    }
}

class APIManageRequester extends BaseRequester {
    addConfig (config) {
        let url = this.host + "/configs/";
        return this.post(url, {json: config});
    }

    removeConfig (config_id) {
        let url = this.host + "/configs/" + config_id;
        return this.delete(url);
    }

    updateConfig (config_id, update_info) {
        let url = this.host + "/configs/" + config_id;
        return this.put(url, {json: update_info});
    }

    addPerms (config_id, app_key, perm_string) {
        perm_string = perm_string || "A";
        let url = this.host + "/perms/";
        let data = {
            config_id, app_key, perm_string
        };
        return this.post(url, {json: data});
    }

    addConfigWithPerms (config, app_key) {
        var self = this;
        return this.addConfig(config).then(result => {
            let config_id = result.data.entity.id;
            return self.addPerms(config_id, app_key);
        });
    }
}

// let host = "http://api.airiskeys.com";
// let host = "http://api.anyitech.ltd";

let air = new APIManageRequester("api-gateway", config.get("global.apigateway.host"), {
    "manage-token": "w8vVB3Xcd6EWFjn5",
    "Content-Type": "application/json"
});

module.exports = {air};
