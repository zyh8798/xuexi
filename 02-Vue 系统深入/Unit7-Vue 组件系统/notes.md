# Unit 7 - Vue 组件系统深度解析

## 学习目标
- 理解组件的本质和设计思想
- 掌握组件通信的完整方案
- 理解生命周期和组件实例
- 手写简易版组件系统

---

## 一、组件的本质

### 1.1 组件是什么？

```javascript
// 组件 = 配置对象 + 渲染逻辑
const MyComponent = {
  // 1. 数据
  data() {
    return {
      count: 0
    }
  },
  
  // 2. 属性
  props: {
    title: String,
    count: Number
  },
  
  // 3. 方法
  methods: {
    increment() {
      this.count++
    }
  },
  
  // 4. 生命周期
  created() {
    console.log('组件创建')
  },
  
  // 5. 模板
  template: `
    <div>
      <h2>{{ title }}</h2>
      <p>Count: {{ count }}</p>
      <button @click="increment">+1</button>
    </div>
  `
}

// 组件实例化
const vm = new Vue({
  components: {
    'my-component': MyComponent
  }
})
```

### 1.2 组件实例化过程

```javascript
// 简化版组件实例
class ComponentInstance {
  constructor(options) {
    this.$options = options
    this._data = null
    this._isMounted = false
    
    // 初始化
    this.init()
  }
  
  init() {
    // 1. 初始化 props
    this.props = this.resolveProps()
    
    // 2. 初始化 data（响应式）
    this.initData()
    
    // 3. 初始化计算属性
    this.initComputed()
    
    // 4. 调用 created 钩子
    if (this.$options.created) {
      this.$options.created.call(this)
    }
    
    // 5. 挂载
    this.$mount()
  }
  
  resolveProps() {
    const props = {}
    const propOptions = this.$options.props || {}
    
    for (const key in propOptions) {
      props[key] = this.$options.propsData?.[key]
    }
    
    return props
  }
  
  initData() {
    const data = this.$options.data
    
    if (typeof data === 'function') {
      this._data = data.call(this)
    } else {
      this._data = data || {}
    }
    
    // 代理到实例
    Object.keys(this._data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return this._data[key]
        },
        set(val) {
          this._data[key] = val
        }
      })
    })
  }
  
  $mount() {
    if (this.$options.el) {
      const el = document.querySelector(this.$options.el)
      const html = this.render()
      el.innerHTML = html
      this._isMounted = true
      
      // 调用 mounted 钩子
      if (this.$options.mounted) {
        this.$options.mounted.call(this)
      }
    }
  }
  
  render() {
    // 简化的模板渲染
    if (typeof this.$options.template === 'string') {
      return this.$options.template
    }
    return ''
  }
}

// 使用
const app = new ComponentInstance({
  el: '#app',
  data() {
    return {
      message: 'Hello Vue'
    }
  },
  created() {
    console.log('created:', this.message)
  },
  mounted() {
    console.log('mounted:', this.message)
  }
})
```

---

## 二、组件通信方案大全

### 2.1 Props / $emit（父子组件）

```vue
<!-- 父组件 -->
<template>
  <ChildComponent 
    :title="parentTitle"
    :count="count"
    @update="handleUpdate"
    @custom-event="handleCustom"
  />
</template>

<script>
export default {
  data() {
    return {
      parentTitle: '父组件标题',
      count: 0
    }
  },
  methods: {
    handleUpdate(newVal) {
      console.log('子组件更新了:', newVal)
    },
    handleCustom(payload) {
      console.log('自定义事件:', payload)
    }
  }
}
</script>

<!-- 子组件 -->
<template>
  <div>
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <button @click="updateParent">更新父组件</button>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  methods: {
    updateParent() {
      // 触发事件，通知父组件
      this.$emit('update', this.count + 1)
      
      // 触发自定义事件
      this.$emit('custom-event', {
        type: 'increment',
        value: this.count
      })
    }
  }
}
</script>
```

### 2.2 v-model 双向绑定

