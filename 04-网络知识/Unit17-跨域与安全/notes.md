# Unit 17 - 跨域与安全

## 学习目标
- 理解同源策略和跨域的本质
- 掌握常见的跨域解决方案
- 熟悉 Web 安全攻击原理（XSS、CSRF、点击劫持）
- 学会安全防护措施

---

## 一、同源策略（Same-Origin Policy）

### 1.1 什么是同源？
**定义**：协议 + 域名 + 端口 三者完全相同。

```javascript
const 同源判断 = {
  'https://example.com/page1' 和 'https://example.com/page2': '✅ 同源',
  'http://example.com' 和 'https://example.com': '❌ 协议不同',
  'https://example.com' 和 'https://www.example.com': '❌ 域名不同',
  'https://example.com:8080' 和 'https://example.com:9000': '❌ 端口不同'
}
```

### 1.2 为什么需要同源策略？
**目的**：防止恶意网站窃取其他网站的数据。

```javascript
// 如果没有同源策略，会发生什么？
// 恶意网站可以：
1. 读取你的银行网站数据
2. 以你的身份发送请求
3. 窃取 Cookie 和敏感信息
```

---

## 二、跨域问题详解

### 2.1 哪些操作受同源策略限制？
```javascript
const 受限操作 = {
  'AJAX 请求': '无法读取响应内容',
  'DOM 操作': '无法访问 iframe 的 DOM',
  'Cookie/LocalStorage': '无法读取其他源的存储',
  'Service Worker': '无法注册其他源的 SW'
}
```

### 2.2 哪些操作不受限制？
```javascript
const 不受限操作 = {
  '<script>标签': '可以加载跨域 JS',
  '<img>标签': '可以加载跨域图片',
  '<link>标签': '可以加载跨域 CSS',
  '<iframe>标签': '可以嵌入跨域页面',
  '表单提交': '可以提交到跨域地址'
}
```

---

## 三、跨域解决方案

### 3.1 CORS（跨域资源共享）⭐推荐

#### 原理
服务器通过响应头告知浏览器允许哪些源访问。

#### 简单请求
```javascript
// 简单请求的条件
const 简单请求条件 = {
  '方法': 'GET、HEAD、POST（只能是这三种）',
  'Content-Type': '只能是 application/x-www-form-urlencoded、multipart/form-data、text/plain',
  '自定义头部': '无或简单的几个'
}

// 请求示例
Request:
  Origin: https://frontend.com
  Method: GET

Response:
  Access-Control-Allow-Origin: https://frontend.com  // 允许的源
  Access-Control-Allow-Methods: GET, POST           // 允许的方法
  Access-Control-Allow-Headers: Content-Type        // 允许的头部
```

#### 预检请求（OPTIONS）
```javascript
// 非简单请求会先发送 OPTIONS 预检
Request (OPTIONS):
  Origin: https://frontend.com
  Access-Control-Request-Method: PUT
  Access-Control-Request-Headers: Authorization

Response (OPTIONS):
  Access-Control-Allow-Origin: https://frontend.com
  Access-Control-Allow-Methods: GET, POST, PUT
  Access-Control-Allow-Headers: Authorization
  Access-Control-Max-Age: 86400  // 预检结果缓存时间

// 预检通过后，再发送实际请求
Request (PUT):
  Origin: https://frontend.com
  Authorization: Bearer token
```

#### 携带 Cookie
```javascript
// 前端配置
fetch('https://api.example.com/data', {
  credentials: 'include',  // 或 'same-origin'、'omit'
  headers: {
    'Content-Type': 'application/json'
  }
})

// 后端配置
Response:
  Access-Control-Allow-Credentials: true  // 允许携带 Cookie
  Access-Control-Allow-Origin: https://frontend.com  // 不能是 *
```

### 3.2 JSONP（老方案，已淘汰）
```javascript
// 原理：利用 <script> 标签不受同源限制
// 前端
function handleData(data) {
  console.log('收到数据:', data)
}

const script = document.createElement('script')
script.src = 'https://api.example.com/data?callback=handleData'
document.body.appendChild(script)

// 后端返回
handleData({"name": "张三"})

// 缺点：只支持 GET，安全性差
```

### 3.3 代理服务器（开发环境常用）

#### Webpack Dev Server 代理
```javascript
// webpack.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.example.com',
        changeOrigin: true,  // 修改 Host 头
        secure: false,       // 允许 HTTPS
        pathRewrite: {
          '^/api': ''  // 重写路径
        }
      }
    }
  }
}

// 使用
fetch('/api/users')  // 实际请求 https://api.example.com/users
```

