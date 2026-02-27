# Unit 3 单元测验（事件循环 · 宏任务 · 微任务）

> 建议：先独立完成，再对照答案。能解释任意输出题 → Unit 3 可算过关。

---

## 一、选择题

### 1. 以下代码输出顺序是？

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
```

- A. 1 2 3 4  
- B. 1 4 3 2  
- C. 1 4 2 3  
- D. 1 2 4 3  

<details>
<summary>点击查看答案</summary>
<p>B。同步：1、4；微任务：3；宏任务：2。</p>
</details>

---

### 2. 微任务在什么时候执行？

- A. 当前宏任务执行完后、下一个宏任务之前  
- B. 当前宏任务执行前  
- C. 所有宏任务执行完后  
- D. 随机顺序  

<details>
<summary>点击查看答案</summary>
<p>A。先执行完当前宏任务（如脚本），再清空所有微任务，再取下一个宏任务。微任务夹在相邻两个宏任务之间。</p>
</details>

---

### 3. 关于 async/await，正确的是？

- A. await 后面的代码作为微任务执行  
- B. await 后面的代码是宏任务  
- C. await 会阻塞主线程直到 Promise 完成  
- D. await 只能用在 Promise 里  

<details>
<summary>点击查看答案</summary>
<p>A。await 后面的代码相当于放进 Promise.then，是微任务。await 不阻塞主线程，只是把后续代码排进微任务队列。</p>
</details>

---

## 二、输出题（先推理再运行验证）

### 4. 依次输出什么？

```javascript
console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');
```

<details>
<summary>点击查看答案</summary>
<p>start、end、promise、timeout。同步 → 微任务 → 宏任务。</p>
</details>

---

### 5. 依次输出什么？

```javascript
console.log(1);
setTimeout(() => {
  console.log(2);
  Promise.resolve().then(() => console.log(3));
}, 0);
setTimeout(() => console.log(4), 0);
Promise.resolve().then(() => console.log(5));
console.log(6);
```

<details>
<summary>点击查看答案</summary>
<p>1、6、5、2、3、4。同步 1、6；微任务 5；第一个宏任务（第一个 setTimeout）：2，其内微任务 3；第二个宏任务（第二个 setTimeout）：4。</p>
</details>

---

### 6. 依次输出什么？

```javascript
async function fn() {
  console.log(1);
  await console.log(2);
  console.log(3);
}
fn();
console.log(4);
```

<details>
<summary>点击查看答案</summary>
<p>1、2、4、3。1、2 同步；await 前的 await console.log(2) 本身是同步执行的（只是 await 后面的代码会变成微任务）；4 同步；微任务：3（await 后面的代码）。</p>
</details>

---

### 7. 依次输出什么？

```javascript
console.log('a');
Promise.resolve()
  .then(() => {
    console.log('b');
    return Promise.resolve('c');
  })
  .then((res) => console.log(res));
console.log('d');
```

<details>
<summary>点击查看答案</summary>
<p>a、d、b、c。同步 a、d；第一个 then（微任务）：b，return Promise.resolve('c') 会产生额外的微任务；第二个 then 要等这个 Promise 落定后再执行，所以接着输出 c。</p>
</details>

---

### 8. 依次输出什么？

```javascript
setTimeout(() => console.log(1), 0);
new Promise((resolve) => {
  console.log(2);
  resolve();
}).then(() => console.log(3));
console.log(4);
```

<details>
<summary>点击查看答案</summary>
<p>2、4、3、1。Promise 的 executor 是同步的，所以先 2；同步 4；微任务 3；宏任务 1。</p>
</details>

---

## 三、简答题

### 9. 画出一轮事件循环的顺序（从「取一个宏任务」到「取下一个」）

<details>
<summary>点击查看答案</summary>
<p>1）执行当前宏任务（同步代码）；2）清空微任务队列（所有微任务依次执行完）；3）若有渲染则渲染（浏览器）；4）取下一个宏任务，回到 1。微任务始终夹在相邻两个宏任务之间。</p>
</details>

---

### 10. 为什么「脚本本身」算一个宏任务？这样设计有什么好处？

<details>
<summary>点击查看答案</summary>
<p>脚本加载并执行时，引擎把它当作一个完整的宏任务放入队列。这样：先跑完脚本里的同步代码，再执行脚本里注册的微任务（如 Promise.then），再执行脚本里注册的宏任务（如 setTimeout），顺序清晰；同时保证微任务不会「抢在」脚本同步代码之前执行。</p>
</details>

---

## 自测标准

- [ ] 选择题 3/3 正确  
- [ ] 输出题能独立推理并解释每一行顺序  
- [ ] 简答题能脱稿说清  
- [ ] 能画图讲清事件循环  

全部通过 → Unit 3 过关，可进入 Unit 4。
