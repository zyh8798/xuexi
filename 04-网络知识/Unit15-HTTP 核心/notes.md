# Unit 15 - HTTP 核心知识点

## 学习目标
- 掌握 HTTP 协议的核心概念
- 理解 HTTP 请求/响应的结构
- 熟悉常见的 HTTP 方法和状态码
- 了解 HTTP/1.1、HTTP/2、HTTP/3 的演进

---

## 一、HTTP 协议基础

### 1.1 什么是 HTTP？
**HTTP**（HyperText Transfer Protocol）超文本传输协议，是应用层的通信协议。

**核心特点**：
- **无状态**：每次请求都是独立的，服务器不保存上下文
- **基于请求 - 响应**：客户端发起请求，服务器返回响应
- **可扩展**：通过头部字段扩展功能

---

## 二、HTTP 请求报文

### 2.1 请求结构
```
请求行 + 请求头 + 空行 + 请求体

GET /api/users?id=123 HTTP/1.1        ← 请求行
Host: api.example.com                 ← 请求头
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer token123
                                      ← 空行（分隔符）
{"name": "张三"}                      ← 请求体（可选）
```

### 2.2 请求行详解
```javascript
const 请求行 = {
  方法：'GET',                        // HTTP Method
  URL: '/api/users?id=123',          // 请求路径 + 查询参数
  协议版本：'HTTP/1.1'               // 协议版本
}
```

### 2.3 常见请求头
```javascript
const 常见请求头 = {
  'Host': 'api.example.com',         // 目标服务器域名
  'User-Agent': 'Mozilla/5.0',       // 客户端信息
  'Accept': 'application/json',      // 可接受的内容类型
  'Content-Type': 'application/json',// 请求体类型
  'Authorization': 'Bearer token',   // 认证信息
  'Cookie': 'sessionId=abc123',      // Cookie
  'Referer': 'https://example.com',  // 来源页面
  'Origin': 'https://example.com'    // 跨域请求源
}
```

---

## 三、HTTP 响应报文

### 3.1 响应结构
```
状态行 + 响应头 + 空行 + 响应体

HTTP/1.1 200 OK                     ← 状态行
Content-Type: application/json      ← 响应头
Content-Length: 1024
Set-Cookie: sessionId=abc123
                                    ← 空行
{"id": 123, "name": "张三"}         ← 响应体
```

### 3.2 状态码分类（面试必考）

| 分类 | 范围 | 说明 |
|------|------|------|
| **1xx** | 100-199 | 信息性响应 |
| **2xx** | 200-299 | 成功 |
| **3xx** | 300-399 | 重定向 |
| **4xx** | 400-499 | 客户端错误 |
| **5xx** | 500-599 | 服务端错误 |

### 3.3 常见状态码详解

#### 2xx 成功
```javascript
const 成功状态码 = {
  '200 OK': '请求成功',
  '201 Created': '资源创建成功',
  '204 No Content': '成功但无内容返回'
}
```

#### 3xx 重定向
```javascript
const 重定向状态码 = {
  '301 Moved Permanently': '永久重定向（浏览器会缓存）',
  '302 Found': '临时重定向',
  '304 Not Modified': '资源未修改（使用缓存）',
  '307 Temporary Redirect': '临时重定向（保持请求方法）',
  '308 Permanent Redirect': '永久重定向（保持请求方法）'
}
```

#### 4xx 客户端错误
```javascript
const 客户端错误 = {
  '400 Bad Request': '请求格式错误',
  '401 Unauthorized': '未授权（需要登录）',
  '403 Forbidden': '禁止访问（无权限）',
  '404 Not Found': '资源不存在',
  '405 Method Not Allowed': '请求方法不被允许',
  '408 Request Timeout': '请求超时',
  '409 Conflict': '资源冲突',
  '422 Unprocessable Entity': '请求格式正确但语义错误',
  '429 Too Many Requests': '请求过于频繁'
}
```

#### 5xx 服务端错误
```javascript
const 服务端错误 = {
  '500 Internal Server Error': '服务器内部错误',
  '502 Bad Gateway': '网关错误',
  '503 Service Unavailable': '服务不可用',
  '504 Gateway Timeout': '网关超时'
}
```

---

## 四、HTTP 方法（动词）

### 4.1 RESTful API 常用方法

| 方法 | 含义 | 幂等性 | 安全性 | 示例 |
|------|------|--------|--------|------|
| **GET** | 获取资源 | ✅ | ✅ | 获取用户列表 |
| **POST** | 创建资源 | ❌ | ❌ | 创建新用户 |
| **PUT** | 更新资源（全量） | ✅ | ❌ | 更新用户信息 |
| **PATCH** | 更新资源（部分） | ❌ | ❌ | 修改用户邮箱 |
| **DELETE** | 删除资源 | ✅ | ❌ | 删除用户 |

### 4.2 幂等性（Idempotency）
**定义**：多次执行相同的操作，结果相同。

```javascript
// 幂等操作示例
GET /api/users/123     // 调用 1 次和 100 次，结果一样 ✅
DELETE /api/users/123  // 第 1 次删除成功，后续返回 404，但最终状态一致 ✅
PUT /api/users/123     // 多次更新，最终状态一致 ✅

// 非幂等操作
POST /api/users        // 每次调用都创建新用户 ❌
```