```vue
<!-- Vue2 语法糖 -->
<!-- 父组件 -->
<ChildComponent v-model="parentValue" />

<!-- 等价于 -->
<ChildComponent 
  :value="parentValue"
  @input="parentValue = $event"
/>

<!-- 子组件 -->
<script>
export default {
  props: ['value'],
  methods: {
    updateValue() {
      this.$emit('input', newValue)
    }
  }
}
</script>

<!-- Vue3 支持多个 v-model -->
<ChildComponent 
  v-model:title="title"
  v-model:count="count"
/>

<!-- 子组件 -->
<script setup>
const emit = defineEmits(['update:title', 'update:count'])

const updateTitle = (newVal) => {
  emit('update:title', newVal)
}
</script>
```

### 2.3 $attrs 和 $listeners（跨层级）

```vue
<!-- 祖父组件 -->
<template>
  <ParentComponent 
    :title="title"
    :count="count"
    :custom-attr="custom"
    @click="handleClick"
    @update="handleUpdate"
  />
</template>

<!-- 父组件（中转） -->
<template>
  <ChildComponent v-bind="$attrs" v-on="$listeners" />
</template>

<script>
export default {
  inheritAttrs: false  // 阻止自动继承
}
</script>

<!-- 子组件 -->
<template>
  <div>
    <!-- 直接访问所有祖先组件传递的属性 -->
    <p>{{ $attrs.title }}</p>
    <p>{{ $attrs.count }}</p>
    <p>{{ $attrs.customAttr }}</p>
  </div>
</template>
```

### 2.4 provide / inject（依赖注入）

```vue
<!-- 祖先组件 -->
<script>
export default {
  provide() {
    return {
      theme: this.theme,
      updateTheme: this.updateTheme
    }
  },
  data() {
    return {
      theme: 'dark'
    }
  },
  methods: {
    updateTheme(newTheme) {
      this.theme = newTheme
    }
  }
}
</script>

<!-- 后代组件（任意层级） -->
<script>
export default {
  inject: {
    theme: {
      from: 'theme',
      default: 'light'
    },
    updateTheme: {
      from: 'updateTheme'
    }
  },
  methods: {
    changeTheme() {
      this.updateTheme('dark')
    }
  }
}
</script>

<!-- Vue3 Composition API -->
<script setup>
import { inject } from 'vue'

const theme = inject('theme', 'light')
const updateTheme = inject('updateTheme')
</script>
```

### 2.5 Vuex 状态管理

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    user: null,
    todos: []
  },
  
  getters: {
    doubleCount: state => state.count * 2,
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  },
  
  mutations: {
    INCREMENT(state, payload) {
      state.count += payload.amount
    },
    SET_USER(state, user) {
      state.user = user
    }
  },
  
  actions: {
    async incrementAsync({ commit }, amount) {
      await sleep(1000)
      commit('INCREMENT', { amount })
    },
    
    async fetchUser({ commit }) {
      const user = await api.getUser()
      commit('SET_USER', user)
    }
  },
  
  modules: {
    cart: {
      state: {
        items: []
      },
      mutations: {
        ADD_TO_CART(state, item) {
          state.items.push(item)
        }
      }
    }
  }
})

// 组件中使用
export default {
  computed: {
    ...mapState(['count', 'user']),
    ...mapGetters(['doubleCount']),
    ...mapMutations(['INCREMENT']),
    ...mapActions(['fetchUser'])
  },
  methods: {
    increment() {
      this.INCREMENT({ amount: 1 })
    }
  }
}
```

### 2.6 Event Bus（事件总线）

```javascript
// utils/event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()

// 组件 A（发布）
EventBus.$emit('user-login', { userId: 123 })

// 组件 B（订阅）
EventBus.$on('user-login', (data) => {
  console.log('用户登录:', data)
})

// 清理
EventBus.$off('user-login')

