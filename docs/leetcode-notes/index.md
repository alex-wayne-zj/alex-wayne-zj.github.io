---
title: LeetCode 刷题笔记
date: 2022-03-14
cover: "./cover.jpg"
tags: 
  - 专业
  - 面经
description: "Like it or not. You have to be good at this."
---

## 算法与数据结构 

> 一行说尽关键思路

### 数组篇

* 合并有序数组：倒过来
* 原地移除数组val值 & 删除有序数组重复元素：原数组当新数组覆写
* 和为k的子组合：数学运算 + 前缀和
* 多数元素：转化成子问题
* 传送门：保留i点可达最远距离
* 旋转数组：三次reverse
* 数组中超过一半的数字：刚好到一半时，剩下的数组中它一定超一半
* 加油站：直接跳到无法抵达的下一个站点，把它作为起点
* 三数之和：排序+剪枝（j和k的相遇问题）
* 环形子数组最大和：两个数组合并 + 滑动窗口
* 分割等和子集：另类零一背包，target为sum / 2，dp\[i]\[j]为从0-i个数中选出和为j是否可能

### 链表篇

* 合并两个有序链表：新开一个用于记录结果的链表
* 反转链表：保留next
* 反转链表2：边界情况
* LRU缓存：键为key值为node的哈希表读写，双向链表记录最近使用顺序，头尾为影子节点
* 检测链表是否成环：哈希表 || 快慢指针
* 相交链表：哈希表 || 快慢指针轮换（总路程都是x+y+n）
* 两数相加：边界情况的充分考虑
* 重排链表：数组存 || 快慢指针找链表中点 & 反转链表 & 合并链表

### 哈希表篇

* O(1)时间插入、删除、获取随机元素：变长数组 + 哈希表
* 两数之和：哈希表加速
* 小美架炮：哈希表排序

### 栈与队列篇

* 下一个更大的数：**单调栈**
* 循环数组中下一个更大的数：重复数组
* 两个栈实现队列：入队时往一个栈push，出队时往一个栈pop，栈顶出队，再倒回第一个栈
* 包含min函数的栈：维护一个单调栈用于输出min
* 有效括号序列 & 最长有效括号子串
* 最近请求次数：t-3000以前的全部弹出
* 十亿个数中找最大的20个数：建立一个小根堆并维护（堆顶最大）

### 字符串篇

* 字符串排列 & 无重复字符的最长子串：滑动窗口+哈希表
* Z字形变换：flag构造，多行字符串join
* 去除重复字符返回字典序最小子序列：单调栈 + 出现哈希表 + 剩余出现次数。单调栈的贪心变体

### 数学与位运算篇

* 剪绳子：都剪成3
* 数字范围按位与：两端右移找共同前缀，补零得到结果
* rand5()生成rand3()和rand7()：拒绝采样，如果生成的随机数满足要求，那么就返回该随机数，否则会不断生成
  * ((rand5() - 1) * 5 + rand5()) % 7 + 1

### 递归、剪枝与回溯

* 组合：dfs变体，记得copy切片
* 岛屿数量：“四面八方污染”
* 字符串排列：下标map辅助递归，回溯时撤回map和str
* 水壶问题：每次倒水只有若干种选择 + map记录 & 数学方式 ax+by = z当且仅当z是a&b最大公约数的倍数
* 字典序排数：O(1)算法深度优先搜索，剪枝条件`num + 1 > n || num % 10 == 9`

### 贪心篇

* 买卖股票的最佳时机：低买高卖
* 最大子数组和：滚动更新，子数组和与当前值的比较
* 跳跃游戏：记录最远距离
* 主持人调度：开始和结束时间分别排序，最早结束时间和开始时间对比

### 排序与二分

* 常见排序算法：插入、归并、快速
* 寻找峰值：log n算法
* 数组逆序对：归并改写，注意细节
* 旋转数组的最小数值：类似寻找峰值，但有个判等缩小范围的细节
* 堆排序：小顶堆，大顶堆
* 合并区间：按start排序interval然后贪心

### 树与二叉树篇

* 中序和后序/前序遍历二叉树：根结点（记录索引） + 中序递归 + 函数内函数（参数为中序两端）
* 反转二叉树&遍历二叉树：递归
* 验证二叉搜索树：上界与下界辅助
* 二叉搜索树和双向链表：数组存即可（递归也有空间复杂度，解决问题优先）
* 合并二叉树 & 二叉树镜像：分治递归思维
* 二叉树最低公共祖先：递归判nil和值返回节点，某节点为nil则返回另外的节点

### 动态规划篇

* 重叠子问题 + 最优子结构 & 状态 + 状态转移方程 + 初始条件
* 0/1背包问题 & 打家劫舍：动态规划
* 打家劫舍2：两种情况
* 最长递增子序列：状态（以第i个数结尾的ans）& 最长公共子序列 & 最长公共子串 & 到达右下角：状态（以第i/j个字母结尾ans）
* 最长回文子串：对每个点分奇数偶数情况判断是否为回文串
* 编辑距离：抽象出状态转移方程 + 初始条件思考
* 放苹果：f(m, n) = f(m, n-1) + f(m-n, n)，至少一个为0和全部不为0
* 最大正方形：最长边
* m分钟读n页书：两种状态（读到第n页和用读一页的能力次数）
* 跳台阶：first + second（最后一步一定不同）
* 兑换零钱：初始情况都赋值为aim+1

### 图篇

