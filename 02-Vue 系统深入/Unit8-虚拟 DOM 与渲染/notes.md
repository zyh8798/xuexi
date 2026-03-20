# Unit 8 - 虚拟 DOM 与渲染原理

## 学习目标
- 理解虚拟 DOM 的核心思想
- 掌握 diff 算法的原理和实现
- 理解 Vue 的渲染流程
- 手写简易版虚拟 DOM

---

## 一、为什么需要虚拟 DOM？

### 1.1 直接操作 DOM 的问题

```javascript
// 传统 jQuery 方式
const list = document.getElementById('list')
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li')
  li.textContent = `Item ${i}`
  list.appendChild(li)
}

// 问题：
// 1. 每次操作都会触发重排和重绘
// 2. 性能差，容易卡顿
// 3. 代码难以维护
```

### 1.2 虚拟 DOM 的优势

```javascript
const VDOM优势 = {
  '性能优化': '批量更新，减少真实 DOM 操作',
  '跨平台': '可以渲染到不同平台（Web、iOS、Android）',
  '可预测': '数据驱动，状态可追踪',
  '开发体验': '声明式编程，更直观'
}
```

---

## 二、虚拟 DOM 核心概念

### 2.1 什么是虚拟 DOM？

```javascript
// 虚拟 DOM = JavaScript 对象描述真实 DOM

// 真实 DOM
<div id="app" class="container">
  <h1>{{ title }}</h1>
  <ul>
    <li v-for="item in items">{{ item }}</li>
  </ul>
</div>

// 对应的虚拟 DOM
const vnode = {
  tag: 'div',
  data: {
    attrs: {
      id: 'app',
      class: 'container'
    }
  },
  children: [
    {
      tag: 'h1',
      children: ['Hello Vue']
    },
    {
      tag: 'ul',
      children: [
        { tag: 'li', children: ['Item 1'] },
        { tag: 'li', children: ['Item 2'] },
        { tag: 'li', children: ['Item 3'] }
      ]
    }
  ]
}
```

### 2.2 简化版 VNode 实现

```javascript
class VNode {
  constructor(tag, data, children, text) {
    this.tag = tag          // 标签名
    this.data = data        // 属性、事件等
    this.children = children // 子节点数组
    this.text = text        // 文本内容
    this.elm = null         // 对应的真实 DOM
    this.key = data?.key    // key 用于 diff
  }
}

// 创建 VNode 的辅助函数
function h(tag, data = {}, children = []) {
  return new VNode(tag, data, children)
}

function createTextVNode(text) {
  return new VNode(undefined, undefined, undefined, text)
}

// 使用
const vnode = h('div', { 
  attrs: { id: 'app' } 
}, [
  h('h1', {}, [createTextVNode('Hello')]),
  h('ul', {}, [
    h('li', { key: 1 }, [createTextVNode('Item 1')]),
    h('li', { key: 2 }, [createTextVNode('Item 2')])
  ])
])
```

---

## 三、渲染流程详解

### 3.1 完整渲染流程

```
模板（template）
    ↓
编译（compile）
    ↓
渲染函数（render）
    ↓
虚拟 DOM（vnode）
    ↓
挂载（mount）
    ↓
真实 DOM（element）
```

### 3.2 模板编译

```javascript
// 模板
const template = `
  <div :class="className">
    <h1 @click="handleClick">{{ title }}</h1>
    <ul v-if="showList">
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
`

// 编译后的渲染函数
function render() {
  return h('div', {
    class: this.className
  }, [
    h('h1', {
      on: { click: this.handleClick }
    }, [
      createTextVNode(this.title)
    ]),
    
    this.showList ? h('ul', [
      ...this.items.map(item => 
        h('li', { key: item.id }, [
          createTextVNode(item.name)
        ])
      )
    ]) : createTextVNode('')
  ])
}
```

### 3.3 挂载过程

```javascript
// 将虚拟 DOM 挂载到真实 DOM
function mount(vnode, container) {
  // 1. 创建真实 DOM
  const el = vnode.elm = document.createElement(vnode.tag)
  
  // 2. 设置属性
  if (vnode.data) {
    setProps(el, vnode.data)
  }
  
  // 3. 处理子节点
  if (vnode.children) {
    vnode.children.forEach(child => {
      mount(child, el)
    })
  } else if (vnode.text) {
    el.textContent = vnode.text
  }
  
  // 4. 添加到容器
  container.appendChild(el)
  
  return el
}

function setProps(el, props) {
  for (const key in props) {
    if (key.startsWith('on')) {
      // 事件
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, props[key])
    } else if (key === 'attrs') {
      // 普通属性
      for (const attr in props[key]) {
        el.setAttribute(attr, props[key][attr])
      }
    }
  }
}

// 使用
const app = document.getElementById('app')
mount(vnode, app)
```

