# drivingschoolvue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

岗位职责负责、平台运营管理(SKU管理、用户管理、素材管理)、用户购物车管理、用户地址簿管理、用户订单生成以及经销商门店服务范围管理的设计与编码实现;不断打磨核心业务，并编写测试用例，保证代码的健壮;完善自己负责的接口文档、需求详细设计文档的编写;解决线上运营和测试返回的各种问题;
技术描述
自定义切面，实现公共字段填充，如:创建时间、创建人ID、修改时间、修改人ID
在素材管理模块中，我们采用七牛云云存储保存视频、音频、图片等资源;
使用Redis缓存店铺营业状态、SKU分类数据、商品套餐信息、用户购物车套餐数据
对接微信登录，并自定义封装了HttpClient工具类，自定义对接微信接口的方法，如:微信登录、获取用户资源等方法:
基于JWT封装用户Token，并自定义封装了拦截器校验JWT的数据有效性。
使用springCache优化了缓存编码设计;
生成订单的时候，基于Redis，使用防重Token进行幂等性校验，防止重复提交;
使用spring rask定时扫描超过默认15分钟，未支付的订单，并及时关闭;
使用spring Task定时扫描超过默认60分钟且状态处于派送中的订单，及时发送到MQ中，由客服系统人工介入;
使用websocket全双工协议，设计商家听单(接单、催单)业务需求以及买家、骑手、商家的在线聊天设计；
在平台运营管理端，数据统计模块中，使用Apache Echarts多种图表对接后端接口，展示营业数据、用户统计数据、订单统计，使用Apache poI完成各项经营数据的导出。
使用高德地图电子围栏，划分派送范围，并使用MOngoDp 2dsphere多边形数据类型保存地图经纬度经营范围;
整合高德地图轨迹服务，实现实时查询骑手的运动轨迹:
技术栈:SpringBoot, Mybatisplus、 MySQL、 Redis、 springData Redis、 spring Task, Apache Echarts、 Apache poI、 WebSocket
