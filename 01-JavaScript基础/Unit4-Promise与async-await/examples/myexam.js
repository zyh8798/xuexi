function MyPromise(executor) {
    this.state = 'pending'
    this.onFulfiledCallbacks = []
    this.value = undefined;
    const resolve = (value) => {
        if (this.state !== 'pending') return;
        this.state = 'fulfiled'
        this.value = value;
        this.onFulfiledCallbacks.forEach(fn => fn())
    }
    executor(resolve, reject)
}
MyPromise.prototype.then = function (onFulfiled) {
    if (this.state === 'fulfiled') {
        queueMicrotask(onFulfiled(this.value))
    } else {
        this.onFulfiledCallbacks.push(() => queueMicrotask(() => onFulfiled(this.value)))
    }
}
// let p = new Promise((resolve, reject) => {
//     resolve(111)
//     reject(666)
// })
// p.then(res => { console.log(res) }).catch(err => {
//     console.log(err)
// })