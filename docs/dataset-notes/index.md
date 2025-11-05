---
title: 数据库笔记
date: 2021-10-04
cover: "./cover.jpg"
tags: 
  - 面试
  - 数据库
  - 职业技能
description: "The core of the whole universe."
---

## 非关系型数据库-Redis

**Re**mote **Di**ctionary **S**ervice：互联网领域最广泛的缓存中间件

Redis: 开源，服务器内存存储，基于键值对的NoSQL，读写性能非常出色。常作为热点数据缓存，或者分布式锁、计数限流器（令牌桶，原子操作）、简易消息队列

**Redis持久化机制**

* RDB(Redis Data Backup一次性的全量备份数据快照，二进制存储)

  * 通过save（会阻塞）和bgsave（创建子进程备份，推荐）手动触发。恢复时效率高，构建时间长，损失数据可能更多

  * > redis.conf中设置save 300 10，表示如果至少有 10 个键被修改，300 秒后自动触发一次 RDB 持久化。

* AOF(Append-Only File，持续性的增量备份，日志存储，所有写操作)

  * 实时性数据持久化，目前主流。重启时先查AOF再查RDB
  * AOF缓冲区 & AOF文件
  * 刷新策略：always, everySec(default), no
  * AOF文件过大 - fork子进程重写AOF文件 - 主进程替换旧AOF文件

* 混合持久化（Redis4.0引入）

  * 生成一份RDB快照，作为AOF的一部分
  * 多节点时通过repl_backlog_buffer缓冲区比较主从偏移决定是增量同步还是全量同步


**Redis单线程为什么性能好**：内存存储，多路复用IO，单线程无需切换上下文，数据结构简单，网络协议简单

**五种基本值数据类型**（键始终是字符串）

* string：类似golang有len和cap
  * Simple Dynamic String: 字节数组，维护 len, alloc, buf[]
  * 二进制安全，可存储任意数据，支持位操作和数值操作
* hash：缓存对象
* list：消息队列
* set
* zset（有序集合）：排序属性score
  * 底层结构：跳跃表和哈希表。跳跃表按score顺序存储member，基于多层有序链表实现，查找复杂度O(LogN)
  * B+树存储数据相比跳表，需要的磁盘io更小（跳表层数会过高），查询复杂度为O(logn)，最大层高64，实现复杂度比B+树低，但性能相近
  * 在元素规模较小时使用压缩列表（新版本已废弃）

四种扩展数据类型：BitMap（位图，Git年提交记录，极其省空间），GEO（将二维的经纬度转换为一维的分数存储地理信息），Stream（实现消息队列功能最完善的方案），HyperLogLog（估算海量数据中不重复的元素数量，只占12KB）

Redis6.0后使用多线程处理关闭文件、AOF刷盘、释放内存、网络IO等耗时操作，命令解析和执行仍然是主线程完成，充分利用CPU多核

为什么选择单线程：无需考虑锁和同步机制，方便原子化操作，IO密集型而非CPU密集型，单线程足矣

Redis 三种高可用模式：

* 主从复制模式：主节点（写）和从节点（只读），数据从主节点单向复制到从节点，读写分离，适合读多写少场景。故障需要手动切换
* 哨兵模式：主节点down掉，从节点自动升级为主节点，哨兵节点不存储数据
* 集群模式：Redis分片存储，也有主从复制，自动重定向和自动故障接管

主节点下线后（主观或断线）Raft算法选举主节点

布隆过滤器：判断一个元素是否存在于集合中，一个位图和多个哈希数组，如果为1可能存在，如果为0一定不存在。内存占用小，执行速度快

Redis延迟约1ms（QPS10w，4核8G），比MySQL快100倍（QPS1w），可拦截80%以上请求

> MySQL指标：单表百万行，TB级别（建议GB级），默认连接数百级别，主从同步延迟秒级，慢查询0.1秒，

通读缓存 read-through cache：对应用透明，比如CDN, nginx反向代理缓存

