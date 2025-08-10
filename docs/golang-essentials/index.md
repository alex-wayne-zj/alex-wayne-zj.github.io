---
title: Golang知识库
date: 2024-08-02
cover: "./cover.jpg"
tags: 
  - 职业技能
  - 面试
  - Golang
description: "Modern, Elegant, Reliable."
---

## 核心机制

golang语言特点（对比其他语言）

* 简洁、高级语言、协程天然支持多并发（云原生）、C++般的性能、支持垃圾回收、生态堪比Java / Python
* 多线程方面：C++使用系统级别的原生线程API；Python通过threading创建多线程，但受制于GIL，同一时刻只能有一个线程运行；Golang通过用户级线程goroutine实现并行



什么是GMP调度模型？

* Golang运行时（runtime）用于管理 **协程（goroutine）** 的核心调度机制（天然支持高并发）：协程、线程和调度器/处理器(Goroutines, Machine/Thread, Processor)。协程是用户级轻量线程，线程是运行goroutine的实体，P有一个协程队列
  * G添加到P队列中（如果都满了添加到全局队列中），P取G绑定M执行，阻塞时换绑M到其他G，队列为空时从其他P中拿G
  * 最多有GOMAXPROCS个活跃线程能运行，默认为内核数
* **自旋线程**：处于运行状态但是没有可执行goroutine的线程
* 没有P层锁竞争会影响性能



go垃圾回收

GC是很多Go服务的性能瓶颈，本身也在优化，有时升级Go版本就能解决

* （已不用）标记清除：从根对象出发遍历标记所有可达对象，GC扫描堆清除未标记对象。缺点是需要STW(Stop The World)，一次数百毫秒；
* （目前）三色标记法+混合写屏障：并发执行、优先回收生命周期短的
  * 三色标记：白色（不确定，开始STW加入所有对象）黑色（存活）灰色（存活待处理）。取出一个灰色对象（最开始是根对象），遍历子对象标记为灰色，将取出对象改为黑色。循环往复，最后剩余白色对象需要清理。
    * 缺点在于用户可能会修改对象引用，因此go使用写屏障技术，对象新增或更新时为灰色，但只应用在堆上
  * 混合写屏障（保持栈和堆上的变化正确）
    * GC开始时将栈上对象标记为黑色，新建栈对象也标记成黑色（无需STW，减少GC停顿时间）
    * 用户在GC期间堆上新建、修改、删除引用的对象着色为灰色
    * 确保黑色对象不引用白色对象
* 扫描比回收更消耗CPU：堆内存达到阈值（可改触发基数和触发条件）；定时触发；手动触发
  * 火焰图中gcBgMarkWorker占CPU超过10%一般就需要优化了
  * GC优化方向
    * 减少堆对象的分配（GC时要递归扫描所有对象，栈会在函数结束后自动回收）
    * 小结构体用值而不是指针
    * 用匿名函数替代闭包（会延长局部变量生命周期）
    * bigcache存储大对象（[]byte类型只会扫描一次）
    * 用池化优化内存分配
    * 用原子操作选择性替代锁
    * 慎用深度拷贝和反射
    * 将任务主动打散分配到不同机器中
    * 控制回包大小和数据优先级




Go中返回局部变量指针是否安全

* 安全，go会进行逃逸分析（不同于C++）将指针分配到堆区，避免内存泄漏，堆区内存由垃圾回收机制处理，开发者无需担心



> golang中什么变量会分配到栈区，什么变量会分配到堆区
>
> 栈区生命周期短、分配速度快、大小较小、内存连续；堆区生命周期长、分配速度慢、大小较大、内存不一定连续
>
> * **栈区**：生命周期短、大小固定、不逃逸的变量。局部变量、基础数据类型
> * **堆区**：生命周期长、大小动态、逃逸的变量。返回指针、动态大小对象（切片）、全局变量、接口和闭包



协程相比线程/进程优点

* 进程上下文切换负担重，内存使用重
* 协程无需进入内核态，默认栈小，自动收缩没有栈溢出风险
* golang不鼓励程序员直接操作线程和进程，golang不是专门的系统编程语言



为什么会有协程泄露？

* 协程创建之后没有被释放，用waitGroup，context设置超时。go提供了工具检测泄露。
* 接受阻塞、发送阻塞、竞争资源导致死锁、创建协程后未回收。使用GOMAXPROCS控制协程数量（过大会引起线程的频繁切换）



goroutine堵塞情况

* 网络请求、IO、互斥量、通道。Go提供epoll来实现多路复用
* 此时P会将M绑定新G



Go面向对象是如何实现的？

* 封装：大写字母public，小写字母private
* 继承：struct中加入继承的类，可直接调用属性
  * 嵌入式类型 / 组合