---

## 四、diff 算法核心

### 4.1 同层比较策略

```javascript
// 核心思想：只比较同一层级的节点
// 时间复杂度：O(n)

旧节点树                    新节点树
┌───┐                      ┌───┐
│ A │                      │ A │
└─┬─┘                      └─┬─┘
  ├────┐                     ├────┐
  ▼    ▼                     ▼    ▼
┌───┐ ┌───┐                 ┌───┐ ┌───┐
│ B │ │ C │     diff        │ B │ │ D │
└─┬─┘ └─┬─┘     ───→        └─┬─┘ └─┬─┘
  │     │                      │     │
  ▼     ▼                      ▼     ▼
┌───┐ ┌───┐                 ┌───┐ ┌───┐
│ E │ │ F │                 │ E │ │ G │
└───┘ └───┘                 └───┘ └───┘

// 比较过程：
1. A vs A → 相同节点，继续比较子节点
2. B vs B → 相同，保留
3. C vs D → 不同，替换 C 为 D
4. E vs E → 相同，保留
5. F vs G → 不同，替换 F 为 G
```

### 4.2 完整 diff 实现

```javascript
function patch(oldVnode, newVnode) {
  // 1. 判断是否是同一个节点
  if (!isSameVnode(oldVnode, newVnode)) {
    // 不同，替换整个节点
    replaceNode(oldVnode, newVnode)
    return
  }
  
  // 2. 相同节点，更新属性和子节点
  updateProperties(oldVnode, newVnode)
  
  // 3. 更新子节点
  updateChildren(oldVnode, newVnode)
}

function isSameVnode(a, b) {
  return a.tag === b.tag && a.key === b.key
}

function updateProperties(oldVnode, newVnode) {
  const el = oldVnode.elm
  
  // 更新新增的属性
  for (const key in newVnode.data) {
    if (key !== oldVnode.data[key]) {
      updateProp(el, key, newVnode.data[key])
    }
  }
  
  // 删除移除的属性
  for (const key in oldVnode.data) {
    if (!(key in newVnode.data)) {
      removeProp(el, key)
    }
  }
}

function updateChildren(oldVnode, newVnode) {
  const oldCh = oldVnode.children || []
  const newCh = newVnode.children || []
  
  // 情况 1：新节点无子节点
  if (newCh.length === 0) {
    oldCh.forEach(child => child.elm.remove())
    return
  }
  
  // 情况 2：旧节点无子节点
  if (oldCh.length === 0) {
    newCh.forEach(child => mount(child, oldVnode.elm))
    return
  }
  
  // 情况 3：都有子节点，使用 diff 算法
  diffLists(oldCh, newCh, oldVnode.elm)
}
```

### 4.3 列表 diff 算法（核心）

```javascript
function diffLists(oldCh, newCh, parentElm) {
  let oldStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let newStartIdx = 0
  let newEndIdx = newCh.length - 1
  
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 跳过已处理的节点
    if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx]
    } else if (!oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIdx]
    }
    
    // 四种比较情况
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 情况 1：头头相同
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
      
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 情况 2：尾尾相同
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
      
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 情况 3：头尾相同（节点移动）
      patch(oldStartVnode, newEndVnode)
      parentElm.insertBefore(
        oldStartVnode.elm,
        oldEndVnode.elm.nextSibling
      )
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
      
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 情况 4：尾头相同（节点移动）
      patch(oldEndVnode, newStartVnode)
      parentElm.insertBefore(
        oldEndVnode.elm,
        oldStartVnode.elm
      )
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
      
    } else {
      // 情况 5：都不同，通过 key 查找
      const idxInOld = findKeyIndex(oldCh, oldStartIdx, oldEndIdx, newStartVnode.key)
      
      if (idxInOld === undefined) {
        // 新节点，创建并插入
        mount(newStartVnode, parentElm, oldStartVnode.elm)
      } else {
        // 移动节点
        const vnodeToMove = oldCh[idxInOld]
        patch(vnodeToMove, newStartVnode)
        parentElm.insertBefore(vnodeToMove.elm, oldStartVnode.elm)
        oldCh[idxInOld] = undefined
      }
      
      newStartVnode = newCh[++newStartIdx]
    }
  }
  
  // 处理剩余节点
  if (oldStartIdx > oldEndIdx) {
    // 旧节点先遍历完，添加新节点
    const referenceElm = newCh[newEndIdx + 1]?.elm
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      mount(newCh[i], parentElm, referenceElm)
    }
  } else if (newStartIdx > newEndIdx) {
    // 新节点先遍历完，删除旧节点
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      oldCh[i].elm.remove()
    }
  }
}

function findKeyIndex(children, start, end, key) {
  for (let i = start; i <= end; i++) {
    if (children[i]?.key === key) {
      return i
    }
  }
  return undefined
}
```