// ⚠️ Vue3 中已废弃，推荐用 mitt 替代
```

---

## 三、生命周期详解

### 3.1 Vue2 生命周期

```javascript
export default {
  // 1. beforeCreate
  // - 实例刚创建
  // - data 和 methods 都不可用
  
  beforeCreate() {
    console.log('beforeCreate')
    console.log('data:', this.message)  // undefined
  },
  
  // 2. created
  // - 实例创建完成
  // - data 和 methods 可用
  // - DOM 还未挂载
  
  created() {
    console.log('created')
    console.log('data:', this.message)  // 可用
    this.fetchData()  // 发起异步请求
  },
  
  // 3. beforeMount
  // - 模板编译完成
  // - DOM 还未挂载
  
  beforeMount() {
    console.log('beforeMount')
  },
  
  // 4. mounted
  // - DOM 已挂载
  // - 可以操作 DOM
  
  mounted() {
    console.log('mounted')
    this.$el  // 可以访问根元素
    this.initChart()  // 初始化图表
  },
  
  // 5. beforeUpdate
  // - 数据变化
  // - DOM 还未更新
  
  beforeUpdate() {
    console.log('beforeUpdate')
    console.log('DOM:', this.$el.innerHTML)  // 旧内容
  },
  
  // 6. updated
  // - DOM 已更新
  
  updated() {
    console.log('updated')
    console.log('DOM:', this.$el.innerHTML)  // 新内容
  },
  
  // 7. beforeDestroy
  // - 实例销毁前
  // - 实例还完全可用
  
  beforeDestroy() {
    console.log('beforeDestroy')
    clearInterval(this.timer)
    this.$off()  // 移除事件监听
  },
  
  // 8. destroyed
  // - 实例已销毁
  
  destroyed() {
    console.log('destroyed')
  }
}
```

### 3.2 Vue3 生命周期

```vue
<script setup>
import { 
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onErrorCaptured,
  onRenderTracked,
  onRenderTriggered
} from 'vue'

// 对应关系：
// beforeCreate → setup()
// created → setup()
// beforeMount → onBeforeMount
// mounted → onMounted
// beforeUpdate → onBeforeUpdate
// updated → onUpdated
// beforeDestroy → onBeforeUnmount
// destroyed → onUnmounted

onMounted(() => {
  console.log('组件已挂载')
})

onBeforeUnmount(() => {
  console.log('组件即将卸载')
})
</script>
```

### 3.3 生命周期流程图

```
初始化阶段：
beforeCreate → created → beforeMount → mounted

更新阶段：
beforeUpdate → updated

销毁阶段：
beforeDestroy → destroyed

Vue3 新增：
onRenderTracked → 追踪依赖时触发
onRenderTriggered → 触发重新渲染时
onErrorCaptured → 捕获子组件错误时
```

---

## 四、组件高级特性

### 4.1 动态组件

```vue
<template>
  <!-- 根据 currentTab 切换组件 -->
  <component :is="currentTab" />
  
  <!-- 保持状态 -->
  <keep-alive>
    <component :is="currentTab" />
  </keep-alive>
  
  <!-- 条件缓存 -->
  <keep-alive :include="['Home', 'About']">
    <component :is="currentView" />
  </keep-alive>
</template>

<script>
import Home from './Home.vue'
import About from './About.vue'

export default {
  components: {
    Home,
    About
  },
  data() {
    return {
      currentTab: 'Home'
    }
  }
}
</script>
```

### 4.2 异步组件

```javascript
// Vue2
components: {
  AsyncComponent: () => import('./AsyncComponent.vue'),
  
  // 带加载状态
  AsyncComponentWithLoading: () => ({
    component: import('./AsyncComponent.vue'),
    loading: LoadingComponent,
    error: ErrorComponent,
    delay: 200,
    timeout: 3000
  })
}

// Vue3
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => 
  import('./AsyncComponent.vue')
)

// 带选项
const AsyncWithOptions = defineAsyncComponent({
  loader: () => import('./Foo.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000,
  suspensible: true
})
```

### 4.3 函数式组件

```vue
<!-- Vue2 函数式组件 -->
<!-- FunctionalComponent.vue -->
<template functional>
  <div class="functional">
    <h2>{{ props.title }}</h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  functional: true,
  props: {
    title: String
  }
}
</script>

