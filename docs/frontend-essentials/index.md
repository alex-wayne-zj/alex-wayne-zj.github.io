---
title: 前端知识库
date: 2022-04-02
cover: "./cover.jpg"
tags: 
  - 职业技能
  - 面试
  - 前端
description: "The first glance at software engineering."
---

# HTML

HTML5的设计目的是为了在移动设备上支持多媒体

新特性包括audio，video，canvas，本地存储，特殊表单控件如calendar、date、time、email等等，语义化标签等等，完全支持CSS3

HTML5的语义化：选择恰当的HTML标签让页面具有良好的结构和语义。内容标签包括footer，section，nav，header，article等等

XHTML和HTML的区别

1. 以XML格式编写的HTML
2. 更严格（比如说有无结尾标签），很多内容都是强制性的
3. XHTML可以兼容各大浏览器、手机和PDA

meta标签提供有关页面的元信息

渐进式渲染

1. 提高网页性能，尽快呈现页面
2. 图片懒加载，滚动页面到图片位置才加载
3. 先只加载一小部分CSS，JS，HTML

viewport是设备屏幕能用来显示网页的区域，一般来说，移动设备的viewport大于浏览器，出现横向滚动条，目的是为了展示没有做移动端适配的网页

# CSS

盒子从内到外包括content, padding, border, margin

1. width / height只包括content宽高
2. box-sizing: border-box，将padding, border全部计入width和height
3. box-sizing: content-box默认，box-sizing: inherit继承父元素box-sizing值

CSS3新特性包括新选择器、边框、文本、背景、渐变、过渡、动画、多列、flex布局等等

1. 伪类和伪元素是用来修饰不在文档树中的部分
2. 伪类是用于在**已有元素**处于某种状态时为其添加状态，比如:hover
3. 伪元素是创建一些不在DOM树上的元素比如::before，伪元素用::表示
4. anchor伪类，分为四种状态link / active / visited / hover

隐藏页面方式

1. display: none不可见且不占空间
2. visibility: hidden不可见但占空间，也不响应用户交互
3. opacity: 0不可见，占空间，响应用户

水平居中和垂直居中

1. 水平居中text-align: center; margin: auto
2. 垂直居中line-height: height; padding: 20px
3. flex布局中justify-content或者align-items设为center

position和display

1. 五个值：static默认；fixed相对屏幕固定同时脱离文件流；relative相对于父节点，常用与absolute的容器，这两者都能用top left right bottom调整位置，sticky正常相当于relative，设置四个方向后可以在滑动后变成fixed

z-index可以用来改变元素显示层级

1. display常见有none，block，inline（不可设置宽和高，竖直方向上的margin和padding无效），inline-box（inline不换行，具有宽高），flex

2. 元素浮动后display值自动变成block
   1. 元素浮动后会脱离常规文档流，影响页面整体的排布结构，父级元素无法被撑开，同级元素会紧随其后。
   2. 清除浮动可以用clear: both; 或者用flex布局替代浮动呈现效果
3. link是XHTML标签，@import只能加载CSS。前者是页面载入时同时加载，后者是页面完全载入后才加载。link支持JS控制DOM改变样式，@import不支持。一般推荐用link
4. flex是轴线布局，即一维布局；grid是二维网格布局，划分行列产生单元格，功能很强大，但目前学习成本相对较高，且兼容性不如flex
   1. 网格布局通常要先保证所有的盒子box-sizing: border-box;
5. 五种前端布局：table / flex / grid / absolute / float
   1. 父级容器-display: table；子级容器-display: table-cell，类似弱化版的flex-box
6. dpi: dots per inch
   6. 一般用在印刷行业，dot类似于印刷行业的px
7. attribute是自带属性，property是添加属性
8. 流式布局即用百分比设置宽度
   1. 缩放布局会缩小文字，而流式布局不会
   2. 响应式布局——一个网站兼容多个终端，而不是为每个终端做一个特定的版本。它不会缩放东西，而是根据当前窗口尺寸决定显示哪些内容。实现的话应用到了flex布局和流式布局百分比宽度。
   3. CSS3的media query即@media获取当前设备的属性调整rem，设置viewport的width为device-width
   4. vw: viewport width和vh: viewport height分别是1%视口宽度和1%视口高度；vmin和vmax分别指vw和vh中的较小值和较大值
