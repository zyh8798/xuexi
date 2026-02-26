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

## 二、输出题（先推理再运行验证）

### 2. 依次输出什么？

```javascript
console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('end');
```

<details>
<summary>点击查看答案</summary>
<p>start、end、promise、timeout。</p>
</details>

---

## 自测标准

- [ ] 选择题正确  
- [ ] 输出题能解释执行顺序  
- [ ] 能画图讲清事件循环  

全部通过 → Unit 3 过关，可进入 Unit 4。