旁路缓存 cache-aside：应用负责查询和加载，缓存仅作为数据存储层。适合业务复杂场景

定期删除：每隔一段时间随机抽取一定量key进行过期检查。惰性删除（访问才删）

缓存脏读问题：cache aside应用自己处理；等TTL过期；数据库更新事件驱动缓存失效

用 Redis 实现分布式锁：NX实现不存在才插入返回成功，PX 1000设置超时时间。unique_value执行删锁，证相同计算仅执行一次避免重复劳动

通过Lua脚本和Redis事务保证原子性

Redis大key问题：key 很小，value 很大，内存占用过高性能下降，导致网络拥塞、持久化变慢、请求变慢、同步变慢。解决方式：拆分大 Key，用多个 Key 存储；压缩数据；更换存储方式。

AOF缓冲区的刷盘策略：always、everysec、no（由操作系统自行决定）

AOF重写：fork数据副本，生成重建它们需要的最少命令。此时命令会写入两次

Redis 内存淘汰机制：内存达到阈值时的策略，不接收新数据、淘汰过期键、淘汰任意键

Redis缺点：内存成本高，容量有限；持久化层面有1秒的不一致风险，分布式异步复制也可能宕机导致主从不同步；不支持SQL和回滚（不适用海量冷数据存储、强事务、多表关联查询等）

主从不一致解决方案：保证网络稳定，WAIT强一致性、引入监控、告警和修复机制

> Redisson是Java客户端封装

> Memcached相比Redis只支持简单的key-value存储，无数据持久化机制

如何解决热key问题：

* Server本地缓存
* 热key分片
* 备份从节点分担读压力
* key预热，提前加载到缓存

```bash
# 常用命令
# 1. 字符串
SET key value
GET key
DEL key
INCR key
DECR key
# 2. 哈希表
HSET key field value
HGET key field
HGETALL key
HDEL key field
# 3. 列表
LPUSH key value
RPUSH key value
LPOP key
RPOP key
LRANGE key start stop
# 4. 集合
SADD key member
SREM key member
SMEMBERS key
# 5. 有序集合
ZADD key score member
ZRANGE key start stop [WITHSCORES]
ZREVRANGE key start stop [WITHSCORES]
ZREM key member

# SET常用参数
# 1. 设置过期时间10秒
SET key value EX 10
# 2. 设置过期时间10000毫秒
SET key value PX 10000
# 3. 仅在键不存在时，才对键进行设置操作
SET key value NX
# 4. 仅在键已经存在时，才对键进行设置操作
SET key value XX

# 对redis进行基准测试，一般QPS几十万
redis-benchmark -h 127.0.0.1 -p 6379 -c 50 -n 10000
```

## 非关系型数据库-其他

Doris / Cassandra：分布式、列式存储的OLAP（在线分析处理）数据库，专为大规模数据分析和高并发查询设计。

> 数据查询更高效，压缩率更高，允许 CPU SIMD 单指令多数据优化

MongoDB: 分布式文件存储开源数据库系统，以BSON(Binary JSON)文档存储，处理大量非结构化和半结构化数据。支持JSON查询文档中内嵌对象和数组

> 相比 MySQL 适合 **更大数据量（还能水平分片，PB vs TB），数据字段频繁变化，写入性能高**，一致性更弱
>
> 写入性能更好：无需遵循表结构、数据类型约束、外键约束等，只是 append 一份文件

MongoDB索引用B树：B-树每个节点都存储数据，相邻的叶子节点之间没有指针链接。适合单条数据查询不适合范围查询（核心）

> B-树还用于老数据库索引（MyISAM）和操作系统文件系统索引
>
> 红黑树一般用于Ordered Hashmap，牺牲搜索时间复杂度但是有序

图数据库常见应用场景：社交网络、推荐系统、知识图谱、网络拓扑、欺诈检测、权限管理。Neo4j（开源且流行）：Node + Edge/Relationship，Cypher 语言（类似SQL）

InfluxDB：开源时间序列数据库