* 多态：通过interface实现，赋值interface为对象
  * 任何实现了接口定义方法的类型都隐式实现了该接口（只有方法没有属性）




反射特点

* 运行时检查变量的值和类型，`package reflect`，常用于泛型编程，动态调用对象方法，获取结构体字段信息进行数据库映射（即解析结构体中tag）。会带来一定的性能开销并影响代码可读性



golang内存分配机制

* 微型对象（小于16B）：由mcache.tiny分配
* 小对象：由mcache和mspan管理
* 大对象（大于32KB）：在堆中分配

mcache（每个M的本地缓存，如已满则申请mcentral）、mcentral（全局中心缓存）、mheap（堆内存管理者，以span为一页）

mcache中内存申请和释放无锁，mcentral和mheap中锁粒度小



go没有this指针

* 方法归属的对象显式传递



Go的channel（基于CSP思想 Communicating Sequential Process，通信顺序过程）

* 数据传输、可缓冲、单向、指定数据类型、无数据时阻塞、可关闭、线程安全



channel死锁场景

* 直接读空channel（没有协程写），直接写满channel（没有协程读）
* 解决办法：select + default
* 关闭的channel只能读不能写



什么是go竞态

* 两个或以上的goroutine访问相同资源时候，对资源进行读/写。



若干个goroutine，有一个panic了怎么办？

* 全部退出。若不想，则使用recover()捕获panic修复



golang是强类型语言，不允许隐式类型转换

* 允许安全的基本数值类型隐式转换（比如rune和byte比较都会转成int32）



panic

* 程序遇到无法继续执行的严重错误，立即停止当前函数执行，执行defer()语句，逐级返回，打印堆栈信息
* 空指针、数组越界、数据库连接失败。尽量避免使用panic，多用error
* recover可以用在defer中，用于从panic中恢复继续执行

## 语法知识

* new和make区别
* new用来创建零值对象（分配内存清零），返回指针，适用于基本类型、结构体、数组；make用来创建slice, map, channel，返回引用类型



* 如何进行字符串的高效拼接？
* +会创建新字符串，一般使用strings.Builder、bytes.Buffer和strings.Join。前者使用可变缓冲区，后者将字符串切片连接起来
* 字符串拼接性能：strings.Builder = strings.Join > + > fmt.Sprintf



* defer特点
* 推迟函数执行，方便资源清理和日志记录；后进先出；值传递。可以用来改变返回值（临时变量不能，必须有名返回）

```go
func test() int {
	i := 0
	defer func() {
		fmt.Println("defer1")
	}()
	defer func() {
		i += 1
		fmt.Println("defer2")
	}()
	return i
}

func main() {
	fmt.Println("return", test())
}
// defer2
// defer1
// return 0
// Go会创建一个临时变量保存返回值
```





* inferface特点
* 接口是抽象类型，**空接口可以指向任何类型值**，适用于泛型编程；可以用接口来实现多态
* 可以用`reflect.TypeOf(i)`和`reflect.ValueOf(i)`在程序运行时获取空接口的类型与值，即是动态的



* select特点
* 允许goroutine同时等待多个channel，任何一个就绪都可以执行（随机执行，和 map 一样）



* sync特点
* 多线程同步工具，包括Mutex, RWMutex, Map, Atomic, Pool, Cond, WaitGroup, atomic.Uint64（支持goroutine并发访问的变量，通过Add方法添加）



* sync.Cond
* 通常和互斥锁一起使用，满足特定条件时通知指定goroutine（Wait, Signal, Broadcast）



* sync.Map
* 并发安全哈希表，尤其适合读多写少的场景，避免传统map+mutex的性能瓶颈
* 读写分析：read map是无锁只读Load的快照；dirty map加锁后执行写操作Store / Delete；先查read再查dirty，动态调整同步映射关系



* sync.Pool
* 保存临时对象池，核心是为了**减少高并发下内存分配和垃圾回收压力**。比如在处理HTTP请求时将bytes.Buffer / context池化



* sync.RWMutex
* 机制和MySQL的S Lock和X Lock行为一致。读锁时允许所有线程获取读锁读，彼此间可共存；写锁时只允许一个线程读写



* sync.Mutex / 互斥锁的两种模式
* 互斥锁：一个goroutine获取到后，其他goroutine必须等待
* normal：新请求锁的goroutine更容易获取锁
* starvation：公平排队



* sync.Atomic底层实现
* 采用CAS(CompareAndSwap)，CPU级别的原子性操作



* 什么是rune
* rune为32bit，为Unicode。遍历字符串时，for range 得到的是rune类型，传统索引得到的是 byte类型，字符串本质是只读的[]byte，rune是int32，byte是uint8，在处理一些语言比如中文时，一个byte并不能表示一个文字



* go tag
* 附加在字段上的元数据（反引号字符串），为结构体成员提供属性名称等，比如json序列化，db映射，form验证，通过reflect包解析