---

## 五、Vue3 优化

### 5.1 静态标记（Patch Flags）

```javascript
// Vue2：全量对比
const vnode1 = h('div', { id: 'app' }, [
  h('p', { class: 'text' }, ['static'])
])

// Vue3：编译时优化，标记动态节点
const vnode2 = h('div', { id: 'app' }, [
  h('p', { 
    class: 'text',
    [Symbol('__v_slot')]: dynamicText  // 动态内容
  }, [dynamicText])
], 1 /* TEXT */)  // Patch Flag：只有文本是动态的

// 更新时只对比动态部分
if (vnode.patchFlag & 1 /* TEXT */) {
  // 只更新文本节点
  updateText(vnode, newText)
}
```

### 5.2 静态提升（Hoisting）

```javascript
// Vue2：每次都创建
function render() {
  return h('div', [
    h('span', { class: 'icon' }),  // 每次都创建
    h('span', { class: 'icon' }),
    h('span', { class: 'icon' })
  ])
}

// Vue3：静态节点提升到渲染函数外
const _hoisted_1 = h('span', { class: 'icon' })
const _hoisted_2 = h('span', { class: 'icon' })
const _hoisted_3 = h('span', { class: 'icon' })

function render() {
  return h('div', [
    _hoisted_1,  // 直接复用
    _hoisted_2,
    _hoisted_3
  ])
}
```

### 5.3 事件缓存

```javascript
// Vue2：每次创建新函数
function render() {
  return h('button', {
    onClick: () => handleClick()  // 每次都新建函数
  })
}

// Vue3：缓存事件处理函数
const _cached_1 = () => handleClick()

function render() {
  return h('button', {
    onClick: _cached_1  // 复用缓存的函数
  })
}
```

---

## 六、性能优化实践

### 6.1 key 的正确使用

```javascript
// ❌ 错误：使用 index 作为 key
items.map((item, index) => 
  h(Item, { key: index })
)

// ✅ 正确：使用唯一 ID
items.map(item => 
  h(Item, { key: item.id })
)

// ✅ 更好：稳定的 key
// 避免使用随机数或 Date.now()
```

### 6.2 v-once 优化

```vue
<!-- 静态内容，只渲染一次 -->
<div v-once>
  <h1>{{ staticTitle }}</h1>
  <p>这段内容不会变化</p>
</div>

<!-- 大量静态内容的列表项 -->
<div v-for="item in items" :key="item.id">
  <div v-once>
    <!-- 静态部分 -->
    <div class="header">{{ item.staticInfo }}</div>
  </div>
  <!-- 动态部分 -->
  <div>{{ item.dynamicInfo }}</div>
</div>
```

### 6.3 深度响应式优化

```javascript
// ❌ 避免深层嵌套
data() {
  return {
    user: {
      profile: {
        address: {
          city: {
            name: 'Beijing'
          }
        }
      }
    }
  }
}

// ✅ 扁平化数据
data() {
  return {
    userId: 1,
    userName: '张三',
    userCity: '北京'
  }
}

// ✅ 使用 markRaw（不需要响应式的对象）
import { markRaw } from 'vue'

data() {
  return {
    chartInstance: markRaw(new Chart())  // 不转响应式
  }
}
```

---

## 七、手写完整示例

