const redis = require('redis');
const config = require("config");
const { logger } = require("./logger");

var redisCfg = config.get("global.redis");

let connect_args = {
    host: redisCfg.host,
    port: redisCfg.port
};
if (redisCfg.auth_pass) {
    connect_args.password = redisCfg.auth_pass;
}
var client = redis.createClient(connect_args);

client.on("error", (err) => {
    logger.error("connect to redis failed, e=%s", err);
});

client.on("connect", (err) => {
    if (err) {
        logger.error("connect to redis failed, e=%s", err);
    }
    logger.info("connect to redis successed");
});

// 下面这种写法其实挺傻的，最好使用bluebird或者之类的promisify，直接将方法包装好
class RedisCache {
    static get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, reply) => {
                if (err) { return reject(err); };
                return resolve(reply);
            });
        });
    }

    /**
     *
     * @param {String} key
     * @param {String} value
     * @param {Integer} expire_time 秒
     */
    static set(key, value, expire_time) {
        return new Promise((resolve, reject) => {
            if (expire_time) {
                this.client.set(key, value, "EX", expire_time, (err, reply) => {
                    if (err) { return reject(err); }
                    return resolve(reply);
                });
            } else {
                this.client.set(key, value, (err, reply) => {
                    if (err) { return reject(err); }
                    return resolve(reply);
                });
            }
        });
    }

    static del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (err, reply) => {
                if (err) { return reject(err); }
                return resolve(reply);
            });
        });
    }

    static incr(key) {
        return new Promise((resolve, reject) => {
            this.client.incr(key, (err, reply) => {
                if (err) { return reject(err); }
                return resolve(reply);
            });
        });
    }

    static expire(key, expire_time) {
        return new Promise((resolve, reject) => {
            this.client.expire(key, expire_time, (err, reply) => {
                if (err) { return reject(err); }
                return resolve(reply);
            });
        });
    }
}

RedisCache.client = client;

module.exports = { RedisCache };
