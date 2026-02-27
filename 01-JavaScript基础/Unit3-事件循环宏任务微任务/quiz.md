# Unit 3 自测题

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
<p>A。微任务在「当前宏任务」结束后、取「下一个」宏任务之前，全部清空。<br>注意：先执行的是当前宏任务（如脚本本身），再清微任务，再执行下一个宏任务。所以是「夹在相邻两个宏任务之间」，而不是「微任务先于所有宏任务」。</p>
</details>

---

### 3. 关于 async/await 与微任务，正确的是？

- A. await 后面的代码和 Promise.then 的回调一样，都会作为微任务执行  
- B. await 后面的代码是宏任务  
- C. await 会阻塞整个线程，后面的代码要等很久才执行  
- D. 只有 Promise.then 是微任务，await 不是  

<details>
<summary>点击查看答案</summary>
<p>A。async 函数中，await 后面的代码相当于被放进「该 Promise 的 .then」里，所以和 .then 回调一样是微任务。await 不会阻塞主线程，只是把后续代码排进微任务队列。</p>
</details>

---

## 二、输出题（先自己推理，再运行验证）

### 4. 依次输出什么？

```javascript
console.log('a');
setTimeout(() => console.log('b'), 0);
Promise.resolve().then(() => console.log('c'));
console.log('d');
```

<details>
<summary>点击查看答案</summary>
<p>a、d、c、b。同步 a、d；微任务 c；宏任务 b。</p>
</details>

---

## 自测标准

- [ ] 选择题能独立推理正确  
- [ ] 输出题能解释每一行的执行顺序  
- [ ] 能画图讲清事件循环  

全部通过 → 可进入 exam-unit3.md 过关测验。
