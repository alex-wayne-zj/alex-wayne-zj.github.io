---
title: Golang 笔记
date: 2023-07-20
cover: "./cover.jpg"
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

## 核心机制

golang语言特点（对比其他语言）

* 简洁、高级语言、协程天然支持多并发（云原生）、C++般的性能、生态堪比Java / Python
* 多线程方面：C++使用系统级别的原生线程API；Python通过threading创建多线程，但受制于GIL，同一时刻只能有一个线程运行；Golang通过用户级线程goroutine实现并行



什么是GMP调度模型？

* Golang运行时（runtime）用于管理 **协程（goroutine）** 的核心调度机制（天然支持高并发）：协程、线程和调度器/处理器(Goroutines, Machine/Thread, Processor)。协程是用户级轻量线程，线程是运行goroutine的实体，P有一个协程队列
  * G添加到P队列中（如果都满了添加到全局队列中），P取G绑定M执行，阻塞时换绑M到其他G，队列为空时从其他P中拿G
  * 最多有GOMAXPROCS个活跃线程能运行，默认为内核数
* **自旋线程**：处于运行状态但是没有可执行goroutine的线程
* 没有P层锁竞争会影响性能



go垃圾回收

* （已不用）标记清除：从根对象出发遍历标记所有可达对象，GC扫描堆清除未标记对象。缺点是需要STW(Stop The World)；
* （目前）三色标记法+混合写屏障：并发执行、优先回收生命周期短的
  * 三色标记：白色（不确定，开始STW加入所有对象）黑色（存活）灰色（存活待处理）。取出一个灰色对象（最开始是根对象），遍历子对象标记为灰色，将取出对象改为黑色。循环往复，最后剩余白色对象需要清理。
    * 缺点在于用户可能会修改对象引用，因此go使用写屏障技术，对象新增或更新时为灰色
  * 混合写屏障（保持栈和堆上的变化正确）
    * GC开始时将栈上对象标记为黑色，新建栈对象也标记成黑色（无需STW，减少GC停顿时间）
    * 用户在GC期间堆上新建、修改、删除引用的对象着色为灰色
    * 确保黑色对象不引用白色对象



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



为什么会有协程泄露？

* 协程创建之后没有被释放，用waitGroup，context设置超时
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
* 允许goroutine同时等待多个channel，任何一个就绪都可以执行（随机执行）



* sync特点
* 多线程同步工具，包括Mutex, RWMutex, Map, Atomic, Pool, Cond, WaitGroup



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
* rune为32bit，为Unicode。string遍历时要么为rune，要么为byte



* go tag
* 附加在字段上的元数据（反引号字符串），为结构体成员提供属性名称等，比如json序列化，db映射，form验证，通过reflect包解析



* %v/%+v/%#v
* 输出属性值；输出名称和值；输出结构体名称，成员名称和值



* go枚举值
* 用iota表示（从0开始）



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
* 捕获创建时作用域中变量，延长生命周期，通过匿名函数实现
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





## 其他知识点

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

gin用validate检查tag做参数校验

什么是中间件？

Middleware（通常）是一小段代码，它们接受一个请求，对其进行处理，每个中间件只处理一件事情，完成后将其传递给另一个中间件或最终处理程序，这样就做到了程序的解耦。比如说处理跨域问题

context包用于在多个goroutine间安全传递上下文信息

golang主动申请内存