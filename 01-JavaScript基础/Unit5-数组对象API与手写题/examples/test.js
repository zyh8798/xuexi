// let obj = {}
// let arr = []
// let date = new Date()
// let reg = new RegExp()
// let n = null
// console.log(Object.prototype.toString.call(obj))
// console.log(Object.prototype.toString.call(arr))
// console.log(Object.prototype.toString.call(date))
// console.log(Object.prototype.toString.call(reg))
// console.log(Object.prototype.toString.call(n))
// 防抖
// function debounce(fn, delay) {
//     // 每次调用都创建新的setTimeout 用dealy做倒计时,倒计时完了执行fn
//     let timer
//     return function (...args) {
//         if (timer) clearTimeout(timer)
//         timer = setTimeout(() => {
//             fn.apply(this, args)
//         }, delay)
//     }
// }
function myDeepClone(obj, map = new Map()) {

    if (typeof obj !== 'object' || obj === null) {

        return obj;
    }
    if (map.has(obj)) {

        return map.get(obj);
    }
    const res = Array.isArray(obj) ? [] : {};
    map.set(obj, res)

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let x = myDeepClone(obj[key], map);
            res[key] = x;
        }
    }
    return res;
}
let obj = {
    // a: 1,
}
obj.self = obj;
let obj2 = myDeepClone(obj)