```javascript
// 完整的虚拟 DOM 实现
class MiniVue {
  constructor(options) {
    this.$options = options
    this._data = options.data.call(this)
    
    // 代理 data
    Object.keys(this._data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return this._data[key]
        },
        set(val) {
          this._data[key] = val
          this._update()
        }
      })
    })
    
    this._init()
  }
  
  _init() {
    this._vnode = null
    this.$mount(this.$options.el)
  }
  
  $mount(el) {
    el = typeof el === 'string' ? document.querySelector(el) : el
    
    if (this.$options.render) {
      this._renderProxy = this
      const vnode = this.$options.render.call(this)
      this._vnode = vnode
      this._patch(el, vnode)
    }
  }
  
  _patch(container, vnode) {
    if (!this._rootVnode) {
      // 首次挂载
      this._rootVnode = this._createElm(vnode)
      container.appendChild(this._rootVnode)
    } else {
      // 更新
      this._updatePre(self._rootVnode, vnode)
    }
  }
  
  _createElm(vnode) {
    if (typeof vnode.tag === 'string') {
      const el = document.createElement(vnode.tag)
      
      // 设置属性
      if (vnode.data) {
        for (const key in vnode.data) {
          if (key.startsWith('on')) {
            const event = key.slice(2).toLowerCase()
            el.addEventListener(event, vnode.data[key])
          } else {
            el.setAttribute(key, vnode.data[key])
          }
        }
      }
      
      // 处理子节点
      if (vnode.children) {
        vnode.children.forEach(child => {
          el.appendChild(this._createElm(child))
        })
      }
      
      vnode.elm = el
      return el
    } else {
      // 文本节点
      const el = document.createTextNode(vnode.text)
      vnode.elm = el
      return el
    }
  }
  
  _updatePre(oldVnode, newVnode) {
    if (!this.isSameVnode(oldVnode, newVnode)) {
      // 替换节点
      const newElm = this._createElm(newVnode)
      oldVnode.elm.parentNode.replaceChild(newElm, oldVnode.elm)
    } else {
      // 更新节点
      const el = oldVnode.elm
      
      // 更新属性
      if (newVnode.data) {
        for (const key in newVnode.data) {
          if (key.startsWith('on')) {
            // 事件暂不处理
          } else {
            el.setAttribute(key, newVnode.data[key])
          }
        }
      }
      
      // 更新子节点
      if (newVnode.children) {
        el.innerHTML = ''
        newVnode.children.forEach(child => {
          el.appendChild(this._createElm(child))
        })
      } else if (newVnode.text) {
        el.textContent = newVnode.text
      }
    }
  }
  
  isSameVnode(a, b) {
    return a.tag === b.tag
  }
  
  _update() {
    if (this.$options.render) {
      const vnode = this.$options.render.call(this)
      this._patch(null, vnode)
    }
  }
}

// 辅助函数
function h(tag, data, children) {
  if (Array.isArray(data) || typeof data === 'string') {
    children = data
    data = {}
  }
  
  return {
    tag,
    data,
    children: Array.isArray(children) ? children : [children]
  }
}

// 使用示例
new MiniVue({
  el: '#app',
  data() {
    return {
      count: 0
    }
  },
  render() {
    return h('div', [
      h('h1', `Count: ${this.count}`),
      h('button', {
        onclick: () => this.count++
      }, 'Increment')
    ])
  }
})
```

---

## 八、面试题精选

### 8.1 虚拟 DOM 真的比直接操作 DOM 快吗？
**回答要点**：
1. **不一定更快**：在少量 DOM 操作时，虚拟 DOM 有额外开销
2. **优势在于**：
   - 保证性能下限（不会太差）
   - 批量更新，减少重排重绘
   - 跨平台能力
3. **适用场景**：频繁更新、复杂 UI

### 8.2 diff 算法的时间复杂度？
**回答要点**：
1. **理论**：O(n³)，实际优化到 O(n)
2. **优化策略**：
   - 同层比较
   - key 加速查找
   - 四种情况快速匹配
3. **Vue3 进一步优化**：
   - 静态标记
   - 最长递增子序列

### 8.3 key 的作用是什么？
**回答要点**：
1. **唯一标识**：快速定位节点
2. **复用节点**：避免不必要的创建和销毁
3. **保持状态**：保持组件内部状态
4. **错误示例**：不能用 index（会导致状态错乱）

---

## 九、学习建议

1. **动手实现**：手写一个迷你版虚拟 DOM
2. **调试对比**：用 DevTools 观察 diff 过程
3. **性能测试**：对比有无 key 的性能差异
4. **源码阅读**：阅读 Vue 虚拟 DOM 相关源码

---

## 下一步
- 学习 Unit9：Vue Router 原理
- 完成 quiz.md 自测题
- 实践虚拟 DOM 性能优化
