# Unit 5 单元测验（数组/对象 API · 类型判断 · 深拷贝）

> 建议：先独立完成，再对照答案。能手写深拷贝、防抖节流 → Unit 5 可算过关。

---

## 一、选择题

### 1. Object.prototype.toString.call([]) 的返回值是？

- A. "[object Object]"  
- B. "[object Array]"  
- C. "array"  
- D. []  

<details>
<summary>点击查看答案</summary>
<p>B。可用来准确判断数组等内置类型。</p>
</details>

---

### 2. 下列会改变原数组的是？

- A. slice  
- B. map  
- C. splice  
- D. filter  

<details>
<summary>点击查看答案</summary>
<p>C。splice 会修改原数组；slice、map、filter 不改变原数组。</p>
</details>

---

### 3. 深拷贝需要处理「循环引用」的目的是？

- A. 提高性能  
- B. 避免栈溢出 / 死循环  
- C. 让拷贝更快  
- D. 没有目的  

<details>
<summary>点击查看答案</summary>
<p>B。对象 A 引用 B，B 又引用 A 时，递归会无限循环；用 Map 存已访问对象可避免。</p>
</details>

---

## 二、手写题（必做）

### 4. 手写深拷贝

要求：支持普通对象和数组，需处理**循环引用**（用 Map 缓存已访问对象）。可不处理 Date、RegExp、Map、Set。

<details>
<summary>点击查看答案</summary>
<div>

```javascript
function deepClone(obj, map = new Map()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);
  const res = Array.isArray(obj) ? [] : {};
  map.set(obj, res);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      res[key] = deepClone(obj[key], map);
    }
  }
  return res;
}
```

</div>
</details>

---

### 5. 手写防抖

要求：`debounce(fn, delay)`，连续触发时只在最后一次触发后 delay 毫秒执行。

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

### 6. 手写节流

要求：`throttle(fn, delay)`，在 delay 时间内最多执行一次。

<details>
<summary>点击查看答案</summary>
<div>

```javascript
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

</div>
</details>

---

## 自测标准

- [ ] 选择题正确  
- [ ] 能手写深拷贝（含循环引用）  
- [ ] 能手写防抖、节流  

全部通过 → Unit 5 过关，01-JavaScript 基础阶段完成。
