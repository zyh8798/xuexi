# Unit 4 自测题

## 一、选择题

### 1. Promise 的 executor 什么时候执行？

- A. 微任务  
- B. 同步（在 new Promise 时立即执行）  
- C. 下一个宏任务  
- D. 由 then 触发  

<details>
<summary>点击查看答案</summary>
<p>B。new Promise(executor) 时，executor 会同步执行；.then 的回调才是微任务。</p>
</details>

---

### 2. then 返回的是什么？

- A. 原来的 Promise  
- B. 一个新的 Promise  
- C. then 回调的返回值  
- D. undefined  

<details>
<summary>点击查看答案</summary>
<p>B。then 总是返回一个新的 Promise，用于链式调用；新 Promise 的结果由 then 回调的 return 或抛错决定。</p>
</details>

---

### 3. async 函数 return 一个普通值，等价于？

- A. return 该值  
- B. return Promise.resolve(该值)  
- C. return Promise.reject(该值)  
- D. 不返回  

<details>
<summary>点击查看答案</summary>
<p>B。async 函数会把 return 的值包成 Promise.resolve(返回值)，所以调用 async 函数得到的一定是 Promise。</p>
</details>

---

## 二、输出题（先自己推理，再运行验证）

### 4. 依次输出什么？

```javascript
console.log(1);
const p = new Promise((resolve) => {
  console.log(2);
  resolve();
}).then(() => console.log(3));
console.log(4);
```

<details>
<summary>点击查看答案</summary>
<p>1、2、4、3。同步：1，executor 同步 2，4；微任务：3。</p>
</details>

---

### 5. 依次输出什么？

```javascript
Promise.resolve()
  .then(() => console.log(1))
  .then(() => console.log(2))
  .then(() => console.log(3));
```

<details>
<summary>点击查看答案</summary>
<p>1、2、3。链式 then，每个 then 回调依次作为微任务执行（同一轮或下一轮微任务）。</p>
</details>

---

## 三、手写题

### 6. 手写简易 Promise（要求：支持 then、pending/fulfilled/rejected 状态、resolve/reject 一次生效）

<details>
<summary>点击查看答案</summary>
<div>

```javascript
function MyPromise(executor) {
  this.state = 'pending';
  this.value = undefined;
  this.onFulfilledCallbacks = [];
  const resolve = (val) => {
    if (this.state !== 'pending') return;
    this.state = 'fulfilled';
    this.value = val;
    this.onFulfilledCallbacks.forEach((fn) => fn());
  };
  executor(resolve);
}
MyPromise.prototype.then = function (onFulfilled) {
  if (this.state === 'fulfilled') {
    queueMicrotask(() => onFulfilled(this.value));
  } else {
    this.onFulfilledCallbacks.push(() => queueMicrotask(() => onFulfilled(this.value)));
  }
};
```

</div>
</details>

---

## 自测标准

- [ ] 选择题能独立推理正确  
- [ ] 输出题能解释执行顺序  
- [ ] 能手写简易 Promise（含 then、状态）  

全部通过 → 可进入 exam-unit4.md 过关测验。