* BFS & DFS
* 拓扑排序：课程表先修课程
* 并查集
* 最小生成树
* 最短路径

* 滑动窗口专题
  * 长度最小的数组：记录小于target的最短数组，中途记录最小值
* 二分查找专题
* 双指针专题
  * 盛水最多的容器：头尾指针，小者移动（剪枝）
* 前缀和专题

### 智力题

* 老鼠试毒药：每一只老鼠当做一个二进位，混杂毒药试吃

* 5L和6L的桶精确装4L水：小桶往大桶填水

* 25匹马，5个赛道，最少需要比赛几次才能知道前3名：5+1+1

* 13个石头一个比较重，天平测量几次：

With Golang (1.23.6)

go1.21后引入了`slices.Reverse`和`cmp.Max`等常见方法

## Golang 常见库函数

```go
// 定义函数
var build func(int, int) *TreeNode
// 快速创建哈希表，golang中可用map替代set
m := map[int]int{}
// 创建树节点
root := &TreeNode{Val: root_val}
// Int类型最大值
math.MaxInt
// 计算乘方
math.Pow(3, float64(x))
// 平方根
math.Sqrt(float64(x))
// 获取0～n-1间的任意值
import "math/rand"
rand.Intn(n)
// 创建二维切片
dp := make([][]int, n)
for i := range dp {
    dp[i] = make([]int, m)
}
// 排序
sort.Ints(nums)
sort.Strings(strs)
// 反转
sort.Reverse(nums)
// 初始化一个空切片
nums := []int{}
nodes := []*TreeNode{}
// 拼接切片
arr1 := append(arr1, arr2...)
// 复制切片，长度若不相等，则按照较小长度进行复制
copy(dst, src)
// 判断substr是否是s的子串
strings.Contains(s, substr string) bool
// 遍历有效字符rune/int32，正确得到UTF-8编码
for _, c := range str
// 遍历byte/uint8，字符串只包含 ASCII 字符适用
for i := 0; i < len(str); i++	
// 根据键删除哈希表中值
delete(m, k)
// 清空哈希表
clear(m)
// golang读取标准输入，n表示实际读取个数，e表示error
import (
    "fmt"
    "io"
)

func main() {
    var a, b int
    for {
        _, err := fmt.Scan(&a, &b)
        if err == io.EOF {
            break
        }
        fmt.Println(a + b)
    }
}
// golang标准，每行有不定个数据按空格分隔
import (
    "bufio"
    "fmt"
    "os"
    "strconv"
    "strings"
)

func main() {
    inputs := bufio.NewScanner(os.Stdin)
    for inputs.Scan() {  //每次读入一行
      // 将str转化成[]rune: []rune(inputs.Text())
      // 将[]rune转化成str: string(runes)
      // 通过空格将他们分割，并存入一个字符串切片
        data := strings.Split(inputs.Text(), " ")  
        var sum int
        for i := range data {
            val, _ := strconv.Atoi(data[i])   //将字符串转换为int
            sum += val
        }
        fmt.Println(sum)
    }
}
// rune的字母/数字操作
import "unicode"
unicode.IsLetter(r)
unicode.IsUpper(r)
unicode.IsLower(r)
unicode.IsDigit(r)
unicode.ToUpper(r)
unicode.ToLower(r)
// 最大公约数，最小公倍数为a * b / gcd
func gcd(a, b int) int {
    for b != 0{
        a, b = b, a % b
    }
    return a
}
// golang中位运算（基本与C一致）：a & b, a | b, a ^ b, ^ a (按位取反), a >> n, a << n
// golang在函数外声明全局变量
// 字符串转化成int类型
strconv.Atoi(s)
// 传递函数切片时实际传递的是切片副本，比如传地址才能使改变长度生效
// 如果直接修改元素则不需要传地址，因为切片副本和切片共享底层数组
func main() {
  slice := []int{}
  modifySlice(&s)
}
func modifySlice(s *[]int) {
  *s = append(*s, 200)
}
// 快速排序
func quicksort(a []int, low, high) {
  num := a[low]
  i, j := low, high
  for i < j {
      for i < j && a[j] >= num {
          j --
      }
      a[i] = a[j]
      for i < j && a[i] <= num {
          i ++
      }
      a[j] = a[i]
  }
  // 关键
  a[i] = num
  
  quicksort(a, i+1, high)
  quicksort(a, low, i-1)
}
// 根据对象属性排序
sort.Slice(intervals, func(i, j int) bool {
  return intervals[i].Start < intervals[j].Start
})
// 数字转成字符串
strconv.Itoa(num)
// golang for循环中len(nums)不会导致性能瓶颈，因为是O(1)时间，只是读取底层值

// 多协程编程
func main() {
	total := 0
	numWorkers := 10
	ch := make(chan int)
  // sync.WaitGroup是等待一组 goroutine 完成的工具。它通过计数器机制实现同步，常用于并发任务的管理。
  // Add +1 & Done -1 & Wait 阻塞等待
	var wg sync.WaitGroup

	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func(workerID int) {
			defer wg.Done()
			sum := 0
			start := workerID*1000 + 1
			end := (workerID + 1) * 1000
			if workerID == numWorkers-1 {
				end = 10000
			}
			for j := start; j <= end; j++ {
				sum += j
			}
			ch <- sum
		}(i)
	}

	go func() {
		wg.Wait()
		close(ch)
	}()
	for partialSum := range ch {
		total += partialSum
	}
	fmt.Println(total)
}
```