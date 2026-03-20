# Unit 6 - Vue 响应式原理深度剖析

## 学习目标
- 理解 Vue 响应式的核心原理
- 掌握 Object.defineProperty 和 Proxy 的区别
- 手写简易版响应式系统
- 理解依赖收集和触发更新的完整流程

---

## 一、响应式原理演进

### 1.1 Vue2 vs Vue3 响应式实现

```javascript
// Vue2: Object.defineProperty
const obj = {}
Object.defineProperty(obj, 'name', {
  get() {
    console.log('读取 name')
    return this._name
  },
  set(val) {
    console.log('设置 name:', val)
    this._name = val
  }
})

// 缺点：
// 1. 无法检测对象属性的添加和删除
// 2. 无法监控数组下标变化
// 3. 需要递归遍历所有属性
```

```javascript
// Vue3: Proxy
const obj = { name: 'Vue', age: 3 }

const proxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log('读取:', key)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log('设置:', key, '=', value)
    return Reflect.set(target, key, value, receiver)
  }
})

// 优点：
// 1. 可以拦截属性的添加/删除
// 2. 可以拦截数组操作
// 3. 惰性代理，性能更好
```

---

## 二、Vue2 响应式实现

### 2.1 核心代码

```javascript
// 简易版响应式系统
class Vue2Reactive {
  constructor(data) {
    this.observe(data)
  }
  
  observe(data) {
    if (!data || typeof data !== 'object') return
    
    // 递归处理所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  
  defineReactive(obj, key, val) {
    const dep = new Dep()  // 依赖收集器
    
    // 递归处理子对象
    this.observe(val)
    
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log(`访问 ${key}`)
        // 依赖收集
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val
      },
      set(newVal) {
        if (newVal === val) return
        
        console.log(`更新 ${key}: ${val} -> ${newVal}`)
        val = newVal
        
        // 新值也需要是响应式的
        this.observe(newVal)
        
        // 通知更新
        dep.notify()
      }
    })
  }
}

// 依赖收集器（发布订阅模式）
class Dep {
  constructor() {
    this.subs = []  // 订阅者列表
  }
  
  addSub(sub) {
    this.subs.push(sub)
  }
  
  notify() {
    // 通知所有订阅者更新
    this.subs.forEach(sub => sub.update())
  }
}

// 订阅者（Watcher）
class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.expOrFn = expOrFn
    this.cb = cb
    this.value = this.get()
  }
  
  get() {
    Dep.target = this  // 将当前 watcher 设为全局目标
    const value = this.vm[this.expOrFn]
    Dep.target = null  // 重置
    return value
  }
  
  update() {
    const oldValue = this.value
    const newValue = this.vm[this.expOrFn]
    this.value = newValue
    this.cb(newValue, oldValue)
  }
}

// 使用示例
const data = {
  name: 'Vue',
  age: 3,
  nested: {
    count: 1
  }
}

const reactive = new Vue2Reactive(data)

// 创建观察者
new Watcher(data, 'name', (newVal, oldVal) => {
  console.log('name 变化了:', oldVal, '->', newVal)
})

data.name = 'Vue3'  // 触发更新
```

### 2.2 数组响应式处理

```javascript
// Vue2 重写数组方法
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

// 需要重写的数组方法
const methodsToPatch = [
  'push', 'pop', 'shift', 'unshift',
  'splice', 'sort', 'reverse'
]

methodsToPatch.forEach(method => {
  const original = arrayProto[method]
  
  Object.defineProperty(arrayMethods, method, {
    value(...args) {
      const result = original.apply(this, args)
      
      console.log(`数组方法 ${method} 被调用`)
      
      // 通知更新
      this.__ob__.dep.notify()
      
      return result
    },
    writable: true,
    configurable: true
  })
})

// 使用
const arr = [1, 2, 3]
arr.__proto__ = arrayMethods  // 原型链继承
arr.push(4)  // 触发通知
```

---

## 三、Vue3 响应式实现

### 3.1 Proxy 版本

```javascript
// Vue3 风格响应式
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      
      // 依赖收集
      track(target, key)
      
      // 如果值是对象，递归代理
      if (isObject(res)) {
        return reactive(res)
      }
      
      return res
    },
    
    set(target, key, value, receiver) {
      const oldValue = target[key]
      const result = Reflect.set(target, key, value, receiver)
      
      // 触发更新
      trigger(target, key)
      
      return result
    },
    
    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key)
      trigger(target, key)
      return result
    }
  })
}

// 依赖管理
const targetMap = new WeakMap()  // 存储依赖关系
let activeEffect = null  // 当前激活的 effect

// 依赖收集
function track(target, key) {
  if (!activeEffect) return
  
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
  }
}

// 触发更新
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  
  const dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => effect())
  }
}

// 副作用函数
function effect(fn) {
  activeEffect = fn
  fn()  // 执行时会触发 get，进行依赖收集
  activeEffect = null
}

// 使用示例
const state = reactive({
  count: 0,
  user: {
    name: 'Vue'
  }
})

effect(() => {
  console.log('count 变化了:', state.count)
})

state.count++  // 触发 effect
```

