# DigiST

采用前后端分离结构，来开发DigiST程序，此项目为DigiST服务端程序。



## 项目结构描述

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



