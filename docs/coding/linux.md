## Info

类UNIX系统：Linux is not Unix

GPL: General Public License. 自由使用，修改，再发布

发行版：Linux内核和应用软件打包

- 发行家族：发行版
- Debian: Ubuntu
- Fedora: CentOS

> POSIX: Portable OS Interface. 定义OS应该提供的服务和API

Linux启动：(首先BIOS硬件开机自检)

1. 内核引导(读入/boot下内核文件)；
2. 运行init(读取配置文件/etc/inittab，并运行开机启动的守护进程daemon)；
3. 系统初始化：激活交换分区，检查磁盘，加载硬件模块以及运行其他脚本；
4. 建立终端(Linux预设提供6个tty终端)；
   1. CTRL+ALT+F1~F6 (F7对应图形界面)
5. 用户登录(命令行/ssh/图形界面)。

> ssh: secure shell 

Linux常见目录含义

- /dev存放device外部设备
- /etc为配置文件 Etcetera
- /lost+found一般为空，系统非法关机后会存放一些文件
- /media识别U盘光驱并挂载设备
- /mnt临时挂载其他文件系统 mount
- /proc系统内存映射进程process
- /sbin: superuser bin
- /usr: unix shared resources 防止用户应用程序和文件
  - /bin & /sbin & /usr/bin & /usr/sbin & /usr/local/bin & /usr/local/sbin: 终端运行命令时在这里寻找执行文件
- /var/log存放日志

d目录 -文件 l链接文档

user - group - others

Linux有硬链接(`ln`)和软链接(`ln -s`)

- 硬链接：不同的文件指向同一个索引inode，删除一个不影响另一个，全部删除后文件才真正删除
- 软链接：另一文件的位置信息，类似快捷方式

用户账号：用户号，用户组，主目录，登录Shell

> shell既是命令语句，也是程序语言，写shell脚本记得chmod +x。Linux默认shell为bash，Mac默认为zsh，其他包括sh, csh, ksh, tcsh
>
> 脚本中#!/bin/bash指明解释器

组有组标识号

/etc/passwd每行记录对应一个用户，该文件对所有用户可见

> 相应的，/etc/group记录用户组信息

用户名:口令:用户标识号:组标识号:注释性描述:主目录:登录Shell

为安全起见，真实口令存在/etc/shadow中

> 0是root用户标识号，1-99系统保留，100-500是普通用户标识号
>
> 登录shell为空的是pseudo users：比如bin, sys, adm, nodbody

使用文件输入和sudo命令`newusers`和`chpasswd`来批量创建用户

> 中间可能用到pwunconv和pwconv关闭和打开shadow功能

Use emacs instead of vi/vim

Linux自带vi，Mac自带vim（还是学vim吧，虽然命令根本记不完）

![img](Linux/vim.png)

虚拟内存：屏蔽底层RAM和磁盘，提供远超实际内存的内存大小

进程中地址：栈在高地址向低地址增长，堆在低地址向高地址增长。栈快，小，程序员管理；堆慢，大，操作系统管理（需要额外CPU）

> shell脚本编程就多求助AI吧，和现代编程语言的习惯差别还是挺大
>
> 比如：
>
> - shell编程不能乱加空格（尽量没有）
> - 用${变量}使用便令
> - 单引号内所有内容原样输出（不允许有变量和转义字符）
> - 不支持多维数组
> - @ / * 下标获取数组所有元素，! 获取数组的键，#获取长度
> - 特殊命令：readonly, unset, declare（可声明关联数组/字典）, $#(参数数量), $?(命令退出状态)
> - expr表达式计算求值，let num++，$((num + 1))
> - -o: ||; -a: &&; -z: =0; -n: len=0; $: =None
> - POSIX定义printf，因此比echo移植性更好
> - 用.和source执行其他文件

$PATH：OS搜索可执行文件的路径

## Linux常用命令

```Bash
# 将数据从内存同步到硬盘中
sync
# 立刻关机
shutdown -h now
# 更改文件属组 / 所有者
chgrp/chown [-R recursive] 属组名 文件名
# 变身超级用户
su
# disk free查看文件系统磁盘空间占用，h表示human
df -h [目录]
# disk used查看文件和目录磁盘空间占用，默认当前目录，-a表示列出文件容量，-m表示MBytes
du -am
# 查看内存和CPU占用
top
# 查看网络带宽情况
iftop
# 从后往前查看文件, cat倒过来
tac [file]
# 取出文件前面/后面几行
head/tail -n [number] [file]
# 显示行号查看文件
nl [file]
# 逐页 / 逐行查看文件
more / less [file]
# 添加用户
useradd [-cdgs] [用户名]
# 删除用户账号和主目录
userdel -r [用户名]
# 修改用户账号
usermod [-cdgs] [用户名]
# superuser有权修改任一用户的密码
passwd [用户名]
# 组类似
groupadd / groupdel / groupmod
# 用户属于多个组时，登录后可切换
newgrp [新组]
```

fdisk用于磁盘分区表操作，mkfs用于文件系统格式化，fsck用户检查和维护不一致的文件系统，mount用于磁盘挂载

[常见Linux命令全拼](https://www.runoob.com/w3cnote/linux-command-full-fight.html)

### apt常用命令

> apt(Advanced Packaging Tool)：被用于Debian和Ubuntu
>
> yum(Yellow dog Updater, Modified)：被用于Fedora, RedHat, SUSE的包管理工具
>
> yum命令包括check-update, update, install, list, remove, search, clean
>
> 包管理工具一般用国内源：清华源，网易源，阿里源，中科大源

```Bash
# 更新包列表索引，列出可更新软件清单
apt update
# 升级软件包，和update搭配使用
apt upgrade [package]
apt install [package] -y
apt show [package]
apt remove [package]
apt autoremove
apt search [package]
# 移除软件包及其配置
apt purge [package]
apt list --installed
```

find：根据文件属性（文件名，路径，大小，修改时间等）查找文件或目录

grep：读取文件内容并输出匹配正则表达式的行

stdin: 0, stdout: 1, stderr: 2

\>> 重定向追加，>&输出文件合并，重定向到/dev/null（运行但不输出结果）