Firebase：实时数据同步的 NoSQL数据库

## 关系型数据库-基础

ACID: atomicity, consistency, isolation, durability

MVCC(Multi-Version Concurrent Control): 数据库并发控制技术，用于提高数据库的并发性能和事务隔离性。核心思想是提供快照，不直接修改数据，防止读写冲突。每个版本都有一个时间戳或事务 ID，用空间换时间。

* 脏读：B修改，A读取B修改后数据，B出错回滚数据恢复，A读到脏数据。一个事务读取了另一个未提交事务修改的数据。

* 不可重复读：前后多次读取数据内容不一致，针对update和 delete操作。一个事务在多次读取同一数据时，由于其他事务的修改，导致读取到的数据不一致。

* 幻读：一个事务在多次查询同一范围的数据时，由于 insert 和 update 操作需要用到当前读，导致查询结果集不一致（尤其指记录数量不一样，出现幽灵行）。两次纯 select 不会幻读

**数据库隔离级别**依次提高：read uncommited, read commited(SQL Server, Oracle默认级别), repeatable read(MySQL默认级别), serializable(完全串行，很少使用)

> 可重复读级别读的是同一个read view，而已提交每次会读当时生成的read view
> 
> 只有普通查询是快照读

mysql 是如何实现不同隔离级别事务的

数据库的1+N问题，join一下

数据库Failure Modes：故障模式，依靠备份与恢复、事务机制、冗余和复制、日志等等

红黑树：自平衡的二叉搜索树，可确保树的高度相对平衡，防止退化成链表的情况

**数据库范式**

* 1NF：属性不可再分
* 2NF：消除非主属性对码的**部分依赖**，使得非主属性都依赖于主键（订单表：order_id和customer_id为主键，customer_name对主键存在部分依赖，所以需要拆表）
* 3NF：消除非主属性对码的**传递依赖**（学生住处表：deparment_name表依赖department_id进而依赖主键student_id，存在传递依赖）

**查询性能差的可能原因**

> 生产环境中，超过1秒都可以被看作慢SQL

主要就是IO（数据量）和CPU（计算）

* 无索引全表扫描
* 多表Join
* 嵌套子循环+数学计算

explain和慢查询日志进行排查

> explain字段：type查表方式（索引、常量、范围、全表），行数，extra信息

**如何优化数据库性能**

* 分库分表
* 读写分离：读操作去从库，写操作去主库
* 对热点数据添加Redis缓存
* 添加索引优化（大部分）覆盖索引

**索引**

索引是加快数据库检索的数据结构，单列索引和聚簇索引，会降低更新表速度（因为也需要更新索引文件），此外索引文件也需要占用空间。一般使用B树/B+树数据结构

* 哈希索引：等值查询，不适用范围查询和排序
* 全文索引：基于倒排索引，用于文本检索，支持模糊匹配
  * 倒排索引：词项到文档的映射
* B+树索引：通用索引

B-Tree：自平衡多路搜索树，常用于在磁盘等外部存储设备中高效存储和检索数据。

* 假设数据为[key, value]，d为度，每个非叶子结点由n-1个key和n个指针组成，d<=n<=2d，树高相同。
* 特点：多叉；叶子结点在同一层；每个节点包含key和指针；关键字升序排列

B+Tree：B-树变体，主要用于数据库和文件系统的索引。

* 查找和更新时间复杂度为O(logN)，查询速度稳定（每查询一次索引节点都是一次磁盘IO）
* 冗余的非叶子节点不存数据，因此可以存放更多索引，插入删除时树变化小，效率更高
* B+Tree节点有重复元素，只有叶子结点存储数据指针，组成有序链表，便于范围查询.

<img src="./2Btrees.png" alt="描述" loading="lazy"/>

索引相关

