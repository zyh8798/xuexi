// defineRective Dep Watch
class vue2Reactive {
    constructor(data) {
        this.observe(data);
    }

    observe(data) {
        if (typeof data !== 'object' || !data) return;
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive(obj, key, val) {
        const dep = new Dep()

        this.observe(val)
        let fn = (newVal) => {
            this.observe(newVal);
            dep.notify()
        }
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get() {
                if (Dep.target) {
                    dep.addSub(Dep.target)
                }
                return val
            },
            set(newVal) {
                if (val === newVal) return;
                val = newVal
                fn()
            }
        })
    }

}
class Dep {
    constructor() {
        this.subs = []
    }
    addSub(dep) {
        this.subs.push(dep)
    }
    notify() {
        this.subs.forEach(dep => {
            dep.update();
        })
    }
}
Dep.target = null
class Watcher {
    // 监听的对象,监听的属性,监听的回调函数
    constructor(data, keyName, cb) {
        console.log(data, keyName, cb);

        this.data = data;
        this.keyName = keyName
        this.cb = cb
        // 触发get收集依赖
        this.value = this.get()
    }
    get() {
        Dep.target = this
        const value = this.data[this.keyName]
        Dep.target = null;
        return value
    }

    update() {
        const oldValue = this.value
        const newValue = this.data[this.keyName]
        this.value = newValue
        this.cb(newValue, oldValue)
    }

}

const obj = {
    name: '朱英豪'
}

const reative = new vue2Reactive(obj)

new Watcher(obj, 'name', (newValue, oldValue) => {
    console.log('name变化了!', '新值:', newValue, '旧值:', oldValue);
})
obj.name = '朱英杰'