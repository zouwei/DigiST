# DigiST

> 采用前后端分离结构，来开发DigiST程序，此项目为DigiST服务端程序。
>
> 方面起见，常用的信息都在此文档中进行描述，包含且不限于项目描述、项目接口文档，项目规范等



| 版本编号 | 版本日期   | 修改者 | 说明               |
| -------- | ---------- | ------ | ------------------ |
| v0.0.2   | 2019-01-07 | 胡邹   | 募资接口文档更新   |
| v0.0.1   | 2018-12-24 | 胡邹   | 用户相关的接口描述 |



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

在实际的测试环境中或者生产环境中只需要替换api的域名部分即可。

**返回参数code值定义**

| 返回参数值 | 说明                                                    |
| ---------- | ------------------------------------------------------- |
| 0          | 表示请求成功                                            |
| 1          | 表示失败，大于0的都非正常状态，不同的值根据业务单独定义 |

###3.1用户API



####3.1.1获取图形码

页面图形验证码，主要作用是防止对一些付费接口的流量攻击，发送短信是有成本的，通过引入图形验证码能在一定程度上预防这种流量攻击。

| 名称   | 值                            |
| ------ | ----------------------------- |
| API    | `/ws_service/user/getCaptcha` |
| METHOD | get                           |

图形验证码接口是一个GET接口，在前端HTML中的img标签直接指向src即可。

~~~js
// 入参
// 前端缓存需要注意，切换图形验证码的时候，可以在url末尾带一个时间戳
// 例如：/ws_service/user/getCaptcha?ts=14500039390009
~~~



####3.1.2发送短信验证码

发送短信验证码，发送短信验证码接口已经一个通用的接口，在多种需要使用短信验证码的场景中使用这一个接口。

| 名称   | 值                                      |
| ------ | --------------------------------------- |
| API    | `/ws_service/user/sendVerificationCode` |
| METHOD | post                                    |

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

| 名称   | 值                              |
| ------ | ------------------------------- |
| API    | `/ws_service/user/userRegister` |
| METHOD | post                            |

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

| 名称   | 值                                  |
| ------ | ----------------------------------- |
| API    | `/ws_service/user/retrievePassword` |
| METHOD | post                                |

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

| 名称   | 值                           |
| ------ | ---------------------------- |
| API    | `/ws_service/user/userLogin` |
| METHOD | post                         |

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

| 名称   | 值                                |
| ------ | --------------------------------- |
| API    | `/ws_service/user/changePassword` |
| METHOD | post                              |

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

| 名称   | 值                                   |
| ------ | ------------------------------------ |
| API    | `/ws_service/user/changePayPassword` |
| METHOD | post                                 |

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

#### 3.2.1



| 名称   | 值                  |
| ------ | ------------------- |
| API    | `/ws_service/user/` |
| METHOD | post                |

**入参**

```js

```

**出参**

```js

```







###3.3项目API

#### 3.3.1 发起募资

发起项目募资，接口数据不完整的话进一步补充字段

| 名称   | 值                                            |
| ------ | --------------------------------------------- |
| API    | `/ws_service/fundraising/initiateFundraising` |
| METHOD | post                                          |

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
// 返回成功
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        	"id":"",				// id是必须返回的字段
        	// 返回参数待定
    }
}
```



#### 3.3.2 募资列表查询

募资列表查询（状态查询）,不同的状态查询指定查询参数即可

| 名称   | 值                                           |
| ------ | -------------------------------------------- |
| API    | `/ws_service/fundraising/getFundraisingList` |
| METHOD | post                                         |

**入参**

```js
// 入参是一个动态参数结构
{
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
        
    }
}
```



#### 3.3.3 募资项目详情信息查询



| 名称   | 值                                             |
| ------ | ---------------------------------------------- |
| API    | `/ws_service/fundraising/getFundraisingDetail` |
| METHOD | post                                           |

**入参**

```js
{
    "id":""			// 募资项目id
}
```

**出参**

```js
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        // 信息待补充完整
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
}
```











####3.



| 名称   | 值                         |
| ------ | -------------------------- |
| API    | `/ws_service/fundraising/` |
| METHOD | post                       |

**入参**

```js

```

**出参**

```js
{
    "code": "0",
    "msg": "请求成功",
    "module": "DigiST",
    "result": {
        
    }
}
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