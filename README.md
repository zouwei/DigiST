# DigiST

> 采用前后端分离结构，来开发DigiST程序，此项目为DigiST服务端程序。
>
> 方面起见，常用的信息都在此文档中进行描述，包含且不限于项目描述、项目接口文档，项目规范等



| 版本编号 | 版本日期   | 修改者 | 说明                           |
| -------- | ---------- | ------ | ------------------------------ |
| v0.0.5   | 2019-01-12 | 胡邹   | 新增转账接口                   |
| v0.0.4   | 2019-01-10 | 胡邹   | 增加了钱包接口                 |
| v0.0.3   | 2019-01-09 | 胡邹   | 新增部分钱包接口和接口规范定义 |
| v0.0.2   | 2019-01-07 | 胡邹   | 募资接口文档更新               |
| v0.0.1   | 2018-12-24 | 胡邹   | 用户相关的接口描述             |



## 1.项目结构描述

~~~

bin:程序启动项，为了服务器进程管理，改成与服务相同的名称（相当于app.js）
common：此目录放置通用的js helper文件
config：配置文件
doc：开发文档以及程序相关的设计文档统一放到这个doc目录下，README.md可以做软链接，如有有需要的话。
handlers:程序处理层，路由方法实现层，桥接底层services业务逻辑处理层。
models：ORM关系对象模型，映射数据表对象，封装常规的CRUD业务
modelsservices：扩展models的方法，抽象出更加通用的底层业务方法，缓存可以封装在这一层来实现，当然也可以用另外的形式来体现，根据业务需要来编排。
services：业务逻辑层，业务逻辑代码写在这一层。

~~~


## 2.项目启动

~~~

1.配置文件配置，需要连接到数据库
2.安装依赖包文件，npm i
3.启动程序，bin\digist.js
4.检查是否启动正常

~~~





##3.项目接口

项目接口遵循一些基本的规则，在使用的过程中，这些基本的规则是全局通用的，例如：host指定为接口访问的域名（包含端口号）。

本项目为例，本地开发环境的host则为：http://localhost:9980，接口API的路由组成完整的API地址：http://localhost:9980/ws_service/user/getCaptcha

测试环境host：

在实际的测试环境中或者生产环境中只需要替换api的域名部分即可。

**返回参数code值定义**

| 返回参数值 | 说明                                                    |
| ---------- | ------------------------------------------------------- |
| 0          | 表示请求成功                                            |
| 1          | 表示失败，大于0的都非正常状态，不同的值根据业务单独定义 |

###3.1用户API



####3.1.1获取图形码

页面图形验证码，主要作用是防止对一些付费接口的流量攻击，发送短信是有成本的，通过引入图形验证码能在一定程度上预防这种流量攻击。

| 名称   | 值                           |
| ------ | ---------------------------- |
| API    | `/ws_digist/user/getCaptcha` |
| METHOD | get                          |

图形验证码接口是一个GET接口，在前端HTML中的img标签直接指向src即可。

~~~js
// 入参
// 前端缓存需要注意，切换图形验证码的时候，可以在url末尾带一个时间戳
// 例如：/ws_service/user/getCaptcha?ts=14500039390009
~~~



####3.1.2发送短信验证码

发送短信验证码，发送短信验证码接口已经一个通用的接口，在多种需要使用短信验证码的场景中使用这一个接口。

| 名称   | 值                                     |
| ------ | -------------------------------------- |
| API    | `/ws_digist/user/sendVerificationCode` |
| METHOD | POST                                   |

**入参**

~~~js
// 入参
{
    "mobile":"18888888888",		// 手机号码
    "graphVerifyCode":"1234",	// 图形验证码，如果用图形验证码，必传
    "verifyUser":true			// 【可选参数】验证用户：ture表示用户存在才发送短信，false表示用户不存在再发送短信；参数不存在则表示不验证用户
}
      
~~~

**出参**

~~~js

~~~



####3.1.3用户注册

新用户注册

| 名称   | 值                             |
| ------ | ------------------------------ |
| API    | `/ws_digist/user/userRegister` |
| METHOD | POST                           |

**入参**