<!-- Vue3 -->
<script setup>
defineProps({
  title: String
})
</script>

<template>
  <div class="functional">
    <h2>{{ title }}</h2>
    <slot></slot>
  </div>
</template>
```

---

## 五、组件设计模式

### 5.1 高阶组件（HOC）

```javascript
// withLogging.js
export function withLogging(WrappedComponent) {
  return {
    props: WrappedComponent.props,
    created() {
      console.log(`组件 ${WrappedComponent.name} 创建`)
    },
    render(h) {
      return h(WrappedComponent, {
        props: this.$props,
        on: this.$listeners
      })
    }
  }
}

// 使用
import MyComponent from './MyComponent.vue'
export default withLogging(MyComponent)
```

### 5.2 混入（Mixins）

```javascript
// mixins/pagination.js
export const paginationMixin = {
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize)
    }
  },
  methods: {
    nextPage() {
      if (this.page < this.totalPages) {
        this.page++
      }
    },
    prevPage() {
      if (this.page > 1) {
        this.page--
      }
    }
  }
}

// 使用
export default {
  mixins: [paginationMixin],
  data() {
    return {
      // 自动合并
    }
  }
}
```

### 5.3 组合式 API（Composition API）

```vue
<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// 可复用的逻辑
function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const double = computed(() => count.value * 2)
  
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  const reset = () => {
    count.value = initialValue
  }
  
  return {
    count,
    double,
    increment,
    decrement,
    reset
  }
}

// 在组件中使用
const { count, double, increment, reset } = useCounter(10)

onMounted(() => {
  console.log('count:', count.value)
})
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ double }}</p>
    <button @click="increment">+1</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

---

## 六、性能优化

### 6.1 组件优化策略

```javascript
const 优化策略 = {
  '避免重复渲染': '使用 v-once 标记静态内容',
  '列表优化': '必须使用 :key，避免使用 index',
  '事件销毁': 'beforeDestroy 时清理定时器和监听器',
  '懒加载': '路由和组件都使用异步加载',
  '缓存组件': 'keep-alive 缓存不活动的组件',
  '虚拟滚动': '大数据量列表使用虚拟滚动',
  '防抖节流': '频繁触发的事件使用防抖节流'
}
```

### 6.2 keep-alive 缓存

```vue
<template>
  <keep-alive 
    :include="['Home', 'About']"
    :exclude="['NoCache']"
    :max="10"
  >
    <router-view />
  </keep-alive>
</template>

<script>
export default {
  activated() {
    console.log('组件被激活')
  },
  deactivated() {
    console.log('组件被停用')
  }
}
</script>
```

---

## 七、面试题精选

### 7.1 组件通信方式有哪些？
**回答要点**：
1. **父子**：props/$emit、$parent/$children
2. **跨级**：$attrs/$listeners、provide/inject
3. **全局**：Vuex、Event Bus
4. **其他**：$refs、$root

### 7.2 生命周期应用场景？
**回答要点**：
- **created**：发起异步请求、初始化数据
- **mounted**：操作 DOM、初始化第三方库
- **beforeDestroy**：清理定时器、移除事件监听
- **activated/deactivated**：keep-alive 缓存组件

### 7.3 computed 和 watch 的区别？
**回答要点**：
- **computed**：有缓存，用于派生状态
- **watch**：无缓存，用于副作用和异步操作
- **immediate**：watch 可设置立即执行
- **deep**：watch 可深度监听

---

## 八、学习建议

1. **动手实践**：实现一个简易版组件系统
2. **对比学习**：对比 Options API 和 Composition API
3. **源码阅读**：阅读 Vue 组件相关源码
4. **项目应用**：在实际项目中使用各种通信方式

---

## 下一步
- 学习 Unit8：虚拟 DOM 与渲染
- 学习 Unit9：Vue Router 原理
- 完成 quiz.md 自测题