---

## 五、HTTP/1.1 vs HTTP/2 vs HTTP/3

### 5.1 HTTP/1.1 的问题
```
问题 1：队头阻塞（Head-of-Line Blocking）
┌─────────┐
│ 请求 1   │ ← 慢
├─────────┤
│ 请求 2   │ ← 等待请求 1 完成
├─────────┤
│ 请求 3   │ ← 等待请求 1 完成
└─────────┘

问题 2：多个 TCP 连接开销大
问题 3：头部冗余，无压缩
```

### 5.2 HTTP/2 的改进
```javascript
const HTTP2特性 = {
  '多路复用': '多个请求共享一个 TCP 连接，解决队头阻塞',
  '二进制分帧': '将消息分解为帧，独立传输',
  '头部压缩': 'HPACK 压缩算法，减少冗余',
  '服务器推送': '服务器主动推送资源到客户端'
}

// 多路复用示意
TCP 连接
├── 流 1: 请求 1 的帧 A → 请求 1 的帧 B
├── 流 2: 请求 2 的帧 A → 请求 2 的帧 C
└── 流 3: 请求 3 的帧 A → 请求 3 的帧 D
```

### 5.3 HTTP/3 的突破
```javascript
const HTTP3特性 = {
  '基于 QUIC 协议': '不再依赖 TCP，使用 UDP',
  '0-RTT 连接': '首次连接也只需 1 个 RTT',
  '真正的多路复用': '在 UDP 上实现，彻底解决队头阻塞',
  '连接迁移': 'IP 变化时保持连接（适合移动端）'
}
```

---

## 六、Keep-Alive 长连接

### 6.1 作用
避免频繁建立 TCP 连接，提升性能。

### 6.2 配置示例
```http
# HTTP/1.1 默认开启
Connection: keep-alive
Keep-Alive: timeout=5, max=1000

# 关闭 Keep-Alive
Connection: close
```

---

## 七、Content-Type 常见类型

```javascript
const ContentType = {
  'application/json': 'JSON 数据',
  'application/x-www-form-urlencoded': '表单数据（键值对）',
  'multipart/form-data': '文件上传',
  'text/html': 'HTML 页面',
  'text/css': 'CSS 样式表',
  'application/javascript': 'JavaScript 文件',
  'image/jpeg': 'JPEG 图片',
  'image/png': 'PNG 图片',
  'video/mp4': 'MP4 视频'
}
```

---

## 八、实战示例

### 8.1 Fetch API 使用
```javascript
// GET 请求
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return await response.json()
}

// POST 请求
async function createUser(data) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  
  return await response.json()
}

// 文件上传
async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData  // 自动设置 Content-Type: multipart/form-data
  })
  
  return await response.json()
}
```

### 8.2 Axios 封装
```javascript
// utils/request.js
import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 添加 Token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 统一处理响应
    return response.data
  },
  error => {
    // 统一处理错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，跳转登录
          break
        case 403:
          // 无权限
          break
        case 404:
          // 资源不存在
          break
        case 500:
          // 服务器错误
          break
      }
    }
    return Promise.reject(error)
  }
)

export default request
```

---

## 九、面试题精选

### 9.1 GET 和 POST 的区别？
**回答要点**：
1. **语义不同**：GET 获取资源，POST 创建资源
2. **安全性**：GET 是安全的（不应改变服务器状态），POST 不安全
3. **幂等性**：GET 幂等，POST 不幂等
4. **参数位置**：GET 参数在 URL，POST 参数在 Body
5. **长度限制**：GET 有 URL 长度限制，POST 无限制
6. **缓存**：GET 可被缓存，POST 不会被缓存
7. **历史后退**：GET 后退无害，POST 后退会重新提交

### 9.2 301 和 302 的区别？
**回答要点**：
- **301**：永久重定向，浏览器会缓存，SEO 友好
- **302**：临时重定向，浏览器不会缓存
- **注意**：某些浏览器会将 302 当作 303 处理（GET 重定向）

### 9.3 304 是如何工作的？
**回答要点**：
1. 客户端发送带 `If-Modified-Since` 或 `If-None-Match` 的请求
2. 服务器比较资源是否修改
3. 未修改则返回 304（无响应体）
4. 客户端使用本地缓存

### 9.4 HTTP/2 相比 HTTP/1.1 有哪些优势？
**回答要点**：
1. 多路复用（解决队头阻塞）
2. 二进制分帧（更高效）
3. 头部压缩（减少冗余）
4. 服务器推送（主动推送资源）

---

## 十、学习建议

1. **动手实践**：用 Postman 或浏览器 DevTools 查看请求/响应
2. **理解状态码**：记住常见状态码的含义和使用场景
3. **掌握 RESTful**：理解 REST 风格和 CRUD 操作
4. **对比学习**：对比 HTTP/1.1、HTTP/2、HTTP/3 的差异
5. **关注安全**：理解 HTTPS、CORS、CSRF 等安全概念

---

## 下一步
- 阅读 Unit16：缓存策略
- 阅读 Unit17：跨域与安全
- 完成 quiz.md 自测题