```js
{
    "mobile":"18888888888",				// 手机号码
    "password":"abc0123456789",			// 登录密码
    "verifyCode":"1234"					// 手机验证码
}
```

**出参**

```js
// 出参如果没有需要字段，可以协商增加
{
    "user_id":"4944010064586BF5205C0000",
    "name":"188****8888",
    "created_time":"2018-12-24T15:04:10.892Z"
}
```



####3.1.4找回密码

根据手机号码找回密码

| 名称   | 值                                 |
| ------ | ---------------------------------- |
| API    | `/ws_digist/user/retrievePassword` |
| METHOD | POST                               |

**入参**

```js
{
    "mobile":"18888888888",				// 手机号码
    "password":"abc0123456789",			// 登录密码
    "verifyCode":"1234"					// 手机验证码
}
```

**出参**

```js
// 出参如果没有需要字段，可以协商增加
{
    "code":"0",
    "msg":"请求成功",
    "module":"DigiST",
    "result":{
        "user_id":"49440100583A36F61E5C0000",
        "name":"188****8888",
        "mobile":"78888888888"
    }
}
```



####3.1.5用户登录

用户登录，根据手机号码登录，暂时没开发邮箱登录，其他登录方式使用同一个API，传入不同的值即可。

| 名称   | 值                          |
| ------ | --------------------------- |
| API    | `/ws_digist/user/userLogin` |
| METHOD | POST                        |

**入参**

```js
{
    "mobile":"18888888888",				// 手机号码
    "password":"abc0123456789"   		// 登录密码
}
```

**出参**

```js
{
    "user_id":"49440100583A36F61E5C0000",	// 用户id，绝对唯一
    "name":"188****8888",					// 用户姓名（不唯一，显示使用）
    "mobile":"78888888888",					// 手机号码（登录账户之一，唯一）
    "isSetPassword":true,			// 是否设置了登录密码，false表示未设置
    "isSetPayPassword":true			// 是否设置了支付密码，false表示未设置
}
```



####3.1.6修改登录密码

首次登录密码设置可以不同输入旧密码，前端表现只需要个密码框即可，这个状态判断根据登录返回的结果值进行判断。

如果是已经设置过了登录密码，则需要输入旧密码验证通过之后才能修改成功。

| 名称   | 值                               |
| ------ | -------------------------------- |
| API    | `/ws_digist/user/changePassword` |
| METHOD | POST                             |

**入参**

```js
{
    "user_id":"",                   	// 用户id
    "old_password":"abc0123456789",     // 旧密码，首次设置登录密码，不传参
    "new_password":"abc0123456789"      // 新密码
}
```

**出参**

```js
{
    "code":"0",
    "msg":"请求成功",
    "module":"DigiST",
    "result":{
        "user_id":"49440100583A36F61E5C0000",// 用户id，绝对唯一
        "name":"188****8888",// 用户姓名（不唯一，显示使用）
        "mobile":"78888888888",// 手机号码（登录账户之一，唯一）
        "isSetPassword":true,// 是否设置了登录密码，false表示未设置
        "isSetPayPassword":true// 是否设置了支付密码，false表示未设置
    }
}
```



####3.1.7修改支付密码

首次支付密码设置可以不同输入旧密码，前端表现只需要个密码框即可，这个状态判断根据登录返回的结果值进行判断。

如果是已经设置过了支付密码，则需要输入旧密码验证通过之后才能修改成功。

| 名称   | 值                                  |
| ------ | ----------------------------------- |
| API    | `/ws_digist/user/changePayPassword` |
| METHOD | POST                                |

**入参**

```js
{
    "user_id":"",                   		// 用户id
    "old_pay_password":"abc0123456789",     // 旧密码，首次设置支付密码，不传参
    "new_pay_password":"abc0123456789"      // 新密码
}
```

**出参**

```js
{
    "code":"0",
    "msg":"请求成功",
    "module":"DigiST",
    "result":{
        "user_id":"49440100583A36F61E5C0000",// 用户id，绝对唯一
        "name":"188****8888",// 用户姓名（不唯一，显示使用）
        "mobile":"78888888888",// 手机号码（登录账户之一，唯一）
        "isSetPassword":true,// 是否设置了登录密码，false表示未设置
        "isSetPayPassword":true// 是否设置了支付密码，false表示未设置
    }
}
```



