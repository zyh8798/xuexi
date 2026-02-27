# Unit 4 笔记：Promise、async/await

## 一、Promise 核心

### 1. 三种状态

- **pending**：初始状态
- **fulfilled**：成功，调用了 resolve
- **rejected**：失败，调用了 reject

状态一旦从 pending 变为 fulfilled 或 rejected，就不可再变。

### 2. 基本用法

```javascript
const p = new Promise((resolve, reject) => {
  // executor 同步执行
  setTimeout(() => resolve(1), 1000);
});
p.then((val) => console.log(val));  // .then 回调是微任务
```

### 3. 链式调用

- `then` 返回一个新的 Promise
- 若 then 回调 return 普通值，新 Promise 用该值 resolve
- 若 then 回调 return Promise，新 Promise 跟随该 Promise 的结果
- 若 then 回调抛错，新 Promise reject

### 4. 与事件循环

- Promise 的 **executor** 是同步执行的
- **.then / .catch 的回调** 是微任务，在 Promise 落定后入队

---

## 二、async/await

### 1. 本质

- `async` 函数一定返回 Promise（若 return 非 Promise，会被包成 Promise.resolve(...)）
- `await` 后面跟 Promise（或 thenable）；后面的代码相当于放进该 Promise 的 .then 里，即**微任务**

### 2. 错误处理

- await 的 Promise reject 时，会抛出异常，需要用 try/catch 或 .catch 捕获
- async 函数内未捕获的异常会变成返回的 Promise 的 reject

### 3. 与 Promise 对应

- `async function fn() { return 1; }` ≈ `() => Promise.resolve(1)`
- `await p` ≈ 把后续代码放进 `p.then(...)` 里

---

## 三、面试口述要点

1. Promise 三种状态、单次变更
2. then 返回新 Promise，支持链式
3. executor 同步，then 回调微任务
4. async 返回 Promise，await 后代码 = 微任务
5. 手写简易 Promise：状态、resolve/reject、then 入队微任务
