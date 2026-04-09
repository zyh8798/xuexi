// ============================================
// 简易版 Vue2 响应式系统
// 核心思想：数据变化时自动通知依赖它的视图更新
// ============================================

/**
 * Vue2Reactive - 响应式处理类
 * 作用：把普通对象变成"响应式"对象
 * 原理：遍历对象每个属性，用 Object.defineProperty 拦截 get/set
 */
class Vue2Reactive {
    constructor(data) {
        this.observe(data)
    }

    /**
     * observe - 观察/遍历对象
     * 把 data 对象的所有属性都变成响应式
     */
    observe(data) {
        if (!data || typeof data !== 'object') return

        // 遍历 data 的每一个属性，逐个处理
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    /**
     * defineReactive - 定义响应式属性
     * 这是核心方法，用 Object.defineProperty 劫持属性的读取和设置
     * 
     * @param obj - 目标对象
     * @param key - 属性名
     * @param val - 属性值
     */
    defineReactive(obj, key, val) {
        // 【关键】每个属性都有一个专属的依赖收集器 Dep
        // 想象成：每个属性都有一个"订阅者名单"，记录谁在用它
        const dep = new Dep()

        // 如果属性值是对象，递归处理（比如 data.nested.count）
        this.observe(val)

        // 劫持这个属性的 get 和 set
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,

            /**
             * get - 读取属性时触发
             * 作用：收集依赖（谁在用这个属性，就记住谁）
             */
            get() {
                console.log(`访问 ${key}`)

                // 【依赖收集的关键代码】
                // Dep.target 是当前正在收集依赖的 Watcher（观察者）
                // 如果有 Watcher 正在读取这个属性，就把它加入订阅列表
                if (Dep.target) {
                    dep.addSub(Dep.target)  // 把这个 Watcher 加入该属性的订阅名单
                }
                return val
            },

            /**
             * set - 设置属性时触发
             * 作用：通知所有订阅者（数据变了，你们该更新了）
             */
            set(newVal) {
                if (newVal === val) return  // 值没变，不处理

                console.log(`更新 ${key}: ${val} -> ${newVal}`)
                val = newVal

                // 如果新值是对象，也要变成响应式
                this.observe(newVal)

                // 【通知更新】告诉所有订阅这个属性的 Watcher：数据变了！
                dep.notify()
            }
        })
    }
}

// ============================================
// Dep 类 - 依赖收集器（发布订阅模式）
// 作用：管理某个属性的所有订阅者（Watcher）
// 每个响应式属性都有一个对应的 Dep 实例
// ============================================
class Dep {
    constructor() {
        this.subs = []  // 订阅者列表，存储所有关心这个属性的 Watcher
    }

    // 添加订阅者
    addSub(sub) {
        this.subs.push(sub)
    }

    // 通知所有订阅者：数据变了，快更新！
    notify() {
        this.subs.forEach(sub => sub.update())
    }
}

/**
 * 【全局变量】Dep.target
 * 作用：临时存储"当前正在收集依赖的 Watcher"
 * 
 * 为什么需要这个？
 * - 当 Watcher 读取响应式数据时，会触发 getter
 * - getter 里需要知道"是谁在读取我"，才能把这个人加入订阅列表
 * - Dep.target 就是用来标记"当前这个人是谁"
 * 
 * 类比：你去商店登记会员，店员需要知道"你是谁"才能登记
 * Dep.target 就是记录"当前正在登记的人"
 */
Dep.target = null  // 初始为空，表示没有 Watcher 在收集依赖

// ============================================
// Watcher 类 - 订阅者/观察者
// 作用：监听某个数据的变化，变化时执行回调
// 类比：你订阅了某个公众号，有新文章时通知你
// ============================================
class Watcher {
    /**
     * @param vm - 数据对象（这里就是 data）
     * @param expOrFn - 要监听的属性名，如 'name'
     * @param cb - 回调函数，数据变化时执行
     */
    constructor(vm, expOrFn, cb) {
        this.vm = vm           // 保存数据对象
        this.expOrFn = expOrFn // 要监听的属性名
        this.cb = cb           // 数据变化时的回调函数

        // 【关键】创建 Watcher 时立即执行 get()，开始收集依赖
        this.value = this.get()
    }

    /**
     * get - 获取属性值，并触发依赖收集
     * 这是连接 Watcher 和 Dep 的桥梁
     */
    get() {
        // 【步骤1】把自己设为全局目标，告诉 Dep："是我要收集依赖！"
        Dep.target = this

        // 【步骤2】读取属性值，这会触发该属性的 getter
        // 比如 this.vm['name'] 会触发 data.name 的 get()
        const value = this.vm[this.expOrFn]

        // 【步骤3】收集完成，清空全局目标
        // 如果不清空，其他地方读取数据时会误收集
        Dep.target = null

        return value
    }

    /**
     * update - 数据变化时被 Dep.notify() 调用
     * 执行回调，通知外部数据变了
     */
    update() {
        const oldValue = this.value
        const newValue = this.vm[this.expOrFn]
        this.value = newValue
        this.cb(newValue, oldValue)  // 执行回调：新值，旧值
    }
}

// ============================================
// 使用示例 - 完整执行流程演示
// ============================================

// 1. 定义普通数据对象
const data = {
    name: 'Vue',
    age: 3,
    nested: {
        count: 1
    }
}

// 2. 变成响应式数据
// 内部会给每个属性添加 getter/setter，并创建对应的 Dep
const reactive = new Vue2Reactive(data)

// 3. 创建 Watcher 监听 name 属性
// 【执行顺序】：
//    Watcher.constructor() 
//    → Watcher.get() 
//    → Dep.target = thisWatcher
//    → data.name（触发 getter）
//    → dep.addSub(Dep.target) 把 Watcher 加入 name 的订阅列表
//    → Dep.target = null
new Watcher(data, 'name', (newVal, oldVal) => {
    console.log('name 变化了:', oldVal, '->', newVal)
})

// 4. 修改数据，触发更新
// 【执行顺序】：
//    data.name = 'Vue3'（触发 setter）
//    → dep.notify() 通知所有订阅者
//    → Watcher.update() 执行回调
//    → console.log('name 变化了: Vue -> Vue3')
data.name = 'Vue3'  // 触发更新