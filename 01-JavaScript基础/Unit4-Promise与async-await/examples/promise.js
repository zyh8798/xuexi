// function MyPromise(executor) {
//     this.state = 'pending';
//     this.value = undefined;
//     this.onFulfilledCallbacks = [];
//     const resolve = (val) => {
//         if (this.state !== 'pending') return;
//         this.state = 'fulfilled';
//         this.value = val;
//         this.onFulfilledCallbacks.forEach((fn) => fn());
//     };
//     executor(resolve);
// }
// MyPromise.prototype.then = function (onFulfilled) {
//     if (this.state === 'fulfilled') {
//         queueMicrotask(() => onFulfilled(this.value));
//     } else {
//         console.log('没有resolve,所以放onFulfilledCallbacks了')
//         this.onFulfilledCallbacks.push(() => queueMicrotask(() => onFulfilled(this.value)));
//         console.log(this.onFulfilledCallbacks, '999999')
//     }
// };


// new MyPromise((resolve) => {
//     console.log(1)
//     resolve(666)
// }).then(res => {
//     console.log(res, 'res')
// })

function a() {
    this.x = []
    this.checkX = function () {
        console.log(this.x)
    }
    console.log('666')
}
a.prototype.test = function () {
    this.x.push(1)
}
let res = new a();
res.test();
res.checkX()

a();
// let a = new Promise(resolve => {
//     console.log(1)
//     resolve(111)
// }).then(res => {
//     console.log(222)
//     console.log(res, 'then')
//     return Promise.resolve('999')
// })
// a.then(res => {
//     console.log(res, 'res')
// })
// const fn = async () => {
//     let res = await a;
//     console.log(res, 'res')
// }
// fn()