### 3.2 ref 实现

```javascript
function ref(value) {
  return {
    _value: value,
    get value() {
      track(this, 'value')
      return this._value
    },
    set value(newVal) {
      this._value = newVal
      trigger(this, 'value')
    }
  }
}

// 自动解包
function toValue(refOrValue) {
  return isRef(refOrValue) ? refOrValue.value : refOrValue
}

// 使用
const count = ref(0)
console.log(count.value)  // 0

effect(() => {
  console.log('ref 变化:', count.value)
})

count.value = 1  // 触发
```

---

## 四、computed 实现原理

### 4.1 计算属性核心

```javascript
function computed(getterOrOptions) {
  let getter
  let setter
  
  if (typeof getterOrOptions === 'function') {
    getter = getterOrOptions
    setter = () => {}
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  
  const _value = ref()
  let dirty = true  // 标记是否需要重新计算
  
  // 创建 effect
  const runner = effect(getter, {
    lazy: true,
    scheduler: () => {
      if (!dirty) {
        dirty = true
        trigger(_value, 'value')
      }
    }
  })
  
  return {
    get value() {
      if (dirty) {
        _value.value = runner()
        dirty = false
      }
      track(_value, 'value')
      return _value.value
    },
    set value(newVal) {
      setter(newVal)
    }
  }
}

// 使用
const price = ref(100)
const quantity = ref(2)

const total = computed(() => {
  return price.value * quantity.value
})

console.log(total.value)  // 200

price.value = 150  // dirty = true
console.log(total.value)  // 重新计算：300
```

---

## 五、watch 实现原理

### 5.1 基础实现

```javascript
function watch(source, cb, options = {}) {
  let getter
  
  if (typeof source === 'function') {
    getter = source
  } else if (isRef(source)) {
    getter = () => source.value
  } else if (isObject(source)) {
    getter = () => traverse(source)
  }
  
  let oldValue
  const job = () => {
    const newValue = getter()
    cb(newValue, oldValue)
    oldValue = newValue
  }
  
  const scheduler = options.immediate ? job : () => {}
  
  const runner = effect(getter, {
    lazy: true,
    scheduler
  })
  
  if (options.immediate) {
    oldValue = runner()
    job()
  } else {
    oldValue = runner()
  }
  
  return () => {
    // 停止监听
  }
}

// 深度遍历
function traverse(value, seen = new Set()) {
  if (!isObject(value)) return value
  
  if (seen.has(value)) return value
  seen.add(value)
  
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen)
    }
  } else if (isObject(value)) {
    for (const key in value) {
      traverse(value[key], seen)
    }
  }
  
  return value
}
```

---

## 六、性能优化策略

### 6.1 Vue2 的优化限制

```javascript
const Vue2问题 = {
  '初始化性能': '递归遍历所有属性，大数据量时慢',
  '内存占用': '每个属性都有 getter/setter',
  '动态属性': '需要用 Vue.set 或 this.$set',
  '数组限制': '不能直接通过索引修改'
}
```

### 6.2 Vue3 的性能优势

```javascript
const Vue3优化 = {
  '惰性代理': '只在访问时才递归代理子对象',
  'Map 存储': '用 Map 替代对象存储依赖，查找更快',
  'Set 去重': '同一个 effect 不会重复收集',
  '数组支持': '原生支持数组响应式'
}
```

---

## 七、面试题精选

### 7.1 Vue2 和 Vue3 响应式的区别？
**回答要点**：
1. **实现方式**：Object.defineProperty vs Proxy
2. **检测能力**：Vue2 无法检测属性增删，Vue3 可以
3. **数组支持**：Vue2 重写数组方法，Vue3 原生支持
4. **性能**：Vue3 惰性代理，初始化更快
5. **语法**：Vue3 需要手动 .value，Vue2 不需要

### 7.2 依赖收集是如何工作的？
**回答要点**：
1. **定义**：将 watcher/effect 与数据属性建立关联
2. **时机**：在 getter 中收集（读取数据时）
3. **存储**：Vue2 用 Dep，Vue3 用 WeakMap + Map + Set
4. **目的**：数据变化时知道要通知哪些 watcher

### 7.3 computed 和 watch 的区别？
**回答要点**：
1. **用途**：computed 用于派生状态，watch 用于副作用
2. **缓存**：computed 有缓存，watch 没有
3. **异步**：computed 不支持异步，watch 支持
4. **参数**：computed 无参数，watch 可获取新旧值

---

## 八、学习建议

1. **动手实现**：手写一个迷你版响应式系统
2. **对比学习**：对比 Vue2 和 Vue3 的实现差异
3. **调试源码**：在浏览器中调试 Vue 源码
4. **理解本质**：理解发布订阅模式和依赖收集

---

## 下一步
- 学习 Unit7：Vue 组件系统
- 学习 Unit8：虚拟 DOM 与渲染
- 学习 Unit9：Vue Router 原理
