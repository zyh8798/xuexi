# Unit 9 - Vue Router 原理与实战

## 学习目标
- 理解前端路由的工作原理
- 掌握 hash 和 history 模式的区别
- 手写简易版路由
- 掌握路由守卫和权限控制

---

## 一、前端路由基础

### 1.1 为什么需要前端路由？

```javascript
// 传统后端路由
用户访问 /user/123
    ↓
浏览器发送请求到服务器
    ↓
服务器返回完整的 HTML 页面
    ↓
页面刷新，白屏

// 前端路由
用户访问 /user/123
    ↓
URL 变化，但页面不刷新
    ↓
监听 URL 变化
    ↓
渲染对应的组件（局部更新）
```

### 1.2 两种路由模式

```javascript
const 路由模式对比 = {
  'Hash 模式': {
    '格式': 'http://example.com/#/user/123',
    '原理': '利用 hashchange 事件',
    '优点': '兼容性好（支持 IE8），无需后端配置',
    '缺点': 'URL 带 # 不美观，SEO 不友好',
    '场景': '老项目、不需要 SEO 的应用'
  },
  
  'History 模式': {
    '格式': 'http://example.com/user/123',
    '原理': '利用 HTML5 History API',
    '优点': 'URL 美观，符合常规网址格式',
    '缺点': '需要后端配合（404 问题）',
    '场景': '现代项目、需要 SEO 的应用'
  }
}
```

---

## 二、路由实现原理

### 2.1 Hash 模式实现

```javascript
class HashRouter {
  constructor() {
    this.routes = {}
    this.currentUrl = ''
    
    // 监听 hash 变化
    window.addEventListener('hashchange', () => {
      this.loadRoute()
    })
    
    // 初始化
    this.loadRoute()
  }
  
  // 注册路由
  registerRoute(path, callback) {
    this.routes[path] = callback
  }
  
  // 导航
  navigate(path) {
    window.location.hash = path
  }
  
  // 加载路由
  loadRoute() {
    const hash = window.location.hash.slice(1) || '/'
    this.currentUrl = hash
    
    const routeHandler = this.routes[hash]
    if (routeHandler) {
      routeHandler()
    } else {
      console.log('404 - Route not found')
    }
  }
}

// 使用示例
const router = new HashRouter()

router.registerRoute('/', () => {
  console.log('首页')
  document.getElementById('app').innerHTML = '<h1>Home</h1>'
})

router.registerRoute('/about', () => {
  console.log('关于页')
  document.getElementById('app').innerHTML = '<h1>About</h1>'
})

router.registerRoute('/user/:id', (params) => {
  console.log('用户页:', params.id)
  document.getElementById('app').innerHTML = `<h1>User ${params.id}</h1>`
})

// 导航
router.navigate('/about')
```

### 2.2 History 模式实现

```javascript
class HistoryRouter {
  constructor() {
    this.routes = {}
    this.base = '/'
    
    // 拦截浏览器的后退/前进按钮
    window.addEventListener('popstate', () => {
      this.loadRoute()
    })
  }
  
  registerRoute(path, callback) {
    this.routes[path] = callback
  }
  
  // 导航
  push(path) {
    history.pushState({ path }, null, path)
    this.loadRoute()
  }
  
  replace(path) {
    history.replaceState({ path }, null, path)
    this.loadRoute()
  }
  
  back() {
    history.back()
  }
  
  forward() {
    history.forward()
  }
  
  loadRoute() {
    const path = window.location.pathname
    const routeHandler = this.routes[path]
    
    if (routeHandler) {
      routeHandler()
    } else {
      console.log('404')
    }
  }
}

// 使用
const router = new HistoryRouter()

router.registerRoute('/', () => {
  console.log('首页')
})

router.registerRoute('/about', () => {
  console.log('关于')
})

// 导航
router.push('/about')
```

### 2.3 动态路由匹配

```javascript
class RouterWithParams {
  constructor() {
    this.routes = []
  }
  
  registerRoute(path, callback) {
    // 将路径转换为正则
    const keys = []
    const regex = pathToRegexp(path, keys)
    
    this.routes.push({
      path,
      regex,
      keys,
      callback
    })
  }
  
  match(path) {
    for (const route of this.routes) {
      const match = path.match(route.regex)
      
      if (match) {
        // 提取参数
        const params = {}
        route.keys.forEach((key, index) => {
          params[key.name] = match[index + 1]
        })
        
        route.callback(params)
        return
      }
    }
    
    console.log('404')
  }
}

// 路径转正则工具函数
function pathToRegexp(path, keys) {
  // /user/:id → /^\/user\/([^/]+?)$/
  const pattern = path.replace(/:(\w+)/g, '([^/]+?)')
  const regex = new RegExp(`^${pattern}$`)
  
  // 提取参数名
  const matches = path.matchAll(/:(\w+)/g)
  for (const match of matches) {
    keys.push({ name: match[1] })
  }
  
  return regex
}

// 使用
const router = new RouterWithParams()

router.registerRoute('/user/:id', (params) => {
  console.log('用户 ID:', params.id)
})

router.registerRoute('/post/:year/:month/:day', (params) => {
  console.log(params)  // { year: '2024', month: '03', day: '10' }
})

router.match('/user/123')
```

