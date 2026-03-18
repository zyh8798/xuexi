# Unit 16 - HTTP 缓存策略

## 学习目标
- 理解 HTTP 缓存的价值和原理
- 掌握强缓存和协商缓存的区别
- 熟悉各种缓存相关头部字段
- 能在实际项目中合理配置缓存策略

---

## 一、为什么需要缓存？

### 1.1 缓存的价值
```javascript
const 缓存优势 = {
  '减少请求': '避免重复请求，节省带宽',
  '加速访问': '本地读取，响应更快',
  '减轻负载': '减少服务器压力',
  '节省成本': '降低 CDN 和服务器成本'
}
```

### 1.2 缓存位置优先级
```
浏览器缓存查找顺序：
1. Service Worker（最优先）
2. Memory Cache（内存缓存）
3. Disk Cache（磁盘缓存）
4. Push Cache（推送缓存）
5. 网络请求
```

---

## 二、缓存分类

### 2.1 强缓存（Strong Cache）
**特点**：直接使用本地缓存，不发送请求到服务器。

#### 关键头部：`Cache-Control`
```http
# 示例
Cache-Control: max-age=3600, private, must-revalidate
```

**常用指令**：
```javascript
const CacheControl 指令 = {
  'max-age=秒': '资源在多少秒内有效',
  'public': '可被任何缓存存储（包括 CDN）',
  'private': '只能被浏览器私有缓存',
  'no-cache': '需要向服务器验证（协商缓存）',
  'no-store': '禁止缓存（每次都重新下载）',
  'must-revalidate': '过期后必须向服务器验证',
  'immutable': '资源永不过期（配合 hash 使用）'
}
```

#### 旧版头部：`Expires`
```http
# HTTP/1.0 的缓存控制
Expires: Wed, 21 Oct 2026 07:28:00 GMT
```

**注意**：
- Expires 是绝对时间，依赖客户端系统时间
- Cache-Control 是相对时间，更可靠
- Cache-Control 优先级高于 Expires

---

### 2.2 协商缓存（Negotiated Cache）
**特点**：发送请求到服务器验证，如果未修改则返回 304。

#### 方案一：Last-Modified / If-Modified-Since
```http
# 第一次请求
Response:
  Last-Modified: Wed, 21 Oct 2026 07:28:00 GMT

# 第二次请求（带上 If-Modified-Since）
Request:
  If-Modified-Since: Wed, 21 Oct 2026 07:28:00 GMT

# 服务器判断
如果资源未修改 → 返回 304 Not Modified
如果资源已修改 → 返回 200 + 新资源
```

**缺点**：
- 精度只有秒级
- 文件修改时间改变但内容未变时，会误判

#### 方案二：ETag / If-None-Match（推荐）
```http
# 第一次请求
Response:
  ETag: "abc123xyz"  # 资源的唯一标识（通常是 hash）

# 第二次请求
Request:
  If-None-Match: "abc123xyz"

# 服务器判断
如果 ETag 匹配 → 返回 304 Not Modified
如果 ETag 不匹配 → 返回 200 + 新资源
```

**优点**：
- 基于内容生成，更精确
- 优先级高于 Last-Modified

---

## 三、完整缓存流程

```javascript
// 缓存决策流程图
function 缓存决策流程() {
  return `
  发起请求
      ↓
  检查 Cache-Control
      ↓
  如果有 no-store → 直接请求网络
      ↓
  检查是否过期（max-age）
      ↓
  未过期 → 使用强缓存（200 from cache）
      ↓
  已过期 → 发送请求到服务器（带上 If-None-Match 或 If-Modified-Since）
      ↓
  服务器验证
      ↓
  未修改 → 返回 304（使用本地缓存）
  已修改 → 返回 200 + 新资源 + 新缓存头
  `
}
```

---

## 四、不同资源的缓存策略

### 4.1 HTML 页面（动态内容）
```http
# 不建议缓存或短期缓存
Cache-Control: no-cache, no-store, must-revalidate
# 或者
Cache-Control: max-age=300  # 5 分钟
```

**原因**：HTML 可能频繁更新，需要保证用户获取最新版本。

### 4.2 CSS/JS 文件（带版本号）
```http
# 长期缓存（文件名带 hash）
Cache-Control: public, max-age=31536000, immutable
# 例如：app.a1b2c3d4.js
```

**原理**：文件名带 hash，内容变化时文件名也会变。

### 4.3 图片资源
```http
# 静态图片（不常变化）
Cache-Control: public, max-age=2592000  # 30 天

# 动态图片（如用户上传）
Cache-Control: private, max-age=86400  # 1 天
```

### 4.4 API 接口
```http
# 用户数据（个性化）
Cache-Control: private, no-cache

# 公共数据（如商品列表）
Cache-Control: public, max-age=600  # 10 分钟
```

---

## 五、实战配置