### 3.2钱包API

#### 3.2.1 查询用户钱包

进入钱包首页之后，首先查询用户钱包信息，如果没有

| 名称   | 值                  |
| ------ | ------------------- |
| API    | `/ws_service/user/` |
| METHOD | POST                |

**入参**

```js
{
	"user_id":"49440100583A36F61E5C0000"
}
```

**出参**

```js
// 用户钱包未创建的情况下返回
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": null				// 钱包信息为null表示未创建钱包，接下来进行创建或者导入钱包流程
}

// 如果用户钱包存在的情况下返回
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        "id": "44490100D072CF0E365C0000",
        "address": "0x8D327aFFcB78F4632056Dfe37c9CC0bff6e7f30F"
		// 钱包的余额或者其他代币余额查询可以考虑用额外的接口来实现
    }
}
```



#### 3.2.2 查询用户钱包余额

查询用户钱包（包含TOKEN代币）账户余额，根据3.2.1查询到用户钱包address的情况，再查询此接口，可以采用一定策略及时的更新用户的钱包余额情况，例如在tab卡片切换到钱包的时候执行查询，或者定时查询，或者投资项目之后执行查询。

**暂时空缺，细节有待明确下**

| 名称   | 值                                      |
| ------ | --------------------------------------- |
| API    | `/ws_service/user/getUserWalletBalance` |
| METHOD | POST                                    |

**入参**

```js
/**
 * 查询用户余额
 * @param {JSON} args 
 * {
 *      "user_id":"",      // 用户id
 *      "address":"",      // 地址
 *      "defaultBlock":"", // (可选)如果传递此值，则不会使用web3.eth.defaultBlock设置默认快
 *      "unit":""          // (可选)余额单位：默认ether
 * }
 */
{ 
	"user_id":"4449010040510C20375C0000",
	"address": "0x6d7d4a3c274813A00a4e34B842582021733f1a6C" ,
	"unit":"ether"
}
```

**出参**

```js
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": "0"
}
```



#### 3.2.3 创建用户钱包

先查询用户钱包，如果钱包不存在，可以创建钱包或者导入钱包

| 名称   | 值                                  |
| ------ | ----------------------------------- |
| API    | `/ws_service/user/createUserWallet` |
| METHOD | POST                                |

**入参**

```js
{
	"user_id":"49440100583A36F61E5C0000"
}
```

**出参**

```js
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        "id": "44490100EC2BA504375C0000",
        "address": "0xAB79E60d600e1746D0a4e82d3E4ad7B952309f06",
        "mnemonic": "spray trash daring critic give armor baby scale move head frown kingdom"
    }
}
```





~~~
// 测试数据，请忽略
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        "id": "444901006C33F824375C0000",
        "address": "0xEb884D11B524945Bb88d47eC51a8B9971F665cA8",
        "mnemonic": "flag hidden clutch gun benefit crumble public endless swear spring connect fade"
    }
}


