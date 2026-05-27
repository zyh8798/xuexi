const defineReactive = function (target: object): any {
    return new Proxy(target, {
        get(target, key, receiver) {
            track(target, key)
            const res = Reflect.get(target, key, receiver)
            if (isObject(res)) {
                return defineReactive(res)
            }
            return res
        },
        set(target, key, value, receiver): boolean {
            trigger(target, key)
            return Reflect.set(target, key, value, receiver)
        }
    })
}
const isObject = (obj: any) => obj !== null && typeof obj === 'object';

const track = function (target: object, key: any) {
    let deps = targetMap.get(target)
    if (!deps) {
        targetMap.set(target, deps = new Map())
    }
    let dep = deps.get(key)
    if (!dep) {
        deps.set(key, dep = new Set())
    }
    if (activeEffect) {
        dep.add(activeEffect)
    }
}
const trigger = function (target: object, key: any) {
    let deps = targetMap.get(target)
    if (deps) {
        let dep = deps.get(key)
        dep.forEach((fn: Function) => {
            fn()
        })
    }
}

let activeEffect: Function | null = null

let targetMap = new WeakMap()

const effect = (fn: Function) => {
    activeEffect = fn as Function;
    fn()
    activeEffect = null
}

let obj = {
    name: '朱英豪'
}

const reactive = defineReactive(obj)
reactive.name = '朱英杰'
effect(() => {
    console.log('变化了', reactive.name)
})