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
<p>A。微任务在「当前宏任务」结束后、取下一个宏任务之前，全部清空。</p>
</details>

---

## 二、输出题（先自己推理，再运行验证）

### 3. 依次输出什么？

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