INSERT INTO `digist_db`.`dst_wallet`(`id`, `user_id`, `address`, `mnemonic`, `privateKey`, `keystore`, `balance`, `remark`, `created_time`, `created_id`, `update_time`, `update_id`, `valid`) VALUES ('444901006C33F824375C0000', '49440100583A36F61E5C0000', '0xEb884D11B524945Bb88d47eC51a8B9971F665cA8', 'cp+FJSYMmBOmdq6qvIWacbmqVsFz4xiUNYBhK7FmNNYzYgFYn+uYD5QNvC1gMftyzjA4iMzSK1f1rxKjMEKM5qyNPSHI2s7kQfhMm9m1rvjSpK7n8XDZqE4iJ8soCX88oIKlKiiS/ZH7a6M83ppRSdEnvgpulEFgQ/tm+hy14rFNye9IUCxQplyzQWuGKTU4BRcZf0PdR5BqW36NIXG4RrmCCqsf01hLBGhiDPUe1TcOAHqrtkiqPQDuW54URB6NBdXVOY7b3UBKI4GX0QzFUeaYKkfNYP7NB8BtjLoJqfkMVB3GJNAY6fCntItfDgtUzAUfG1tqiMVZIFeQLsSOlg==', 'ZmVjdivpV1vLNWPUthElK3WgIjUdqpirIezpAAaMkUV6/1kZJYMdijDvQx8pHoCJez912znq9pI/bntPsviz4mzwcWvUT3IHT2lxnC2PSzw/v5DIEv+gON6566WwOM4MkMLA8IvtcAOMt/HPa8+CyPTFtTx9HYmiNyDxOmzSL3HFjdRQhGgqbG/9/jrRQGepMSGEh49mcyS3X8m6TYkeFEVf2BAazoZQviEj2On9425s0T5oMBhgkS9Cq+qZlbiMk2vGC0bYwDah9sSC1i/wITOt+ZeZZ4VYCj65eoGYKuNEobH8aBpwUEyt8TIchiy2RelWQ5bmvHLKqsjg6dBZ1A==', '', 0.00, '', '2019-01-10 18:56:55.000', '', '2019-01-10 18:56:55.000', '', 1);

~~~



#### 3.2.4 根据助记词导入钱包



| 名称   | 值                                        |
| ------ | ----------------------------------------- |
| API    | `/ws_service/user/importWalletByMnemonic` |
| METHOD | POST                                      |

**入参**

```js
{
	"user_id":"49440100583A36F61E5C0000",
	"mnemonic":"farm usual marble endorse voice tobacco weird swear color fall search jar"
}
```

**出参**

```js
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        "id": "44490100EC2B2B06375C0000",
        "address": "0xEa39b7f1d486E766ffC1fd5A1AAAa74e47065DA1"
    }
}
```



#### 3.2.5 根据keystore+密码导入钱包

貌似还有点问题

| 名称   | 值                                        |
| ------ | ----------------------------------------- |
| API    | `/ws_service/user/importWalletByKeystore` |
| METHOD | POST                                      |

**入参**

```js
{
    "user_id":"49440100583A36F61E5C0000",
    "password":"12345678",
    "keystore":{
        "version":3,
        "id":"f654d9b2-64da-4dfc-b755-eee214462c0c",
        "address":"4cceba2d7d2b4fdce4304d3e09a1fea9fbeb1528",
        "crypto":{
            "ciphertext":"",
            "cipherparams":{
                "iv":"4fb64c6ae444a64be98ae64875122c45"
            },
            "cipher":"aes-128-ctr",
            "kdf":"scrypt",
            "kdfparams":{
                "dklen":32,
                "salt":"39ef475153377ec3ebde90478a31ca2483ddc7aab02807897a6fb4555d6d5b5d",
                "n":8192,
                "r":8,
                "p":1
            },
            "mac":"03b2d19cca1e7db19bd1050e48686df09052686a80712ad791e25b0e7adb808a"
        }
    }
}
```

**出参**

```js
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        "id": "44490100EC2B2B06375C0000",
        "address": "0xEa39b7f1d486E766ffC1fd5A1AAAa74e47065DA1"
    }
}
```







#### 3.2.6 导出keystore

导出keystore（需要根据支付密码设置）

| 名称   | 值                                      |
| ------ | --------------------------------------- |
| API    | `/ws_service/user/exportWalletKeystore` |
| METHOD | POST                                    |

**入参**

```js
{
	"user_id":"49440100583A36F61E5C0000",					// 用户id
	"pay_password":"12345678",								// 支付密码
	"address":"0xEa39b7f1d486E766ffC1fd5A1AAAa74e47065DA1"	// 钱包地址
}
```

**出参**

