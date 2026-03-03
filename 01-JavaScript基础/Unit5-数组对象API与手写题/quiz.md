# Unit 5 自测题

## 一、选择题

### 1. typeof [] 的结果是？

- A. "array"  
- B. "object"  
- C. "Array"  
- D. "[]"  

<details>
<summary>点击查看答案</summary>
<p>B。typeof 无法区分数组与普通对象，都返回 "object"。</p>
</details>

---

### 2. 如何准确判断是否为数组？

- A. typeof arr === "array"  
- B. arr instanceof Array  
- C. Object.prototype.toString.call(arr) === "[object Array]"  
- D. B 和 C 都可以  

<details>
<summary>点击查看答案</summary>
<p>D。instanceof 和 Object.prototype.toString 都可；Array.isArray(arr) 也行。</p>
</details>

---

### 3. 防抖和节流的区别？

- A. 防抖是延迟执行，节流是立即执行  
- B. 防抖是「最后一次触发后 delay 执行」，节流是「固定间隔内最多执行一次」  
- C. 没有区别  
- D. 防抖用于点击，节流用于输入  

<details>
<summary>点击查看答案</summary>
<p>B。防抖：连续触发只执行最后一次；节流：固定时间内只执行一次。</p>
</details>

---

## 二、手写题（先自己写再对照）

### 4. 手写简易深拷贝（可不处理 Date/RegExp/循环引用，先能拷贝普通对象和数组）

<details>
<summary>点击查看答案</summary>
<div>

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  const res = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      res[key] = deepClone(obj[key]);
    }
  }
  return res;
}
```

</div>
</details>

---

### 5. 手写防抖

<details>
<summary>点击查看答案</summary>
<div>

```javascript
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

</div>
</details>

---

## 自测标准

- [ ] 能区分 typeof / instanceof / toString  
- [ ] 能手写简易深拷贝  
- [ ] 能手写防抖、节流  

全部通过 → 可进入 exam-unit5.md。
