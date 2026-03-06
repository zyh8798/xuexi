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
// function myDeepClone(obj, map = new Map()) {

//     if (typeof obj !== 'object' || obj === null) {

//         return obj;
//     }
//     if (map.has(obj)) {

//         return map.get(obj);
//     }
//     const res = Array.isArray(obj) ? [] : {};
//     map.set(obj, res)

//     for (const key in obj) {
//         if (Object.prototype.hasOwnProperty.call(obj, key)) {
//             let x = myDeepClone(obj[key], map);
//             res[key] = x;
//         }
//     }
//     return res;
// }
// let obj = {
//     // a: 1,
// }
// obj.self = obj;
// let obj2 = myDeepClone(obj)

// let arr = [1, 2, 3, 3, 3, 3, 3, 3, 4]
// // set
// let nArr = new Set(arr)
// console.log(nArr)
// // filter + indexOf
// let nArr2 = arr.filter((item, index) => index === arr.indexOf(item))
// console.log(nArr2)
// // reduce
// let nArr3 = arr.reduce((acc, item) => {
//     if (!acc.includes(item)) {
//         acc.push(item)
//     }
//     return acc
// }, [])
// console.log(nArr3)

// 10. 场景题：实现一个搜索防抖
// 需求：用户输入时，300ms 后发送请求。如果用户还在输入，取消上一次的请求。

function cancelDebounce(fn, delay) {
    let timer
    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}
// this.a = 3
// let obj2 = {
//     a: 4
// }
// let obj = {
//     a: 1,
//     foo: () => {
//         console.log(this.a)
//     },
//     fee: function () {
//         this.foo.call(obj2)
//     }
// }
// // obj.foo()
// obj.fee()
// // let fn = obj.foo
// // fn()