```js
// result返回的就是keystoreJsonV3结构文件
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        "version": 3,
        "id": "f654d9b2-64da-4dfc-b755-eee214462c0c",
        "address": "4cceba2d7d2b4fdce4304d3e09a1fea9fbeb1528",
        "crypto": {
            "ciphertext": "",
            "cipherparams": {
                "iv": "4fb64c6ae444a64be98ae64875122c45"
            },
            "cipher": "aes-128-ctr",
            "kdf": "scrypt",
            "kdfparams": {
                "dklen": 32,
                "salt": "39ef475153377ec3ebde90478a31ca2483ddc7aab02807897a6fb4555d6d5b5d",
                "n": 8192,
                "r": 8,
                "p": 1
            },
            "mac": "03b2d19cca1e7db19bd1050e48686df09052686a80712ad791e25b0e7adb808a"
        }
    }
}

```



#### 3.2.7 转账（以太币转账）

转账分几种情况，以太币转账（如TRUE币转账），此外还有一种智能合约代币（TOKEN）转账，此接口是用来代币转账的接口

| 名称   | 值                                       |
| ------ | ---------------------------------------- |
| API    | `/ws_service/user/sendSignedTransaction` |
| METHOD | POST                                     |

**入参**

```js
// 以太币转账
{
    "user_id":"4449010040510C20375C0000",	
    "fromaddress":"0x25090d091a19CAbD722F508776ffc2c44119C24B",
    "toaddress": "0xa78928eAc28219C7d1B1563E9568AdA8BfC7677d",  
    "number": "1" 
}
```

**出参**

```js
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        "id": "44490100300B61593B5C0000",
        "transaction_hash": "0x1a2ec75c6f23e82698eee06aaafd8c69067b0a66138a28d933753f667cc41cc3"
    }
}
```



#### 3.2.8 查询转账交易列表

查询用户的交易记录列表，包含以太币转账记录，token代币转账记录都在这一个表里面。contract_address是合约地址，如果为空表示代币转账。

| 名称   | 值                                 |
| ------ | ---------------------------------- |
| API    | `/ws_digist/user/getUserTradeList` |
| METHOD | POST                               |

**入参**

```js
{
    "pageSize":2,
    "pageIndex":1,
    "where":{
		"user_id":"4449010040510C20375C0000"
    }
}
```

**出参**

```js
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        "recordsTotal": 6,
        "data": [
            {
                "id": "44490100984FD93B385C0000",
                "user_id": "4449010040510C20375C0000",
                "wallet_id": "44490100BC07DB5C375C0000",
                "block_hash": "0x9d801f3b67f61c522fbd72af922f43a196d910dcb93a43f90e37949afb4f713e",
                "block_number": 964625,
                "contract_address": null,
                "cumulative_gas_used": "21004",
                "fromaddress": "0x25090d091a19cabd722f508776ffc2c44119c24b",
                "gas_used": "21004",
                "status": "1",
                "toaddress": "0xa78928eac28219c7d1b1563e9568ada8bfc7677d",
                "transaction_hash": "0x75dc1d5ebf61ec766eea3c8282fb0c48db169df5f28920096c43d483c55170be",
                "transaction_index": 0,
                "remark": "",
                "created_time": "2019-01-11T06:46:49.000Z",
                "created_id": "",
                "update_time": "2019-01-11T06:46:49.000Z",
                "update_id": "",
                "valid": 1
            },
            {
                "id": "44490100943B9F3B385C0000",
                "user_id": "4449010040510C20375C0000",
                "wallet_id": "44490100BC07DB5C375C0000",
                "block_hash": "0xb8f35117d931172826171510a3e7f3642c78035e4ad92d4bfdf032e893210360",
                "block_number": 964615,
                "contract_address": null,
                "cumulative_gas_used": "21004",
                "fromaddress": "0x25090d091a19cabd722f508776ffc2c44119c24b",
                "gas_used": "21004",
                "status": "1",
                "toaddress": "0xa78928eac28219c7d1b1563e9568ada8bfc7677d",
                "transaction_hash": "0xbe7f43e8d65e42764d7f9316fb6e0d1d6119de3c1d384d75aeeaed9e2c0192b2",
                "transaction_index": 0,
                "remark": "",
                "created_time": "2019-01-11T06:45:51.000Z",
                "created_id": "",
                "update_time": "2019-01-11T06:45:51.000Z",
                "update_id": "",
                "valid": 1
            }
        ]
    }
}
```











###3.3项目API

#### 3.3.1 发起募资

