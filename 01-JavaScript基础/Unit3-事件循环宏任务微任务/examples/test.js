// Promise 的 executor 是同步的，.then 的回调才是微任务
new Promise((resolve) => {
    console.log(0);  // 同步：先打印
    resolve();        // 必须 resolve，Promise 落定后 .then 才会进微任务队列
}).then(() => {
    console.log(1);  // 微任务：后打印
});
console.log(2);    // 同步：再打印
// 输出顺序：0  2  1