9. 圣杯布局和双飞翼布局
   1. 解决问题：两边等宽，中间自适应。中间栏放在文档流前面优先渲染
   2. margin-left和margin-right可以设置负值，左右盒子会跟过来覆盖，但元素本身大小其实不变
10. padding百分比是相对于父级盒子宽度

11. JS
    1. null和undefined的区别
       1. ===不相等，两种数据类型
       2. null代表无，undefined代表有值但未初始化
    2. 如何判断JS变量是否为Number类型和Array类型
       1. 最简单分别用typeof和instanceof即可
       2. 此外，Array还可以通过arr.__proto\_\_ == Array.prototype或者Array.isArray(arr)等等通过查看变量原型来确定类型的不同存在堆中写法
    3. 基本类型在栈（占用空间固定）中，引用类型在堆中
       1. 引用类型包括Object / Array / Function / RegExp / Date / 基本类型包装应用类型(String / Number / Boolean) / 单体内置对象(Global / Math)
       2. 区别包括复制，检测类型，存储位置
    4. JS DOM常见API
       1. document.createElement
       2. element.appendChild
       3. document.getElementById / TagName
       4. node.parentNode.removeChild()
    5. 事件冒泡和事件捕获
       1. 解决页面事件流问题
       2. 微软提出事件冒泡事件流，从最内层div到最外层div的顺序出发
       3. 网景提出事件捕获，顺序相反
       4. 可以用e.stopPropagation()阻止冒泡或者window.event.cancelBubble = true
    6. window和document的区别
       1. window指整个窗体，document指整个HTML文档页面，后者是前者的子对象
       2. 用户可以改变window显示的document对象
    7. 事件委托或者事件代理
       1. 目的是为了减少DOM的事件处理程序，减少内存占用
       2. 利用事件冒泡，指定一个事件处理程序处理某一类型的所有事件
       3. event.target或者event.srcElement可以获取事件真正的目标节点dom
       4. event.preventDefault()阻止默认事件，但会发生冒泡
    8. 闭包包括函数和函数内部能访问的变量，常常呈现为函数的嵌套
       1. 闭包的作用：使得函数拥有私有变量成为可能，间接访问变量
       2. 所有函数都能访问它们上一层的作用域
       3. 不利于垃圾回收
    9. call / apply / bind都是用来重定义this对象，第二个参数用来传参数，call分开传，apply做数组传，bind返回函数
    10. 原型链
       11. 显式原型prototype，隐式原型__proto\_\_
       12. 任何对象都有原型对象，对象的内置属性__proto\_\_指向构造函数的prototype指向的对象，prototype是方法的属性，prototype.constructor指向该构造函数
       13. 原型对象的__proto\_\_指向Object，Object的\_\_proto\_\_为null
       14. 原型链的核心是依赖对象的\_\_proto__指向
       15. 原型链的好处是可以继承Object的方法，类似于多态的好处
    16. 创建对象的方式：对象字面量，构造函数，Object.create
    17. this最终指向的是调用它的那个对象
    18. [] == [] false，指针指向不同的对象
    19. Attribute和Property区别
        1. 对于DOM节点，Attribute是DOM节点自带属性，Property是DOM对象附加属性
    20. JS事件循环
        1. JS单线程，AJAX实际上是在浏览器处理网络模块中执行，不会影响JS引擎任务处理
        2. 任务排队等待执行，宏任务放在队尾如setTimeOut, setInterval, ajax, 事件绑定，回调函数，微任务放在队头如Promise, async/await, process.nextTick, MutationObserver
        3. stack存块环境，queue存任务列表，heap存引用类型本体
        4. JS引擎执行任务时不会进行渲染
    21. 手写闭包
    22. 基础类型放在栈中，引用类型放在堆中
        1. 栈中变量空间固定，值不可变，保存值本身而非地址
        2. 堆中变量占用空间不固定，值可变，变量地址而非值，标记回收
    23. js同步异步相关
        1. JS中所有同步任务在主线程上执行形成执行栈
        2. 主线程外存在任务队列，异步任务结束后就在任务队列中放置事件
        3. 执行栈中同步任务执行完毕，系统读取任务队列取出放入执行栈
        4. 为了避免复杂性，JS始终是单线程——JS引擎中解释和执行JS代码的线程只有一个
    24. **this指的是调用函数的对象，运行时绑定**
        1. this绑定规则有五种
           1. 默认绑定
              1. 函数独立调用，非严格模式下this指向window，严格模式下this指向undefined
              2. 非严格模式下**var声明的**全局变量和函数默认作为window对象的属性和方法
              3. 闭包作为独立函数调用，其this指向window
           2. 隐式绑定
              1. xxx.func()，this指向xxx；如果存在链式：x.y.z.func()，this指向最后调用它的对象
              2. 隐式绑定丢失——丢掉了func前面的对象.
                 1. 为函数赋别名
                 2. 函数作参数传递
                 3. 丢失后启动默认绑定
           3. 显式绑定
              1. 通过call(), apply(), bind()改变this指向
                 1. call(object, arg1...)
                 2. apply(object, [arg1...])
                 3. bind(obj, arg1...)返回函数但不执行
           4. new 绑定
              1. 构造函数的this和原型里的this对象指的是new创建的生成实例
              2. 绑定优先级new > 显式绑定 > 隐式绑定 > 默认绑定
           5. ES6箭头函数绑定
              1. 箭头函数没有自己的this，箭头函数中的this来源于上级作用域
              1. 箭头函数试图显式绑定无效
           6. 特殊规则：
              1. 显示绑定值为null/undefined时，this直接绑定window
              2. 定义对象时不产生作用域