* %v/%+v/%#v
* 输出属性值；输出名称和值；输出结构体名称，成员名称和值



* go枚举值
* 用iota表示（从0开始）golang 没有enum关键字（iota (eye-oh-tah) 来源于希腊字母）



* go引用类型
* 切片、通道、字典、指针、接口



* 空struct
* 不占任何空间，可作为信号（比如用map模拟set或者给通道发信号）



* go中int和int32等价吗
* 不等价，go中int和操作系统位数相关



* go中init()
* 在main()之前执行，一个文件可以有多个init函数
* 执行顺序import - const - var - init -main



* 数组和切片区别
* 数组固定长度，切片动态扩展



* slice扩容机制
* append触发扩容，go1.18以后，小容量threshold（256）以下2倍增长；threshold以上1/4倍增长（64）；期望容量过大则直接扩充至预期容量
* 优化：提前用make指定容量减少扩容拷贝次数、适当用copy避免多个slice指向同一个底层数组、用...一次性追加而非遍历追加



* 有缓冲区的channel和无缓冲区的channel区别
* 无缓冲区时，接收方未接受时发送方会阻塞；有缓冲区则不会



* goroutine操作函数
* runtime.Goshed()让出CPU；runtime.Goexit退出协程



* 什么是类型断言？
* 检查接口实际存储值的类型，`value, ok := interfaceValue.(Type)`，如果没有ok断言失败程序会panic
* 用type switch更合理

```go
switch v := i.(type) {
case T1:
    // v 的类型是 T1
case T2:
    // v 的类型是 T2
default:
    // v 的类型不是 T1 或 T2
}
```



* 闭包
* 捕获创建时作用域中变量，延长外部作用域变量的生命周期，通过匿名函数实现
* 常用于延迟执行defer，函数工厂，回调函数

```go
func main() {
    x := 10
    // 定义一个闭包
    closure := func() {
        fmt.Println("x =", x) // 捕获外部变量 x
    }
    closure() // 调用闭包
}
```



- `for range` 遍历 `[]struct` 时，临时变量是结构体的值拷贝，修改不会影响原始切片。
- 临时变量在每次迭代中会被重用，而不是重新分配，因此会指向同一个地址
- 不同类型指针的 `nil` 不能直接比较，赋值给 `any` 类型（即 `interface{}` 类型），它们会被转换为带有类型信息的接口值，因此不相等。
- reslice：通过指针移动完成，和原slice共享底层数据


## 其他杂项

```bash
# 常见的golang命令行工具
# build后unix-like系统中./即可运行，可针对不同的平台加不同的编译tag，也可传-gcflags优化编译
go build main.go
go run main.go
# benchmarking, pprof, coverage
go test
go mod init example/my_module
# 清除未使用依赖
go mod tidy
# 根据go.mod下载依赖
go mod download
# 下载第三方包并更新go.mod
go get github.com/example/package
# 安装可执行文件比如CLI，不改变go.mod
go install example.com/mymodule
```

go get用于下载远程模块到$GOPATH/pkg/mod目录中

go install用于编译并安装本地go模块到$GOPATH/bin中

go的模块名是项目唯一标识符：go mod init [module-name]，不同于package name，它只是代码组织单位

gin用validate检查tag做参数校验

context包用于在多个goroutine间安全传递上下文信息、设置截止日期、同步信号、元信息

主要功能是协程同步取消信号减少资源浪费：多个 Goroutine 同时订阅 ctx.Done() 管道中的消息，一旦接收到取消信号就立刻停止当前正在执行的工作。传值设计很少使用到

代码风格推荐：嵌套不超4层，列数不超过120，行数不超过80，文件不超过500行

const 支持自动隐式类型推断

Generics 泛型编程，适应多种不同的数据类型

Fuzzing 模糊测试，自动化数组随机数据，提升测试健壮性

Timer是单次出发的，Ticker是周期触发的，都可以用time库结合channel实现（Ticker为周期性发送时间的channel，只能读，需要手动 Stop）

Golang Embed Directive 允许在编译时将静态文件（如HTML, CSS, 图片, 配置文件）直接嵌入到go二进制的变量中，使用特殊注释 `//go:embed`，可以简化部署直接访问

常见的编解码方式：sonic, pb, json, yaml

> sonic 是字节开源的高性能golang json编解码库，比官方快2-5倍，且接口兼容，大量使用零拷贝技术，令人惊艳的卓越

Golang官方性能分析工具：

* pprof：profiling，分析CPU占用，内存分配，goroutine信息，阻塞情况，可以生成火焰图
* trace：全链路事件追踪工具，查看并发、调度过程、时序信息，生成时间线

可以用select和time.After轻松实现超时管理

可以用goroutine和channel实现pool池化、rate limiter限流（加上ticker）