发起项目募资，接口数据不完整的话进一步补充字段

| 名称   | 值                                           |
| ------ | -------------------------------------------- |
| API    | `/ws_digist/fundraising/initiateFundraising` |
| METHOD | POST                                         |

**入参**

```js
 {
      "company_name":"霸得蛮有限公司",                    // 公司名称
      "project_name":"活着就是搞事情",                    // 项目名称
      "company_description":"这是一家善于搞事情的公司",    // 公司介绍
      "corporate":"老王",                                 // 公司法人名称
      "company_contact":"18888888888",                     // 公司联系方式
      "company_emergency_contact":"1899999999",           //公司紧急联系方式
      "pledged_stock":20,                                 // 质押股票比例（百分比）
      "project_description":"这是个很牛的项目，轻轻松进账几分钱。",       // 项目简介
      "project_file":"dee123454612353245134523423",    // 项目文件
      "project_scale":0,                       // 筹集规模（货币单位：分）
      "equity_income":10,                      // 股权收益权（单位：百分比） 
      "project_token":"MANA/TRUE",             // 项目代币
      "investment_period":"3Y",                // 投资年限:3Y（最后一位表示日期单位：Y、M、D，分别表示年、月、日）
      "minimum_subscription":1000,             // 最低认购数量
 }
```

**出参**

```js
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        "id": "44490100D454720E345C0000",
        "company_name": "霸得蛮有限公司",
        "company_description": "这是一家善于搞事情的公司",
        "corporate": "老王",
        "company_contact": "18888888888",
        "company_emergency_contact": "1899999999",
        "pledged_stock": 20,
        "project_name": "活着就是搞事情",
        "project_description": "这是个很牛的项目，轻轻松进账几分钱。",
        "project_file": "dee123454612353245134523423",
        "project_val": -1,
        "currency": "CNY",
        "project_token": "MANA/TRUE",
        "project_scale": -1,
        "project_mode": "项目收益权",
        "minimum_subscription": 1000,
        "investment_period": "3Y",
        "equity_income": 10,
        "exit_early": "无",
        "project_status": "new",
        "follow": 0,
        "vote_target": 0,
        "subscribed_quantity": 0,
        "subscribed_frequency": 0,
        "vote": 0,
        "remark": "",
        "created_time": "2019-01-08T02:44:01.722Z",
        "update_time": "2019-01-08T02:44:01.722Z",
        "valid": 1
    }
}
```



#### 3.3.2 一键发币

发币流程是在募资项目资质审核通过之后，（如果需要投票的话，还需要在投票达标之后）才能触发的功能，由项目发起人触发一键发币



| 名称   | 值                                     |
| ------ | -------------------------------------- |
| API    | `/ws_service/fundraising/publishToken` |
| METHOD | POST                                   |

**入参**

```js
// 一键发币，一个项目只能发起一次，根据状态判定
{
    "id":"555301000C119D03225C0000",	// 项目id
    "user_id":"4449010040510C20375C0000",	// 用户id
    "address":"0x25090d091a19CAbD722F508776ffc2c44119C24B"		// 用户钱包id
}
```

**出参**

```js
// 发币成功
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": "智能合约发布成功"
}


// 发币失败
{
    "code": "1",
    "msg": "当前finished状态，不允许执行发币操作",
    "module": "DigiST",
    "result": "请求失败"
}
```



#### 3.3.3 募资列表查询

募资列表查询（状态查询）,不同的状态查询指定查询参数即可

| 名称   | 值                                          |
| ------ | ------------------------------------------- |
| API    | `/ws_digist/fundraising/getFundraisingList` |
| METHOD | POST                                        |

**入参**

```js
// 入参是一个动态参数结构
{
  pageSize:2,			// 每页记录数，默认是10,
  pageIndex:1,			// 分页索引，从1开始
  // 查询where条件，多种条件组合请参考`4.查询条件模型`
  where: {
      // "project_status": "closed"
      "project_status": {
          $in: ["closed"]               // in查询，更多规则请参考查询表
      }
  }
}
```

**出参**

