# Redis

内存键值对存储，最常见的应用是作为缓存系统，减少数据库访问压力。

> 此外也常用于存储会话数据/消息队列/计数器等

相比程序变量存储，Redis数据可以跨进程甚至跨机器访问，提供了RDB快照/AOF日志持久化机制。

持久化机制：将内存数据保存到磁盘

* RDB(Redis Database Snapshotting): dump.rdb，灾难恢复
* AOF(Append Only File): AOF重写机制

Redis常见数据类型：String，Hash，List，Set，Sorted Set / ZSet

Zset底层用到了跳表和哈希表，方便进行范围查询和单点查询