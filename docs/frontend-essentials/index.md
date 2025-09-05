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

## HTML

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

## CSS

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

position五个值：

* static默认
* fixed相对屏幕固定同时脱离文件流
* relative相对于父节点，常用与absolute的容器，这两者都能用top left right bottom调整位置
* sticky正常相当于relative，设置四个方向后可以在滑动后变成fixed

z-index可以用来改变元素显示层级

display常见有none，block，inline（不可设置宽和高，竖直方向上的margin和padding无效），inline-box（inline不换行，具有宽高），flex

元素浮动后display值自动变成block：

* 元素浮动后会脱离常规文档流，影响页面整体的排布结构，父级元素无法被撑开，同级元素会紧随其后。
* 清除浮动可以用clear: both; 或者用flex布局替代浮动呈现效果

link是XHTML标签，@import只能加载CSS。前者是页面载入时同时加载，后者是页面完全载入后才加载。link支持JS控制DOM改变样式，@import不支持。一般推荐用link

五种前端布局：table / flex / grid / absolute / float

flex是轴线布局，即一维布局；grid是二维网格布局，划分行列产生单元格，功能很强大，但目前学习成本相对较高，且兼容性不如flex

dpi: dots per inch，一般用在印刷行业，dot类似于印刷行业的px

响应式布局——一个网站兼容多个终端，而不是为每个终端做一个特定的版本。它不会缩放东西，而是根据当前窗口尺寸决定显示哪些内容。实现的话应用到了flex布局和流式布局百分比宽度。

CSS3的media query即@media获取当前设备的属性调整rem，设置viewport的width为device-width

vw: viewport width和vh: viewport height分别是1%视口宽度和1%视口高度；vmin和vmax分别指vw和vh中的较小值和较大值

圣杯布局和双飞翼布局：两边等宽，中间自适应。中间栏放在文档流前面优先渲染

margin-left和margin-right可以设置负值，左右盒子会跟过来覆盖，但元素本身大小其实不变

浏览器怪异模式：浏览器用自己的方式解析执行代码（主要是在标准化之前浏览器有自己的实现方式）
      
网页内容（包括CSS 和 JS）从上到下顺序渲染