* 主键索引要求主键唯一且不为NULL，唯一索引允许有NULL值但不允许重复，普通索引允许重复值和NULL值，
* 最左前缀匹配原则：使用复合索引/复合索引时优先使用最左边的列。查询条件必须包含索引最左边的列，只要存在就能使用。
* 索引下推(Index Pushdown)：数据库查询优化，在**存储引擎层**中使用索引来提高查询性能（主要联合索引，遍历时利用 where 条件减少回表）。
* 覆盖索引：查询可以完全通过索引完成，select和where都在索引中
* 聚簇索引：索引和数据不分开，每张表只能有一个，一般是主键，无需回表（磁盘地址），可以是联合索引
* 前缀索引：针对字符串优化
  * 在内存中组织形式：字典树Trie或哈希表，由 B-树实现
  * 字典树：每个节点存储一个字符，从根节点到叶子节点的路径表示一个完整的字符串。每个节点有一个标志位，表示该节点是否为某个字符串的结束位置。


适合建立索引的列：常用于查询、有区分度、更新频率低

一般在业务数据 ID 外新建一列作为主键，一般是自增 ID

索引失效情况（使用索引情况可以通过explain查看）

* 索引列使用函数表达式
* 使用不等于或NOT
* LIKE通配符在前缀部分或不满足复合索引的最左匹配
* 类型不匹配

ER图(Entity-Relationship Diagram)：Entity(square); Attribute(circle); Relation(菱形)

不推荐使用外键和级联：DELETE和UPDATE都要考虑外键约束，增加开发复杂性，在复杂系统开发（实时性和并发性高）场景中不适合

深分页问题：LIMIT offset, count; MySQL会先扫描再扔掉前offset行；把条件转移到有索引的子查询中或者用between...and...

**缓存穿透**：查询不存在数据，每次都访问db；解决方式加布隆过滤器

**缓存雪崩**：key有过期时间，缓存在同一时间失效；解决方式在原有失效时间加一个随机值

**缓存击穿**：某个热点数据失效时有大量并发请求打到数据库；解决方式让热点key提前刷新

MySQL：轻量、开源、简单、高并发OLTP

其他数据库选型：

* PostgreSQL：支持更复杂的数据关系和业务逻辑，开源，比肩企业版Oracle
* NoSQL：数据模型多样易变，事务优先级弱于可扩展性

自查清单：OLTP or OLAP？数据模型固定还是多变？数据量级？并发峰值？允许延迟？ACID事务支持？可扩展性

## 关系型数据库-MySQL

>  Oracle开源的关系型数据库

**MySQL架构**

1. 连接层 Connection Layer
   * 负责处理客户端与服务器之间的连接。
   * 支持的连接方式包括 TCP/IP、Unix 套接字（本地通信机制）等。
   * 连接池（Connection Pool）用于管理客户端连接，提高性能。
   * 认证和权限管理：验证用户身份并检查其访问权限。
2. 服务层 Server Layer
   * 负责 SQL 语句的解析、优化和执行。
   * **查询解析器（Query Parser）**：将 SQL 语句解析为内部数据结构（抽象语法树）。
   * **查询优化器（Query Optimizer）**：选择最优的执行计划（如索引选择、连接顺序等）。
   * **查询缓存（Query Cache）**：缓存查询结果，提高重复查询的性能（MySQL 8.0 已移除）。
   * **执行引擎（Execution Engine）**：执行优化后的查询计划，并返回结果。**写入binlog也在这一层**
3. 存储引擎层 Storage Engine Layer
   * 负责数据的存储、检索和管理。
   * 支持多种存储引擎（插件式，可按需扩展）
     * **InnoDB**：支持事务、行级锁、redolog 崩溃恢复、外键支持、MVCC，适用于高并发场景（默认引擎）。
     * **MyISAM**：不支持事务，表级锁，适用于读多写少的场景（被InnoDB取代），非聚簇索引要查两次
     * **Memory**：数据存储在内存中，速度快但数据易丢失。
     * **Archive**：适用于存储归档数据，压缩率高。
   * 切换数据存储引擎`ALTER TABLE your_table_name ENGINE=InnoDB;`（不建议）