```js
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        "recordsTotal": 17,
        "data": [
            {
                "id": "55530100A85F92F3225C0000",
                "user_id": "49440100583A36F61E5C0000",
                "company_name": "霸得蛮有限公司",
                "company_description": "这是一家善于搞事情的公司",
                "corporate": "老王",
                "company_contact": "18888888888",
                "company_emergency_contact": "1899999999",
                "pledged_stock": 20,
                "project_name": "活着就是搞事情",
                "project_description": "这是个很牛的项目，轻轻松进账几分钱。",
                "project_file": "dee123454612353245134523423",
                "project_val": -1,
                "currency": "CNY",
                "project_token": "MANA/TRUE",
                "project_scale": -1,
                "project_mode": "项目收益权",
                "minimum_subscription": 1000,
                "investment_period": "3Y",
                "equity_income": 10,
                "exit_early": "无",
                "project_status": "new",
                "follow": 0,
                "vote_target": 0,
                "subscribed_quantity": 0,
                "subscribed_frequency": 0,
                "vote": 0,
                "remark": "",
                "created_time": "2018-12-26T03:20:49.000Z",
                "created_id": "49440100583A36F61E5C0000",
                "update_time": "2018-12-26T03:20:49.000Z",
                "update_id": "49440100583A36F61E5C0000",
                "valid": 1
            },
            {
                "id": "55530100E41E9A05225C0000",
                "user_id": "49440100583A36F61E5C0000",
                "company_name": "霸得蛮有限公司",
                "company_description": "这是一家善于搞事情的公司",
                "corporate": "老王",
                "company_contact": "18888888888",
                "company_emergency_contact": "1899999999",
                "pledged_stock": 20,
                "project_name": "活着就是搞事情",
                "project_description": "这是个很牛的项目，轻轻松进账几分钱。",
                "project_file": "dee123454612353245134523423",
                "project_val": -1,
                "currency": "CNY",
                "project_token": "MANA/TRUE",
                "project_scale": -1,
                "project_mode": "项目收益权",
                "minimum_subscription": 1000,
                "investment_period": "3Y",
                "equity_income": 10,
                "exit_early": "无",
                "project_status": "new",
                "follow": 0,
                "vote_target": 0,
                "subscribed_quantity": 0,
                "subscribed_frequency": 0,
                "vote": 0,
                "remark": "",
                "created_time": "2018-12-25T10:25:29.000Z",
                "created_id": "49440100583A36F61E5C0000",
                "update_time": "2018-12-25T10:25:29.000Z",
                "update_id": "49440100583A36F61E5C0000",
                "valid": 1
            }
        ]
    }
}
```



#### 3.3.4 募资项目详情信息查询

单条数据详情查询，使用GET查询，get请求能浏览器缓存数据

| 名称   | 值                                                |
| ------ | ------------------------------------------------- |
| API    | `/ws_digist/fundraising/getFundraisingDetail/:id` |
| METHOD | GET                                               |

**入参**

```js
// url最后一位带参
// 例如：http://localhost:9980/ws_digist/fundraising/getFundraisingDetail/5553010010546D03225C0000
最后的`5553010010546D03225C0000`就是参数id
```

**出参**

```js
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        "id": "5553010010546D03225C0000",
        "user_id": "49440100583A36F61E5C0000",
        "company_name": "霸得蛮有限公司",
        "company_description": "这是一家善于搞事情的公司",
        "corporate": "老王",
        "company_contact": "18888888888",
        "company_emergency_contact": "1899999999",
        "pledged_stock": 20,
        "project_name": "活着就是搞事情",
        "project_description": "这是个很牛的项目，轻轻松进账几分钱。",
        "project_file": "dee123454612353245134523423",
        "project_val": -1,
        "currency": "CNY",
        "project_token": "MANA/TRUE",
        "project_scale": -1,
        "project_mode": "项目收益权",
        "minimum_subscription": 1000,
        "investment_period": "3Y",
        "equity_income": 10,
        "exit_early": "无",
        "project_status": "closed",
        "follow": 0,
        "vote_target": 0,
        "subscribed_quantity": 0,
        "subscribed_frequency": 0,
        "vote": 0,
        "remark": "",
        "created_time": "2018-12-25T10:16:13.000Z",
        "created_id": "49440100583A36F61E5C0000",
        "update_time": "2018-12-25T10:16:13.000Z",
        "update_id": "49440100583A36F61E5C0000",
        "valid": 1
    }
}
```









