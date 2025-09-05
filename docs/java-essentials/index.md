---
title: Java知识库
date: 2022-09-03
cover: "./cover.jpeg"
tags: 
  - 职业技能
  - 面试
description: "I don't like it because it's fucking everywhere."
---

## Java basics

一次编写，到处运行。字节码.class文件和JVM

优势：跨平台，OOP，Spring框架，社区支持，企业应用，自动垃圾回收

劣势：性能满，语法繁琐，内存占用大

Hibernate是Java的ORM框架

不同平台版本的JVM负责兼容，Golang则是直接编译成不同OS的native binary

JDK>JRE>JVM，JRE包括JVM和一组Java库

Java是编译解释混合模式，JVM解释执行字节码并进行JIT优化（将热点代码编译成机器码）

BigDecimal 可以确保精确十进制数值计算，避免浮点数可能导致的舍入误差。

Boxing和Unboxing：Java基本数据类型和包装类的转换（极致OOP）

重载：同名方法不同参数

抽象类不能实例化只能被继承

静态变量和方法和类关联而不是和实例关联

Java的Error为无法处理的严重问题，Exception则可以用try catch捕获（类似Golang的Error）

Java TreeMap：基于红黑树的有序Map（Golang默认无序，需要用Slice辅助实现）

Java Vector是线程安全Slice，HashTable是线程安全Map（Golang中用sync.Mutex包装和sync.Map）

Golang的for range已经很迭代器化了

HashMap底层，将key映射到某个bucket，碰撞时用链表或红黑树（N/logN）

## Spring basics
Bean：由容器管理的Java对象，代表应用的一部分功能（服务、数据库连接、配置等）

IoC (Inversion of Control)：控制反转，将对象的依赖关系从代码中反转出来，由Spring来创建和管理，不new对象，而是借助IoC实例化

DI (Dependency Injection)：依赖注入，IoC的一种实现具体方式，将依赖注入到组件中，而不是由组件自己创建（构造器注入 / 字段注入），解耦依赖

AOP (Aspect-Oriented Programming)：面向切面编程，将业务不直接相关的切面分离（日志、事务、权限校验、缓存），通过代理拦截，控制何时调用（before / after）

Aspect：切面，包括切入点Pointcut（何时执行）和执行逻辑Advice（执行什么）
模块化

OXM (Object-XML Mapping)：对象和XML间序列化 / 反序列化的映射技术

JMS (Java Message Service)：Java消息中间件标准API

Servlet：服务组件，接收HTTP请求产生HTTP相应

Portlet：门户平台组件，产生页面片段（前端组件）

Instrumentation：运行时增强类功能，调试和部署复杂度较高

SpEL (Spring Expression Language)：运行时表达式模块，