---

## 三、Vue Router 核心功能

### 3.1 基础配置

```javascript
// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: '关于我们',
      requiresAuth: true
    }
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('@/views/User.vue'),
    props: true  // 开启路由参数转 props
  },
  {
    path: '/post/:postId',
    component: () => import('@/views/Post.vue'),
    props: route => ({ 
      postId: route.params.postId,
      query: route.query 
    })
  }
]

const router = new VueRouter({
  mode: 'history',  // 或 'hash'
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 滚动行为
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
```

### 3.2 路由守卫

```javascript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '默认标题'
  
  // 权限校验
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    // 需要登录但未登录
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (to.path === '/login' && token) {
    // 已登录却访问登录页
    next('/')
  } else {
    next()
  }
})

// 全局后置守卫
router.afterEach((to, from) => {
  // 统计页面访问
  analytics.track('page_view', {
    path: to.path,
    name: to.name
  })
})

// 路由独享守卫
const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      // 只对这个路由生效
      if (!hasPermission()) {
        next('/403')
      } else {
        next()
      }
    }
  }
]

// 组件内守卫
export default {
  beforeRouteEnter(to, from, next) {
    // 在渲染该组件之前调用
    // 此时 this 还不可用
    next(vm => {
      // 通过 vm 访问组件实例
      vm.fetchData()
    })
  },
  
  beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 例如：/user/1 → /user/2
    this.fetchData(to.params.id)
    next()
  },
  
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件时调用
    // 可以用来阻止导航
    const answer = window.confirm('确定要离开吗？未保存的内容将会丢失')
    if (answer) {
      next()
    } else {
      next(false)
    }
  }
}
```

### 3.3 路由懒加载

```javascript
// 方式 1：箭头函数 + import
const routes = [
  {
    path: '/home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/about',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
  }
]

// 方式 2：工厂函数
function loadView(view) {
  return () => import(`@/views/${view}.vue`)
}

const routes = [
  {
    path: '/user',
    component: loadView('User')
  }
]

// Vue3 + Vite
const routes = [
  {
    path: '/home',
    component: () => import('@/views/Home.vue')
  }
]
```

### 3.4 嵌套路由

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        path: '',
        component: UserProfile,
        name: 'user-profile'
      },
      {
        path: 'posts',
        component: UserPosts,
        name: 'user-posts'
      },
      {
        path: 'settings',
        component: UserSettings,
        name: 'user-settings'
      }
    ]
  }
]

// 模板
<template>
  <div class="user">
    <h2>User {{ $route.params.id }}</h2>
    
    <nav>
      <router-link :to="{ name: 'user-profile' }">资料</router-link>
      <router-link :to="{ name: 'user-posts' }">帖子</router-link>
      <router-link :to="{ name: 'user-settings' }">设置</router-link>
    </nav>
    
    <!-- 子路由出口 -->
    <router-view />
  </div>
</template>
```

### 3.5 编程式导航

```javascript
export default {
  methods: {
    goToHome() {
      this.$router.push('/')
    },
    
    goToUser(id) {
      this.$router.push(`/user/${id}`)
      
      // 或命名路由
      this.$router.push({
        name: 'User',
        params: { id }
      })
      
      // 带查询参数
      this.$router.push({
        name: 'Search',
        query: {
          q: 'keyword',
          page: 1
        }
      })
    },
    
    replacePage() {
      this.$router.replace('/new-page')
    },
    
    goBack() {
      this.$router.go(-1)
      // 或
      this.$router.back()
    },
    
    goForward() {
      this.$router.go(1)
      // 或
      this.$router.forward()
    }
  }
}
```

---

## 四、权限控制方案

### 4.1 基于角色的权限

```javascript
// 定义角色和对应路由
const roleRoutes = {
  admin: [
    '/admin/dashboard',
    '/admin/users',
    '/admin/settings'
  ],
  editor: [
    '/editor/dashboard',
    '/editor/articles'
  ],
  user: [
    '/user/profile',
    '/user/orders'
  ]
}

// 路由守卫中校验
router.beforeEach((to, from, next) => {
  const userRole = localStorage.getItem('role')
  const allowedRoutes = roleRoutes[userRole] || []
  
  if (!allowedRoutes.includes(to.path)) {
    next('/403')
  } else {
    next()
  }
})
```

### 4.2 动态添加路由

```javascript
// 登录后动态添加路由
async function login(credentials) {
  const user = await api.login(credentials)
  
  // 获取用户可访问的路由
  const accessibleRoutes = await api.getUserRoutes(user.role)
  
  // 动态添加到路由
  accessibleRoutes.forEach(route => {
    router.addRoute(route)
  })
  
  // 或者添加到特定父路由下
  router.addRoute('admin-layout', {
    path: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  })
  
  // 重定向到目标页面
  next({ ...to, replace: true })
}

