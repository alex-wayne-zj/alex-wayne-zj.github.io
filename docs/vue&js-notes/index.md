---
title: Vue 和 JS 笔记
date: 2022-03-14
cover: "./cover.jpg"
tags: 
  - 专业
  - 面经
  - 前端
description: "Like it or not. You have to be good at this."
---

# Vue面经

* 详解Vue的双向绑定

v-model：视图中可以改变该值，变化会映射到model（JS变量）中，反之亦然，通常在表单项中使用。

`v-model` 是 Vue 提供的一个语法糖，它实际上是由 `:value` 和 `@input` 两个指令组合而成的。

`数据劫持`+`发布者-订阅者模式`：Vue3通过proxy劫持属性，发布消息给订阅者，触发监听回调渲染视图



* 什么是虚拟DOM，为什么前端框架都使用虚拟DOM

目的是为了优化前端性能，在内存中维护一个轻量级的 DOM 树副本（JS对象），来减少直接操作真实 DOM 的开销

通过diff算法对比状态更新前后虚拟 DOM 树的差异（同层比较、节点复用），计算出最小的 DOM 更新操作。然后将更新操作批量应用到真实 DOM 上。



* 什么是MVVM

- 数据层（Model）：应用的数据及业务逻辑
- 视图层（View）：应用的展示效果，各类UI组件
- 业务逻辑层（ViewModel）：框架封装的核心，它负责将数据与视图关联起来



* v-if和v-for哪个优先级更高

不推荐一起使用，vue2中v-for优先级更高，vue3中v-if优先级更高



* 虚拟DOM中的key和patch是什么

`key` 是虚拟 DOM 中用于唯一标识元素的属性，主要功能是帮助Diff算法识别和复用已有元素

`patch` 是指虚拟 DOM 更新过程中，将新旧虚拟 DOM 树的差异应用到真实 DOM 上的操作。它的主要目的是通过最小化的 DOM 操作来实现高效的更新。



* Vue组件通信方式

vuex全局状态；props和emit/on父子组件通信；provide和inject用于跨层级组件通信；event bus（emit/on的进阶版）任意组件通信



* 说说对vuex的理解

vue的全局状态管理库，单例模式。组件中使用store实例的state访问状态，mutation修改状态，commit提交



* 如何监听vuex数据变化
* watch和store.subscribe()



* vue-router如何补充路由操作

全局前置守卫beforeEach、路由独享守卫beforeEnter或组件内守卫beforeRouteEnter。



* router-link和router-view
* 分别负责路由导航（a标签+path）和组件渲染（占位组件可嵌套）



* Vue性能优化方法

1. 路由中组件懒加载
2. keep-alive缓存组件状态
3. v-lazy懒加载图片
4. 第三方插件（Element-plus）按需饮用
5. 考虑SSR服务器端渲染或SSG静态网站生成



* Vue中的nextTick方法是什么

在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，可以获取更新后的 DOM。

DOM更新是异步执行的，且有一个队列缓冲在同一事件循环中发生的所有数据变更，nextTick方法会在队列中加入一个回调函数



* JS的事件循环机制是什么

它是JS实现异步编程的核心机制。JS是单线程，有以下关键概念

* 调用栈（Call Stack）：主线程中的任务，管理函数调用，后进先出
* 微任务队列（Microtask Queue）：同上
  * 常见的微任务包括：`Promise.then()`（异步操作结果）、`MutationObserver`（监听DOM变化）、`process.nextTick`（下一个事件循环之前执行回调）、`async/await`等
  * 微任务会在当前调用栈清空后立即执行，且优先级高于宏任务。
* 任务队列（Task Queue）：存放异步任务的回调函数
  * 常见的宏任务包括：`setTimeout`、`setInterval`、`I/O 操作`、`UI 渲染` 等
  * 宏任务会在当前调用栈清空后执行。

事件循环机制的核心是不断地检查调用栈和任务队列：执行同步代码，执行微任务，执行宏任务，UI渲染



* 说说对Vue响应式的理解

响应式：数据变化被检测到并对这种变化做后续操作（主要是视图渲染）

MVVM中连接Model和View的关键机制View-Model层

Vue3通过ES6的Proxy代理要响应变化的数据