### 5.1 Nginx 配置
```nginx
# HTML 不缓存
location ~ \.html$ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

# CSS/JS 长期缓存（带 hash）
location ~* \.(css|js)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# 图片缓存 30 天
location ~* \.(jpg|jpeg|png|gif|webp)$ {
    add_header Cache-Control "public, max-age=2592000";
}

# API 接口不缓存
location /api/ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 5.2 Webpack 配置
```javascript
// webpack.config.js
module.exports = {
  output: {
    // 文件名带 hash
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js'
  },
  
  optimization: {
    // 提取第三方库
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
```

### 5.3 Express 配置
```javascript
const express = require('express')
const path = require('path')

const app = express()

// 静态资源缓存
app.use('/static', express.static(path.join(__dirname, 'static'), {
  maxAge: '1d',  // 缓存 1 天
  immutable: true
}))

// API 不缓存
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  next()
})
```

---

## 六、浏览器行为

### 6.1 不同操作的缓存处理
```javascript
const 浏览器行为 = {
  '正常访问': '使用所有缓存',
  'F5 刷新': '跳过强缓存，使用协商缓存',
  'Ctrl+F5 强制刷新': '跳过所有缓存，重新请求',
  '后退/前进': '通常使用缓存',
  '关闭标签页再打开': '使用缓存（如果在有效期内）'
}
```

### 6.2 DevTools 查看缓存
```
Chrome DevTools → Network 面板
- Size 列显示：
  - (from disk cache): 磁盘缓存
  - (from memory cache): 内存缓存
  - (from service worker): Service Worker 缓存
  - 无标记：网络请求
```

---

## 七、高级缓存技术

### 7.1 Service Worker 缓存
```javascript
// sw.js - Service Worker 脚本
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // 有缓存直接返回
        return cachedResponse
      }
      
      // 无缓存则请求网络
      return fetch(event.request).then(response => {
        // 克隆响应并缓存
        const responseClone = response.clone()
        caches.open('v1').then(cache => {
          cache.put(event.request, responseClone)
        })
        return response
      })
    })
  )
})
```

### 7.2 缓存策略模式
```javascript
// 1. Cache First（缓存优先）
async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached || fetch(request)
}

// 2. Network First（网络优先）
async function networkFirst(request) {
  try {
    return await fetch(request)
  } catch {
    return await caches.match(request)
  }
}

// 3. Stale While Revalidate（旧缓存 + 后台更新）
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)
  
  fetch(request).then(response => {
    caches.open('v1').then(cache => {
      cache.put(request, response)
    })
  })
  
  return cached || fetch(request)
}
```

---

## 八、性能优化实践

### 8.1 缓存优化清单
```javascript
const 优化清单 = {
  'HTML': 'no-cache 或短期缓存',
  'CSS/JS': '带 hash + 长期缓存 + immutable',
  '图片': '根据更新频率设置 max-age',
  '字体': '长期缓存（很少变化）',
  'API': '根据数据特性选择缓存策略',
  'CDN': '配置合理的缓存规则',
  'Service Worker': '离线缓存支持'
}
```

### 8.2 实际案例
```javascript
// 项目缓存配置示例
const projectCacheConfig = {
  优化前: {
    页面加载时间: '3.5s',
    重复请求数: '80+',
    带宽消耗: '高'
  },
  
  优化措施: [
    '静态资源添加 hash 文件名',
    '配置 Nginx 缓存策略',
    '启用 CDN 加速',
    '实现 Service Worker 离线缓存'
  ],
  
  优化后: {
    页面加载时间: '1.2s（提升 65%）',
    重复请求数: '20-',
    带宽消耗: '减少 70%',
    缓存命中率: '85%'
  }
}
```

---

## 九、常见面试题

### 9.1 强缓存和协商缓存的区别？
**回答要点**：
- **强缓存**：不发送请求，直接使用本地缓存（200 from cache）
- **协商缓存**：发送请求到服务器验证，未修改返回 304
- **头部字段**：强缓存用 Cache-Control/Expires，协商缓存用 ETag/If-None-Match

### 9.2 304 状态码是如何产生的？
**回答要点**：
1. 客户端发送带 `If-None-Match`（ETag）或 `If-Modified-Since` 的请求
2. 服务器比较资源是否变化
3. 未变化则返回 304（无响应体）
4. 客户端继续使用本地缓存

### 9.3 如何设计一个完美的缓存策略？
**回答要点**：
1. **HTML**：no-cache，保证最新
2. **带 hash 的静态资源**：长期缓存 + immutable
3. **图片**：根据更新频率设置 max-age
4. **API**：区分公共数据和个性化数据
5. **CDN**：配置合理的缓存规则
6. **Service Worker**：离线缓存支持

### 9.4 ETag 和 Last-Modified 哪个更好？
**回答要点**：
- **ETag 更好**：基于内容生成，更精确
- **Last-Modified 的问题**：只记录修改时间，内容不变但时间变时会误判
- **优先级**：ETag > Last-Modified
- **最佳实践**：两者配合使用

---

## 十、学习建议

1. **动手实验**：用 DevTools 观察不同缓存策略的效果
2. **理解流程**：画出完整的缓存决策流程图
3. **实际配置**：在项目中实践 Nginx、Webpack 缓存配置
4. **关注细节**：理解不同浏览器操作的缓存行为差异
5. **性能监控**：学会分析缓存命中率和性能指标

---

## 下一步
- 阅读 Unit17：跨域与安全
- 完成 quiz.md 自测题
- 在实际项目中应用缓存优化
