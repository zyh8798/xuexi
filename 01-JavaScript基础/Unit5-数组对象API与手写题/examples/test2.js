function myDeepClone(obj, map = new Map()) {
    if (typeof obj !== 'object' || typeof obj === 'null') return
    if (map.has(obj)) return map.get(obj)
    const res = Array.isArray(obj) ? [] : {}
    map.set(obj, res)
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            res[key] = myDeepClone(obj, map)
        }
    }
    return res
}
let obj = {
    a: 1,
    dsc: {
        title: '666'
    }
}
obj.self = obj
let obj2 = myDeepClone(obj)
console.log(obj2)