4. 文件系统层 File System Layer
   * 数据文件（.ibd、.myd）：存储表数据。
   * 索引文件（.myi）：存储索引。
   * 日志文件（binlog、redo log、undo log）：用于事务和恢复。

其他模块：日志模块、复制模块等

查询SQL执行：客户端SQL语句 - 连接层 - 解析器 - 优化器 - 执行器 - 存储引擎

更新SQL执行：服务层执行器和存储引擎层紧密结合。redolog有两阶段（prepare和commit）中间在服务层写binlog

创建表时生成的文件：字符集和校验规则、数据表结构、数据

**MySQL数据存储形式**

* 段 segment：数据段、索引段
* 区 Extent：一个区包含64个页，1M数据
* 页 Page：基本单元 16KB，索引树上的一个节点
* 行 Row：行格式包括COMPACT、REDUNDANT、DYNAMIC（MySQL默认，超过了页内联存储的限制，则会被存储在溢出页中）

Buffer Pool (InnoDB)：以页存储的内存缓冲区，脏页定期写入磁盘

**MySQL的锁**

按粒度划分

* 全局锁：对数据库实例加锁，只允许读，一般用于数据库迁移备份
* 表锁：开销小、加锁快、影响大、不会出现死锁
* 行锁：开销大，加锁慢、并发高、会出现死锁
* 页锁：二者之间

按兼容性划分

* 共享锁 S Lock / 读锁：不阻塞，允许多个事务读，不允许写
* 排他锁 X Lock / 写锁：阻塞，只允许一个事务读写

如何显式加锁

* 读锁：select + ... for share
* 写锁：select + ... for update

按加锁机制划分

* 乐观锁：认为冲突概率低，提交事务时才检查（写冲突严重时性能反而下降）
* 悲观锁：认为冲突概率高，数据处理时主动锁定数据（并发性能差）

乐观锁如何实现：版本号与时间戳机制，ABA，提交更新时检查 version 是否一致

间隙锁：mysql在可重复读隔离级别下防止幻读的锁，没有完全解决（直接改 id 为 5 的数据）

> 实际上是 Next-Key lock：记录锁（防止已有记录被修改）和间隙锁（保证范围内不会插入新行）

**MySQL常见log**

* 二进制日志binlog：记录所有数据修改（sql 语句，不包括select和show），用于复制和恢复，MySQL服务器层
  * 需要在my.ini设置，每个binlog文件最大为100MB，有过期时间防止磁盘占用过多
  * binlog格式：Statement（记录执行SQL语句，占空间更少）、Row（记录数据变化，一致性更高）、Mixed

* Redolog：记录事务修改，用于崩溃恢复（ACID 的持久性，物理数据页级别，非SQL级别），InnoDB特有日志
  * 事务ID，页ID，偏移量；记录修改后数据，结合Write-Ahead Logging保证在磁盘顺序写的持久化。
  * 刷盘机制
    * 同步：同步写入磁盘，数据不会丢失但需要等待磁盘I/O
    * 异步：先写入内存缓存，性能高但有丢失数据风险，定期触发刷入磁盘
  * 刷盘策略：定时、强制（缓冲区慢）、事务提交
  * 固定大小环形写入
  
* undolog：回滚日志（ACID 的原子性，记录事务开始时数据被修改前的值）InnoDB提供
* 错误日志
* 慢查询日志
* 通用查询日志

> 建议别用，Join: inner, outer(null填充), left, right，配合on设置条件

两阶段提交：

1. Prepare：InnoDB将redolog修改刷盘，标记为prepare
2. Commit：Server提交binlog修改到磁盘，再把redolog标记为commit（undolog一致性是由redolog间接保证的）

如何保证主从一致：无法完全保证（从库更新不及时，主节点挂掉）

常规情况下，主节点写入 binlog，从节点读主库 binlog，写入本地 relay log，应用到数据表中同步

异步复制，半同步/同步复制；强制主库读写；Raft 算法保证大多数节点提交事务

**MySQL 数据类型**

