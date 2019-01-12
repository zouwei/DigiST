const { Fundraising } = require("./dst_fundraising.service");
const { Invest } = require("./dst_invest.service");
const { ProjectFollow } = require("./dst_project_follow.service");
const { ProjectLog } = require("./dst_project_log.service");
const { UserInfo } = require("./dst_user_info.service");
const { Wallet } = require("./dst_wallet.model.service");
const { Trade } = require("./dst_trade.model.service");

module.exports = { Fundraising, Invest, ProjectFollow, ProjectLog, UserInfo, Wallet,Trade };



/*

```
考虑了一些，感觉还是使用以下组件来完成：

1. path-to-regexp 这个是express内嵌的路由解析，使用正则，跟以前的使用习惯一致。
2. express 同类比较的就是http-proxy，后者是相当于自己转发了请求；虽然它实现的比较多，但如果后续需要自定义请求的逻辑，我觉得还是自己把控比较好。

整体的流程如下：

client (register) --> identity --> acl[ rate limit ] --> match url --> proxy(scheduler algorithm) --> logging

client (需要单独开发，提供出去，分前后端两种？)

还有几点需要确定：

1. 路由规划
2. 协议定义（jwt, header?)

```

*/

class Client {
    constructor(app_id, auth) {
        this.app_id = app_id;
        this.auth = auth;
    }

    static identity(req) {
    }
}

class HostManager {
    /**
     * hosts {
     *  host,
     *  weight,
     *  is_down
     * }
     */

    constructor(host_list) {
        this.host_list = host_list;
    }

    static getHost() {

    }
}

class ProxyConfig {
    constructor(url_pattern, hosts, url) {
        this.url_pattern = url_pattern;
        this.hosts = hosts;
        this.url = url;
    }

    loadConfig() {

    }

    matchConfig() {
        // 匹配的效率问题（线性排序是可以的）

    }
}

class Logger {

}

class BaseRequester {

}

class HttpRequester {

}