// Vue3 删除路由
router.removeRoute('admin-dashboard')
```

### 4.3 按钮级权限

```vue
<!-- 权限指令 -->
<template>
  <button v-permission="'user:create'">创建用户</button>
  <button v-permission="'user:edit'">编辑用户</button>
  <button v-permission="['admin:delete', 'super:delete']">删除</button>
</template>

<script>
// 定义指令
Vue.directive('permission', {
  inserted(el, binding) {
    const { value } = binding
    const permissions = store.getters.permissions
    
    if (value) {
      const hasPermission = Array.isArray(value)
        ? value.some(p => permissions.includes(p))
        : permissions.includes(value)
      
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
})
</script>
```

---

## 五、进阶技巧

### 5.1 路由过渡动画

```vue
<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滑动效果 */
.slide-enter-active {
  animation: slide-in 0.3s;
}

.slide-leave-active {
  animation: slide-out 0.3s;
}

@keyframes slide-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slide-out {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}
</style>
```

### 5.2 路由元信息应用

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      roles: ['admin'],
      title: '管理后台',
      keepAlive: true,  // 缓存页面
      breadcrumb: ['首页', '管理']
    }
  }
]

// 在组件中使用
export default {
  computed: {
    pageTitle() {
      return this.$route.meta.title
    },
    
    breadcrumbs() {
      return this.$route.meta.breadcrumb || []
    }
  },
  
  activated() {
    // keep-alive 激活时调用
    console.log('页面被激活')
  },
  
  deactivated() {
    // keep-alive 停用时调用
    console.log('页面被停用')
  }
}
```

### 5.3 错误处理

```javascript
// 404 页面
const routes = [
  // ...其他路由
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue')
  }
]

// 全局错误处理
router.onError((error) => {
  if (error.message.includes('Navigation cancelled')) {
    // 导航被取消（重复点击等）
    return
  }
  
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    // 懒加载失败
    window.location.reload()
    return
  }
  
  console.error('路由错误:', error)
})
```

---

## 六、性能优化

### 6.1 路由级别优化

```javascript
const 优化策略 = {
  '路由懒加载': '减少初始包体积',
  '组件缓存': 'keep-alive 缓存常用页面',
  '预加载': '空闲时预加载可能访问的路由',
  '路由分割': '按业务模块拆分路由配置',
  '错误处理': '捕获并处理路由错误'
}
```

### 6.2 预加载策略

```javascript
// 空闲时预加载
router.afterEach((to, from) => {
  // 使用 requestIdleCallback
  requestIdleCallback(() => {
    // 预加载下一个可能的路由
    const nextRoutes = getPossibleNextRoutes(to)
    nextRoutes.forEach(route => {
      if (route.component?.__asyncLoader) {
        route.component.__asyncLoader()
      }
    })
  })
})

// 鼠标悬停预加载
<router-link 
  :to="{ name: 'Detail' }"
  @mouseenter="prefetchRoute('Detail')"
>
  查看详情
</router-link>

<script>
export default {
  methods: {
    async prefetchRoute(routeName) {
      const route = this.$router.resolve({ name: routeName })
      const component = route.matched[0]?.components.default
      
      if (component?.__asyncLoader) {
        await component.__asyncLoader()
      }
    }
  }
}
</script>
```

---

## 七、面试题精选

### 7.1 hash 模式和 history 模式的区别？
**回答要点**：
1. **URL 格式**：hash 带 #，history 不带
2. **原理**：hashchange vs popstate
3. **兼容性**：hash 支持 IE8，history 需要 IE10+
4. **后端配置**：history 需要后端配合处理 404
5. **美观度**：history 更符合常规网址

### 7.2 路由守卫的执行顺序？
**回答要点**：
1. 导航触发
2. 组件内 beforeRouteLeave（失活组件）
3. 全局 beforeEach
4. 路由独享 beforeEnter
5. 组件内 beforeRouteEnter（激活组件）
6. 全局 beforeResolve
7. 导航确认
8. 全局 afterEach
9. 组件内 beforeRouteUpdate

### 7.3 如何实现权限控制？
**回答要点**：
1. **路由守卫**：beforeEach 中校验 token 和角色
2. **动态路由**：登录后根据角色添加可访问路由
3. **按钮权限**：自定义指令控制显示隐藏
4. **403 页面**：无权限时跳转到错误页

---

## 八、学习建议

1. **动手实现**：手写一个迷你版路由
2. **阅读源码**：阅读 Vue Router 源码
3. **实践项目**：在实际项目中应用路由守卫和权限
4. **性能优化**：实践懒加载、预加载等优化

---

## 下一步
- 完成 quiz.md 自测题
- 实践路由权限控制
- 准备 Vue 面试冲刺
