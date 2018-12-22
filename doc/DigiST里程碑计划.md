#DigiST项目开发计划

> 同学们，接下来的日子里大家要辛苦了，希望这个项目带给我们不一样的收获，加油~



| 版本编号 | 版本日期   | 修改者 | 说明     |
| -------- | ---------- | ------ | -------- |
| v0.1.0   | 2018-12-15 | 邹伟   | 简单参考 |

## 一、项目里程碑

项目开发进度安排，因各自的工作时间缘故，以下进度安排主要是作为大家的参考依据，实际开发根据各自的时间动态安排。推荐把的大的任务和困难的任务往前安排，例如，@勇往直前，熟悉智能合约在项目开始时就可以提前启动。



~~~mermaid
gantt
	dateFormat  YYYY-MM-DD
	title DigiST里程碑计划
	
	section 原型设计
	需求初稿 			:done,    prototype1, 2018-12-10,2018-12-15
	需求修正			:active,	prototype2,2018-12-15,2d

	section UI设计
	UI初稿   			 :done,		user1,2018-12-12,2018-12-16
	UI修正			 :active,	prototype2,2018-12-16,3d
	
	section UX交互
	交互设计            :active,  experience1, 2018-12-15, 5d
	交互修正			:	    experience2,after experience1,2d
	
	section 前端开发
	前端静态页面开发     :active,   front1,2018-12-14,2018-12-23
	前端静态页面修正	:   front2,after experience2,3d

	section 后端开发
	项目基础架构搭建          	:done,   dev1,2018-12-10,2018-12-20
	智能合约方案研究		    :active, dev2,2018-12-12,10d
	后端业务接口开发 			:active, dev3,2018-12-15,7d
	智能合约接口开发			:	   dev4,after dev3,5d
	API文档编写 			   :    dev5,2018-12-20,5d
	
	section 联调与测试
	前后端联调开发				:crit,unity1,2018-12-23,7d
	集成测试与BUG修复			:crit,unity2, after unity1,5d
	用户测试				  : unity3,after unity2,5d
        
      
        
~~~



##二、项目资料

列表常用的项目开发用到的一些基础资料。



###项目开发

原型：

https://run.mockplus.cn/ctZNXEBiwefGVErg/index.html?to=4EDA3031-974D-4AC7-BF9A-4B8B1F7F7AA4

墨刀：

https://pro.modao.cc/app/R8wXT2QNr17OI66gNM4VAdyKoHygbMI



**项目仓库**

| 项目名称       | 项目地址                                   | 备注       |
| -------------- | ------------------------------------------ | ---------- |
| DigiST后端项目 | https://github.com/zouwei/DigiST.git       | 基于github |
| DigiST前端项目 | https://github.com/zouwei/DigiST-front.git | 基于github |
| DigiST APP项目 | https://github.com/zouwei/DigiST-app.git   | 基于github |



###开发资料

[以太坊ERC20代币web3js^0.18.4转账过程](http://www.blockchainbrother.com/article/6531)

[第十七课 【ERC721实践】迷恋猫从玩耍到开发](https://www.jianshu.com/p/684490db252c)

项目源码：[以太坊众筹系统](https://github.com/littleredhat1997/CrowdFunding)

项目源码：[区块链众筹平台服务端系统](https://github.com/CBD-Forum/N0018-Genesis-crowd-funding)



###行业资料

[数说 | 币圈‘奇葩’融资史](https://www.jinse.com/bitcoin/289133.html)

[标准共识：STO 走不通？一文详解 Reg A+](https://www.jinse.com/bitcoin/289838.html)