#### 3.



| 名称   | 值                        |
| ------ | ------------------------- |
| API    | `/ws_digist/fundraising/` |
| METHOD | POST                      |

**入参**

```js

```

**出参**

```js

```







## 4. 查询条件模型

#### WHERE

| sql                                                          | orm                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| SELECT * FROM post WHERE authorId = 12 AND status = 'active' | Post.findAll({where: { authorId: 2,status: 'active'}}); |

#### Operators

```
Post.update({
  updatedAt: null,
}, {
  where: {
    deletedAt: {
      $ne: null
    }
  }
});
// UPDATE post SET updatedAt = null WHERE deletedAt NOT NULL;

Post.findAll({
  where: sequelize.where(sequelize.fn('char_length', sequelize.col('status')), 6)
});
// SELECT * FROM post WHERE char_length(status) = 6;

{
  rank: {
    $or: {
      $lt: 1000,
      $eq: null
    }
  }
}
// rank < 1000 OR rank IS NULL

{
  createdAt: {
    $lt: new Date(),
    $gt: new Date(new Date() - 24 * 60 * 60 * 1000)
  }
}
// createdAt < [timestamp] AND createdAt > [timestamp]

{
  $or: [
    {
      title: {
        $like: 'Boat%'
      }
    },
    {
      description: {
        $like: '%boat%'
      }
    }
  ]
}
// title LIKE 'Boat%' OR description LIKE '%boat%'
```

| op                             | define                                                       |
| ------------------------------ | ------------------------------------------------------------ |
| $and: {a: 5}                   | AND (a = 5)                                                  |
| $or: [{a: 5}, {a: 6}]          | (a = 5 OR a = 6)                                             |
| $gt: 6,                        | > 6                                                          |
| $gte: 6,                       | >= 6                                                         |
| $lt: 10,                       | < 10                                                         |
| $lte: 10,                      | <= 10                                                        |
| $ne: 20,                       | != 20                                                        |
| $between: [6, 10],             | BETWEEN 6 AND 10                                             |
| $notBetween: [11, 15],         | NOT BETWEEN 11 AND 15                                        |
| $in: [1, 2],                   | IN [1, 2]                                                    |
| $notIn: [1, 2],                | NOT IN [1, 2]                                                |
| $like: '%hat',                 | LIKE '%hat'                                                  |
| $notLike: '%hat'               | NOT LIKE '%hat'                                              |
| $iLike: '%hat'                 | ILIKE '%hat' (case insensitive) (PG only)                    |
| $notILike: '%hat'              | NOT ILIKE '%hat'  (PG only)                                  |
| $like: { $any: ['cat', 'hat']} | LIKE ANY ARRAY['cat', 'hat'] - also works for iLike and notLike |
| $overlap: [1, 2]               | && [1, 2] (PG array overlap operator)                        |
| $contains: [1, 2]              | @> [1, 2] (PG array contains operator)                       |
| $contained: [1, 2]             | <@ [1, 2] (PG array contained by operator)                   |
| $any: [2,3]                    | ANY ARRAY[2, 3]::INTEGER (PG only)                           |
| $col: 'user.organization_id'   | "user"."organization_id", with dialect specific column identifiers, PG in this example  --$col取表的字段 |









const contract = new web3.eth.Contract(iterface);
  contract.options.address = contractAddress;
  const account = web3.eth.accounts.decrypt(keystore, password);
  web3.eth.accounts.wallet.add(account);
  const value_wei = web3.utils.toWei(value, 'ether');


  const data = contract.methods.transfer(toAddr, value_wei).encodeABI();
  web3.eth.sendTransaction({
​    from: fromAddr,
​    to: contractAddress,
​    value: '0x00',
​    gasPrice,
​    gas,
​    data,
  },
  (error, txhash) => {
​    callabck(error, txhash);
  });