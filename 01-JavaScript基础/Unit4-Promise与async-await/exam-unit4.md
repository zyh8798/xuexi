# Unit 4 单元测验（Promise · async/await）

> 建议：先独立完成，再对照答案。能手写简易 Promise、讲清链式与 async/await → Unit 4 可算过关。

---

## 一、选择题

### 1. Promise 的 executor 什么时候执行？

- A. 微任务  
- B. 同步（在 new Promise 时立即执行）  
- C. 下一个宏任务  
- D. 由 then 触发  

<details>
<summary>点击查看答案</summary>
<p>B。executor 在 new Promise 时同步执行；.then 的回调才是微任务。</p>
</details>

---

### 2. 以下代码输出顺序是？

```javascript
console.log(1);
Promise.resolve().then(() => console.log(2));
console.log(3);
```

- A. 1 2 3  
- B. 1 3 2  
- C. 2 1 3  
- D. 3 1 2  

<details>
<summary>点击查看答案</summary>
<p>B。同步 1、3；微任务 2。</p>
</details>

---

### 3. async 函数中，await 后面的代码何时执行？

- A. 同步执行  
- B. 作为微任务，在 Promise 落定后执行  
- C. 作为宏任务  
- D. 立即执行，不等待  

<details>
<summary>点击查看答案</summary>
<p>B。await 后面的代码相当于放进 Promise.then，是微任务，在 await 的 Promise  resolve 后执行。</p>
</details>

---

## 二、输出题（先推理再运行验证）

### 4. 依次输出什么？

```javascript
console.log('a');
new Promise((resolve) => {
  console.log('b');
  resolve();
}).then(() => console.log('c'));
console.log('d');
```

<details>
<summary>点击查看答案</summary>
<p>a、b、d、c。同步 a、b（executor）、d；微任务 c。</p>
</details>

---

### 5. 依次输出什么？

```javascript
async function fn() {
  console.log(1);
  await Promise.resolve();
  console.log(2);
}
fn();
console.log(3);
```

<details>
<summary>点击查看答案</summary>
<p>1、3、2。同步 1，fn() 里 await 后的 2 是微任务；同步 3；微任务 2。</p>
</details>

---

### 6. 依次输出什么？

```javascript
Promise.resolve(1)
  .then((v) => {
    console.log(v);
    return v + 1;
  })
  .then((v) => console.log(v));
```

<details>
<summary>点击查看答案</summary>
<p>1、2。第一个 then 打印 1 并 return 2，第二个 then 收到 2 并打印。</p>
</details>

---

## 三、手写题（必做）

### 7. 手写简易 Promise

要求：支持 `new MyPromise(executor)`、`resolve/reject` 各生效一次、`then(onFulfilled)` 在 resolve 后以微任务执行 onFulfilled。可不实现 reject 链和 catch。

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

- [ ] 选择题 3/3 正确  
- [ ] 输出题能解释顺序  
- [ ] 能手写简易 Promise（then + 状态）  

全部通过 → Unit 4 过关，可进入 Unit 5。