12. 框架
13. 浏览器相关
    1. 标准模式和怪异模式
       1. 标准模式是指浏览器按照W3C标准解析执行的代码
       2. 怪异模式是指浏览器用自己的方式解析执行代码（主要是在标准化之前浏览器有自己的实现方式）
          1. 经典差异；盒子模型的计算——标准CSS盒子宽高等于content宽高，不包括padding和border
       3. DTD文档类型定义确认是用什么模式，对于HTML5只需要<!DOCTYPE HTML>
    2. 网页加载-解析-渲染
       1. 从上到下
       2. JS / CSS重定义会覆盖
       3. CSS / JS文件建议移到外部
       4. 浏览器解析HTML代码，构建DOM树，同时构建渲染树；遇到JS文件将阻塞DOM树构建，遇到CSS会阻塞渲染树的构建
       5. script标签中的defer会让JS加载和DOM树加载异步，但JS执行会等到DOM树构建完成
       6. 综之，script最好放在body标签最后，这样会让页面内容先加载，为用户提供视觉反馈
       7. css最好放在head标签中，浏览器边构建边渲染
    3. 从输入URL到页面渲染经历了什么
       1. 输入URL
       2. DNS解析 - 将域名解析成IP地址寻找服务器
       3. 服务器建立连接
          1. 三次握手，连接服务器指定端口，建立TCP连接，同步序列号和确认号，交换TCP窗口信息
          2. SYN=1, seq=X
          3. SYN=1, seq=Y, ACK=1, ack=X+1
          4. seq=X+1, ACK=1, ack=Y+1
          5. 客户端和服务器进入Established状态
       4. 发送HTTP请求
          1. http请求通常由请求行，消息报头，请求正文组成
          2. 请求行由Method, requestUrl, HttpVersion组成
             1. Method: GET, POST, HEAD, PUT, DELETE, OPTIONS, CONNECT, TRACE
          3. 消息报头由以下字段组成（主体均是客户端）
             1. Accept：接受MIME类型
             2. Accept-Charset：接受字符集
             3. Accept-Encoding：接受内容编码
             4. Accept-Language：接受自然语言
             5. Authorization：证明客户端有权查看某个资源
             6. Host：指定服务器主机和端口号
             7. User-Agent：用户代理
             8. Cookie
             9. Referer：产生请求的网页来自于哪个URL
             10. Content-Type：Body编码方式
                11. application/json
                12. text/xml
                13. text/plain纯文本包括text/json/xml/html
                14. multipart/form-data允许多种类型数据
       5. 服务器响应
          1. response包括状态行，消息报头和响应正文
             1. 状态码
                1. 1xx：服务器成功接收部分请求，要求客户端继续提交其余请求
                2. 2xx：OK
                3. 3xx：为完成请求，客户端需要进一步细化
                   1. 301：永久重定向
                   2. 302：临时重定向
                   3. 304：客户端有缓存
                4. 4xx：客户端请求错误
                   1. 400：服务器无法解析的请求
                   2. 401：未授权的请求
                   3. 403：服务器拒绝访问
                   4. 404：服务器找不到被请求的网页
                   5. 405：请求方式不被允许
                   6. 408：请求超时
                5. 5xx：服务器端出现错误
                   1. 500：服务器内部错误
                   2. 501：服务器不具备完成请求功能
                   3. 503：服务器不可用
             2. 消息报头
                1. 响应报头
                   1. Location：重定向接受者到一个新的位置；
                   2. WWW-Authenticate：包含在401中
                   3. Server：服务器端用来处理请求的软件信息
                2. 实体报头
                   1. Content-Encoding：数据编码
                   2. Content-Language：资源所用自然语言
                   3. Content-Length：以字节方式存储十进制数表示正文长度
                   4. Content-Type：媒体类型
                   5. Last-Modified：资源最后修改日期及时间
                   6. Expires：相应过期日期和时间
             3. 响应正文
       6. 解析渲染页面
          1. 见上一条
       7. 服务器断开连接
          1. 四次挥手
          2. FIN=1, seq=u
          3. ACK=1, seq=v, ack=u+1
          4. FIN=1, seq=w, ack=u+1
          5. ACK=1, seq=u+1, ack=w+1