* blob 用于存储二进制数据，比如图片、音频、视频、文件等；但实际开发中，我们都会把这些文件存储到 OSS 或者文件服务器上，然后在数据库中存储文件的 URL。

* text 用于存储文本数据，比如文章、评论、日志等。

常用时间日期数据类型

* Datetime：8字节，默认值为null，存储字面值，无时区
* Timestamp：4字节，默认值为当前时间，1970年以来的Unix时间戳，有时区，最多到2038

MySQL可以使用decimal/numetric记录货币（字符串存储，不像double和float那样存在舍入误差）

> DECIMAL(9,2)表示一共9位，小数点后2位

MySQL支持utfmb4代替utfmb3，支持更多字符，如emoji

MySQL存在隐式类型转换

* 普通视图：查询语句别名，不存储实际数据
* 物化视图：带缓存的视图，需要刷新

**MySQL DML**

in和exists的区别

* in会先计算子查询，存储到内存中，占空间，返回null时基本永不为真
* exists会对每行计算，占时间

删除操作：

* delete删除一行行数据
* truncate删除整张表数据但保留表结构
* drop删除表数据、索引和结构

union用于合并多个select结果集合并去重，union all不去重性能更好

* count(1)也是统计行数，MySQL优化后效率和count(*)差不多
* count(列)则会忽略列值为null的

limit 2,8: 偏移量为2，数量为8

**MySQL常用命令**

* 数据库操作：创建、选择、删除
* 表操作：创建、显示、删除、查看表结构
  * 其他：视图、索引、主键/外键约束
* 数据操作：查看、插入、更新、删除
* 用户操作：创建、授权、撤权、删除
* 事务操作：开始、提交、回滚

**MySQL函数**

* 字符串函数：concat(), length(), lower(), upper(), trim()
* 数值函数：abs(), ceiling(), floor(), round()
* 时间函数：now(), date_add(), date_sub(), datediff(), day(), month(), year()
* 汇总函数：sum(), avg(), min(), max(), count()
* 类型转换函数：cast(), convert()

**SQL语法树解析**（AST, Abstract Syntax Tree）

* 根结点：CRUD操作符 select / insert / update / delete
* 内部节点：子查询等 where / join
* 标识符、常量、表名等

```sql
# SQL例子
# 数据库操作
SHOW DATABASES;
CREATE DATABASE database_name;
USE database_name;
DROP DATABASE database_name;
# 表操作
CREATE TABLE users (
    id INT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    PRIMARY KEY (id)
);
SHOW TABLES;
DESCRIBE table_name;
ALTER TABLE table_name ADD column_name datatype;
DROP TABLE table_name;
# 索引和约束
CREATE INDEX index_name ON table_name (column_name);
ALTER TABLE table_name ADD PRIMARY KEY (column_name);
-- !
ALTER TABLE table_name ADD CONSTRAINT fk_name FOREIGN KEY (column_name) REFERENCES parent_table (parent_column_name);
# 数据CRUD操作
INSERT INTO table_name (column1, column2, ...) VALUES (value1, value2, ...);
SELECT id, name, salary
FROM employees
where salary > 5000
ORDER BY salary DESC, name ASC;
UPDATE table_name SET column1 = value1, column2 = value2 WHERE condition;
DELETE FROM table_name WHERE condition;
# 用户操作 -- !
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON database_name.table_name TO 'username'@'host';
REVOKE ALL PRIVILEGES ON database_name.table_name FROM 'username'@'host';
DROP USER 'username'@'host';
# 事务操作 -- !
START TRANSACTION;
COMMIT;
ROLLBACK;
# 读锁和写锁（表锁）
LOCK TABLES your_table READ;
LOCK TABLES your_table WRITE;
UNLOCK TABLES;
# 排他锁和共享锁（行锁）记得使用索引
SELECT * FROM your_table WHERE id = 1 FOR UPDATE;
SELECT * FROM your_table WHERE id = 1 LOCK IN SHARE MODE;
```
