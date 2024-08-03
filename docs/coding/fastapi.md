# FastAPI

> http://127.0.0.1:8000/docs：由Swagger UI自动生成的交互式API文档

## 类型提示

Python3.6+版本开始支持类型提示 name: str

主要包括str, int, float, bool

负责数据类型（dict, list, set, typle）等可以引入typing库声明

pydantic库用于数据类型验证并自动和json相互转化

> 整个FastAPI建立在Pydantic的基础上

## 并发 async/await

只能在async def中使用await

异步代码常用于网络请求，磁盘交互，远程调用，数据库操作（I/O密集型操作）

await用于需要等待才能出结果的操作前，同时声明函数为async，告诉程序可以去做其他事

## Tutorial 教程

通常使用POST, GET, PUT, DELETE（创建，获取，更新，删除）

get方法中支持将路径参数直接传递给变量，非路径参数自动解释为查询参数（支持默认值，默认值为None即为可选参数，不声明默认值即为必选）

API之间的顺序很重要

使用枚举Enum类型声明参数的可用值，通过.value获取具体的值。

只有类型是Pydantic的BaseModel继承类的参数，才是POST的请求体，以JSON形式读取，否则是路径参数或者查询参数（单类型参数都会识别为查询参数）。

q: Union[str, None] = Query(default=None, max_length=50)

设置可选查询参数的默认值和长度限制，Query显式声明为查询参数

元数据：alias, title, description, deprecated；校验：min_length, max_length, pattern

Path显示声明为路径参数

数值校验：ge, le, gt, lt

importance: Annotated[int, Body()]来声明请求体的单一键值，也可声明多个请求体，会自动嵌套

请求体参数通过Field()进行校验和声明元数据

可以用Config和schema_extra来声明示例（仅起到注释作用）

使用装饰器中的response_model来定义响应模型，使用response_model_exclude_unset来返回显式设定的值

PydanticModel.dict()返回包含模型数据的字典

### Cookie与Header

Cookie：存储在用户本地浏览器的小型文本，通常用于保存**会话信息/偏好设置/其他持久化数据**

Header：请求元数据键值对，分为请求头部和响应头部

请求头变量的连字符会自动修改为snake_case

### CORS跨域资源共享

源：协议，域名，端口

非同源浏览器会向后端发送OPTIONS请求，后端发送headers授权通信。

使用CORSMiddleware创建允许源列表/方法/特定头

### 表单与文件

文件通过File()/UploadFile()显式声明，表单通过Form()显式声明

### SQL数据库

### FastAPI特点

Django大而全，FastAPI专注API开发，集成三方库（比如SQLAlchemy for ORM）来补充功能。使用异步编程模型，在高并发时性能更好，利用类型注解来提高效率。Swagger UI方便测试API