#### Nginx 反向代理
```nginx
server {
    listen 80;
    server_name frontend.com;
    
    location /api/ {
        proxy_pass https://api.example.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 3.4 postMessage（跨窗口通信）
```javascript
// 父窗口发送消息
const iframe = document.querySelector('iframe')
iframe.contentWindow.postMessage('Hello', 'https://other-domain.com')

// 子窗口接收消息
window.addEventListener('message', event => {
  // 验证来源
  if (event.origin !== 'https://trusted.com') return
  
  console.log('收到消息:', event.data)
  
  // 回复消息
  event.source.postMessage('Hi', event.origin)
})
```

---

## 四、Web 安全攻击与防护

### 4.1 XSS（跨站脚本攻击）⭐高频考点

#### 攻击原理
```javascript
// 场景：用户在评论区输入恶意脚本
用户输入: <script>stealCookie(document.cookie)</script>

// 如果未过滤，其他用户查看时会执行
受害者访问: 评论页面 → 脚本执行 → Cookie 被盗
```

#### 常见类型
```javascript
const XSS类型 = {
  '反射型 XSS': 'URL 参数中包含恶意脚本，立即执行',
  '存储型 XSS': '恶意脚本存储到服务器，其他用户访问时执行',
  'DOM 型 XSS': '前端 JS 操作 DOM 时执行，不经过服务器'
}
```

#### 防护措施
```javascript
// 1. 转义 HTML 特殊字符
function escapeHTML(str) {
  const map = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return str.replace(/[<>&"']/g, tag => map[tag])
}

// 2. 使用框架的自动转义（Vue/React）
// Vue: {{ text }} 自动转义
// React: {text} 自动转义

// 3. 设置 HttpOnly Cookie
Set-Cookie: sessionId=abc123; HttpOnly  // JS 无法读取

// 4. CSP（内容安全策略）
Content-Security-Policy: default-src 'self'
```

### 4.2 CSRF（跨站请求伪造）⭐高频考点

#### 攻击原理
```javascript
// 场景：用户登录银行网站后，又访问了恶意网站

// 恶意网站代码
<img src="https://bank.com/transfer?to=hacker&amount=1000" width="0" height="0">

// 由于 Cookie 会自动携带，银行网站认为这是用户的合法请求
// 结果：用户账户被转账 1000 元给黑客
```

#### 攻击条件
```javascript
const 攻击条件 = {
  '1': '用户已登录目标网站（有有效 Cookie）',
  '2': '攻击者知道请求 URL 和参数',
  '3': '请求是 GET 或简单的 POST',
  '4': '没有额外的安全验证'
}
```

#### 防护措施
```javascript
// 1. CSRF Token（最有效）
// 后端生成随机 Token，放入 Session
// 前端提交时带上 Token
<input type="hidden" name="_csrf" value="abc123xyz">

// 后端验证
if (req.body._csrf !== req.session.csrfToken) {
  throw new Error('CSRF Token 无效')
}

// 2. SameSite Cookie 属性
Set-Cookie: sessionId=abc123; SameSite=Strict  // 禁止第三方 Cookie
Set-Cookie: sessionId=abc123; SameSite=Lax     // 允许部分请求

// 3. 验证 Referer/Origin 头
if (!/^https:\/\/trusted\.com$/.test(req.headers.origin)) {
  throw new Error('非法来源')
}

// 4. 关键操作要求二次验证
// 如：转账需要输入密码、短信验证码等
```

### 4.3 点击劫持（Clickjacking）

#### 攻击原理
```javascript
// 攻击者将目标网站用透明 iframe 嵌入
<div style="position: relative;">
  <!-- 诱导按钮 -->
  <button>点击查看美女</button>
  
  <!-- 透明的删除按钮（覆盖在诱导按钮上） -->
  <iframe src="https://bank.com/delete-account" 
          style="opacity: 0; position: absolute; top: 0; left: 0;">
  </iframe>
</div>

// 用户以为点了"查看美女"，实际点了"删除账户"
```

#### 防护措施
```javascript
// 1. X-Frame-Options 响应头
X-Frame-Options: DENY              // 禁止所有 iframe
X-Frame-Options: SAMEORIGIN        // 只允许同源 iframe

// 2. CSP frame-ancestors
Content-Security-Policy: frame-ancestors 'self'

// 3. JS 检测（不可靠，可被绕过）
if (window.top !== window.self) {
  window.top.location = window.self.location
}
```

### 4.4 其他安全威胁

#### 中间人攻击（MITM）
```javascript
const 防护措施 = {
  '使用 HTTPS': '加密传输，防止窃听',
  '证书校验': '验证服务器身份',
  'HSTS': '强制使用 HTTPS'
}
```

#### SQL 注入
```javascript
// 错误示例（拼接 SQL）
const sql = `SELECT * FROM users WHERE id = ${userId}`  // ❌

// 正确示例（参数化查询）
const sql = 'SELECT * FROM users WHERE id = ?'  // ✅
db.execute(sql, [userId])
```

#### DDoS 攻击
```javascript
const 防护措施 = {
  '限流': '限制单个 IP 的请求频率',
  'CDN': '分散流量压力',
  '防火墙': '识别并拦截恶意流量',
  '负载均衡': '分散到多台服务器'
}
```

---

## 五、HTTPS 安全

### 5.1 HTTP vs HTTPS
```javascript
const 对比 = {
  'HTTP': {
    '协议': '明文传输',
    '端口': '80',
    '安全性': '不安全，易被窃听'
  },
  'HTTPS': {
    '协议': 'HTTP + SSL/TLS 加密',
    '端口': '443',
    '安全性': '加密传输，防窃听、防篡改'
  }
}
```

### 5.2 HTTPS 工作原理
```javascript
// 简化流程
1. 客户端发起 HTTPS 请求
2. 服务器返回 SSL 证书（包含公钥）
3. 客户端验证证书合法性
4. 客户端生成随机数，用公钥加密后发送给服务器
5. 服务器用私钥解密，得到随机数
6. 双方使用随机数作为密钥，对称加密通信
```

### 5.3 证书链
```
根证书（CA 签发）
    ↓
中间证书
    ↓
服务器证书（我们的证书）
```

---

## 六、安全最佳实践清单

### 6.1 前端安全
```javascript
const 前端安全清单 = {
  '输入验证': '验证用户输入，防止 XSS 和注入',
  '输出编码': '显示用户内容时转义 HTML',
  'CSP': '配置内容安全策略',
  '敏感信息': '不在 URL、日志中暴露敏感信息',
  '第三方依赖': '定期更新，修复安全漏洞',
  '错误处理': '不暴露详细错误信息'
}
```

### 6.2 后端安全
```javascript
const 后端安全清单 = {
  '参数化查询': '防止 SQL 注入',
  'CSRF Token': '验证请求来源',
  '输入过滤': '清理用户输入',
  '权限验证': '每次请求都验证权限',
  '限流': '防止暴力破解和 DDoS',
  '日志记录': '记录安全相关事件'
}
```

### 6.3 运维安全
```javascript
const 运维安全清单 = {
  'HTTPS': '全站启用 HTTPS',
  'HSTS': '强制 HTTPS',
  '安全头部': '配置 X-Frame-Options 等',
  '防火墙': '配置 WAF 规则',
  '定期扫描': '漏洞扫描和渗透测试',
  '备份': '定期备份重要数据'
}
```

---

## 七、面试题精选

### 7.1 什么是跨域？如何解决？
**回答要点**：
1. **定义**：协议、域名、端口任一不同就是跨域
2. **同源策略**：浏览器的安全机制，限制跨域操作
3. **解决方案**：
   - CORS（最常用，后端配置）
   - 代理服务器（开发环境）
   - postMessage（跨窗口）
   - JSONP（已淘汰）

### 7.2 简单请求和预检请求的区别？
**回答要点**：
- **简单请求**：满足特定条件（GET/HEAD/POST，简单 Content-Type），直接发送
- **预检请求**：不满足简单请求条件，先发 OPTIONS 询问，通过后再发实际请求
- **目的**：确保服务器支持跨域请求

### 7.3 XSS 攻击原理和防护？
**回答要点**：
- **原理**：注入恶意脚本到其他网站，窃取数据或破坏页面
- **类型**：反射型、存储型、DOM 型
- **防护**：
  - 输入验证和转义
  - 使用框架的自动转义
  - 设置 HttpOnly Cookie
  - 配置 CSP

### 7.4 CSRF 攻击原理和防护？
**回答要点**：
- **原理**：利用用户已登录状态，伪造请求执行操作
- **条件**：登录状态 + 知道请求 URL + 无额外验证
- **防护**：
  - CSRF Token（最有效）
  - SameSite Cookie
  - 验证 Referer/Origin
  - 关键操作二次验证

### 7.5 HTTPS 如何保证安全？
**回答要点**：
1. **加密传输**：SSL/TLS 加密，防止窃听
2. **身份验证**：证书验证服务器身份，防止冒充
3. **完整性**：数字签名，防止篡改
4. **流程**：握手协商密钥 → 对称加密通信

---

## 八、学习建议

1. **理解原理**：深入理解同源策略和安全攻击的本质
2. **动手实践**：搭建环境体验 XSS、CSRF 攻击
3. **掌握方案**：熟练配置 CORS 和各种安全措施
4. **关注标准**：了解最新的安全标准和最佳实践
5. **安全意识**：在开发中始终保持安全意识

---

## 下一步
- 完成 quiz.md 自测题
- 复习 Unit14-17 的全部内容
- 准备网络知识面试冲刺
