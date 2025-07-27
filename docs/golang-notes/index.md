---
title: Golang 笔记
date: 2023-07-20
cover: "./covers/test.png"
tags: 
  - 专业
  - 面经
---

## Go面经

直接`var m map[string]int`的map为nil，不能添加元素

string类型的值是二进制byte slice，只能转成[]byte后修改再转回

> 关闭HTTP响应体：响应体通常是IO流，可能指向网络连接或文件，关闭响应体能避免资源泄露。同时关闭响应体也能允许连接回到连接池供后续复用。

关闭HTTP响应体：在响应错误时关闭 & 手动调用defer关闭

为什么要主动关闭http连接？不关闭程序可能会消耗完socket描述符

Go解析json默认把数值当成float64处理

从panic中恢复（必须嵌套一层函数）：defer func() {recover()}()

switch选择表达式值，是if-else的替代；select选择channel，用于IO multiplexing

goroutine泄露：channel阻塞或未关闭，死锁，无限循环等，go提供了工具检测泄露。避免措施比如sync.WaitGroup等待结束，利用context及时传递取消信号

golang中跳出for select循环需要定义标签CODE然后break CODE

go组合优于继承，内嵌结构体属性可用外层结构体.属性直接调用

slice长度可变；指针，长度，容量，1024以下2倍扩容，以上1/4倍扩容，复制slice最好直接Copy。而数组list是值传递，传递拷贝无法更新。

make用于构建slice, map, channel并分配内存地址

打桩stubbing：模拟外部服务/组件/函数行为，简化测试环境搭建

go优点：快，并行，垃圾处理

...可变参数本质是数组

使用管道相比互斥锁更能解决数据竞争问题

interface的类型和值均为nil时才为nil

垃圾回收：引用计数（不能处理循环引用）；标记清除（需要STW）；三色标记（所有白，根节点遍历灰，灰变黑，遍历黑，写屏障）

GMP(Goroutine, Machine, Processor)：P由GOMAXPROCS确定，M对应真实CPU数，P有G队列，周期性将G调度到M中执行

channel通信本身异步安全：**不要通过共享内存来通信（加锁），而是通过通信来共享内存（管道）**

rune类型等价UTF-8，相当于Unicode字符

空struct{}不占内存空间，可用于占位符（map的值），或者通信（channel），不包含字段只包含方法的结构体。

kafka：开源流处理平台，为处理实时数据提供统一/高吞吐/低延迟的发布/订阅平台

Go内存管理主要指堆内存管理：分配内存块，回收内存块。每个block包括size, used, next（链表的next）, data，align。释放内存实质是标记未使用block，处理内存碎片则是合并连续未使用的内存块。

为了提高多线程申请内存的效率，TCMalloc做法是位每个线程预分配一块缓存（无需加锁）

Page(8kB), Span, mcache（对每个P）, mcentral（所有线程共享的缓存，需要加锁访问），mheap

Mutator（用户程序）向Allocator从Heap中申请空间，Collector自动回收Heap中的内存

Go内存分配：Tiny对象（1-16 Byte，不包含指针），小对象（16Byte - 32 kB），大对象（>32kB），Tiny和小对象在mcache分配，大对象在mheap分配。mache不够了向mcentral申请，mcentral不够了向mheap申请。

reflection：程序运行时访问，检测和修改自身状态或行为的一种能力。

内存逃逸：某些变量我们在函数运行后仍想使用，这个变量就需要从栈转移到堆。

逃逸分析：程序在编译阶段分析代码哪些变量在栈上分配哪些变量在堆上分配。

reslice通过指针移动完成，和原slice共享底层数据

channel源码分析：buf(存储数据的缓冲循环链表)，sendx(send index), recvx(recv index), lock, recvq(等待接收数据goroutine队列), sendq

Go的一些设计：map遍历顺序会有意打乱。fmt.Println()涉及大量反射调用，会造成变量从栈逃逸到堆中，逃逸到堆后空struct默认指向zerobase地址，使之相等。没逃逸则Go代码优化会让它不相等