14. ES6
15. 计算机网络
    1. HTTP协议是基于TCP/IP的应用层协议，它不涉及数据包传输（由传输层的TCP协议负责），**主要规定了客户端和服务器之间的通信格式**，默认使用80端口
    2. HTTP协议历史演变和设计思路。[详情](https://www.ruanyifeng.com/blog/2016/08/http.html)
       1. HTTP/0.9
          1. 1991年发布，极其简单
          2. 请求只有GET命令，请求网页
          3. 响应只有HTML格式字符串
          4. 发送完毕就关闭TCP连接
       2. HTTP/1.0
          1. 1996年发布
          2. 可以发送任何格式内容
          3. GET / POST / HEAD
             1. GET：从指定的资源请求数据。查询字符串（键值对）放在URL中，因此不应用于处理敏感数据，并且有长度限制
             2. POST：向指定的资源提交要被处理的数据。查询字符串（键值对）放在POST请求的HTTP消息主体中发送的
             3. HEAD：用来获取响应的报头
          4. 请求和响应都必须包括报头信息HTTP header元数据
             1. 请求在HTTP/0.9的基础上增加HTTP版本和客户端基础信息
             2. 回应则包括都信息，空行，数据。其中第一行是协议版本+状态码+状态描述
             3. header必须是ASCII编码，后面数据可以是任意格式，Content-Type就是告知客户端数据是什么格式(text/css, image/jpeg, application/javascript)。这些数据类型统称为MIME type(Multipurpose Internet Mail Extension)，包括用斜杠分隔的一级类型和二级类型，末尾可加分号;添加参数。产商可自定义类型
             4. 客户端请求时的Accept: */\*用于声明客户端接受任何格式数据
             5. Content-Encoding: gzip字段说明数据的压缩方法，请求则用Accept-Encoding说明自己接受哪些压缩方法
          5. 还新增了状态码，多字符集支持，多部分发送，权限，缓存，内容编码等
          6. 主要缺点
             1. 每个TCP连接只能发送一个请求，发送数据完毕连接就关闭
             2. Connection: keep-alive非标准，能用但不通用
       3. HTTP/1.1
          1. 1997年发布，最流行的版本
          2. 持久连接persistent connection，TCP连接默认不关闭。主动关闭连接方式：客户端在最后一个请求时发送Connection: close
          3. 引入管道机制，客户端可以同时发送多个请求而不需要等待上一个请求得到响应。
          4. Content-length字段声明回应数据长度便于拆分数据包
          5. 而提前知晓数据长度在一些动态操作中很耗时，因此用stream流模式替代buffer缓存模式。使用分块传输编码，表明回应由数据未定的数据块组成：Transfer-Encoding: chunked
             1. 每个非空数据块以16进制数开头表示长度
          6. 新增方法
             1. PUT：请求服务器存储一个资源
             2. CONNECT：预留将连接改为管道
             3. TRACE：请求服务器回送收到的请求信息，主要用于测试
             4. OPTIONS：预检请求，询问针对指定URL支持的方法
             5. DELETE：请求服务器删除RequestUrl资源
          7. 头信息新增Host字段指定服务器域名
          8. 缺点：队头堵塞
       4. SPDY
          1. 2009年Google自行研发的基于TCP的会话层协议
          2. 目的是最小化网络延迟，提升网络速度
       5. HTTP/2
          1. 2015年发布
          2. 二进制协议：头信息和数据体都是二进制，统称为帧
          3. 必须基于HTTPS
          4. Multiplexing多工：一个TCP连接可以发送多个请求和回应且无需按照顺序一一对应
          5. 每个数据流stream有独一无二的ID，客户端发出的ID一律为奇数，服务器发出的一律为偶数
          6. 可以中途发送RST_STREAM帧取消数据流
          7. 可以指定数据流优先级
          8. HTTP协议无状态（无状态：每个请求完全独立不涉及状态变更，比如TCP需要先建立连接进入Established状态才能传数据，HTTP协议本身不涉及这一点），因此需要Cookie和Session
             1. 相同的头信息会浪费带宽，因此引入头信息压缩机制header compression，用gzip或compress压缩后在发送，另一方面，客户端和服务器维护一张头信息表生成索引号存所有字段
          9. 允许服务器未经请求向客户端发送资源——服务器推送server push
       6. QUIC
          1. Quick UDP Internet Connections
          2. 2013年Google开发，利用UDP绕开了TCP的天然缺陷：TCP和TLS队头阻塞，握手时延，协议僵化等问题。
          3. QUIC是用来替代TCP、SSL/TLS的传输层协议
             1. HTTPS是HTTP和SSL/TLS的简称
             2. SSL: Secure Socket Layer安全套接字协议; TLS: Transport Layer Security传输层安全SSL3.1。这两者旨在通过Internet在客户端和服务器之间提供安全通信通道的加密协议。其中SSL较旧，TLS较新
             3. SSL/TLS证书由证书颁发机构的第三方签署
       7. HTTP/3
          1. 2018年发布，HTTP over QUIC
          2. 首次连接只需要1 RTT，后面连接只需要0 RTT
          3. QUIC不受四元组（源IP，源端口，目的IP，目的端口）变更（切换WiFi，在移动设备普及的今天非常频繁）影响，而是使用一个64位随机数作为ConnectionID
          4. 传输单元是Packet，加密单元也是Packet，没有处理顺序
             1. 快速重传：发送方每次发送都会设置超时计时器，超过后即认为丢失，需要重发
             2. 快速恢复：重传时使用计时器，收到消息进入拥塞避免，否则进入慢启动
          5. QUIC对UDP的改造提供数据包重传，拥塞控制，流量控制，调整传输速率等TCP中存在的一些特性
          6. 使用TLS1.3
16. 工程化
17. 模块化
18. Node.js
19. 性能优化
20. 数据结构