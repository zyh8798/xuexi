# Unit 5 补充练习题

## 一、类型判断

### 1. 写出以下代码的输出

```javascript
console.log(typeof null);
console.log(typeof NaN);
console.log(typeof function(){});
console.log(typeof Symbol('a'));
console.log(typeof []);
console.log(typeof {});
```

<details>
<summary>点击查看答案</summary>
<p>
- "object"（null 特殊，返回 "object"）<br>
- "number"（NaN 是数字类型）<br>
- "function"<br>
- "symbol"<br>
- "object"（数组也是对象）<br>
- "object"
</p>
</details>

---

### 2. 下面哪个能准确区分 Date 和 Array？

```javascript
A. typeof
B. instanceof
C. Array.isArray
D. Object.prototype.toString.call
```

<details>
<summary>点击查看答案</summary>
<p>D。Object.prototype.toString.call() 可以区分所有类型。</p>
</details>

---

## 二、深拷贝

### 3. 下面深拷贝有什么问题？如何修复？

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  const res = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    res[key] = deepClone(obj[key]);
  }
  return res;
}

const obj = { a: 1 };
obj.self = obj;
const copy = deepClone(obj);
console.log(copy.self === copy); // 期望 true，实际？
```

<details>
<summary>点击查看答案</summary>
<p>问题：无法处理循环引用，会导致栈溢出。<br>修复：使用 Map 记录已拷贝的对象。</p>
</details>

---

### 4. 手写带循环引用的深拷贝

<details>
<summary>点击查看答案</summary>

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

</details>

---

## 三、防抖节流

### 5. 手写节流（throttle），并说明适用场景

<details>
<summary>点击查看答案</summary>

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

<p>适用场景：滚动监听、resize 事件、频繁点击按钮（如抢票）</p>
</details>

---

### 6. 实现一个「立即执行」的防抖

需求：触发后立即执行一次，如果接下来还有触发，则等 delay 后再执行一次。

<details>
<summary>点击查看答案</summary>

```javascript
function debounceImmediate(fn, delay) {
  let timer = null;
  let lastArgs = null;
  let lastThis = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
      lastArgs = args;
      lastThis = this;
    } else {
      fn.apply(this, args);
    }

    timer = setTimeout(() => {
      if (lastArgs !== null) {
        fn.apply(lastThis, lastArgs);
        lastArgs = null;
        lastThis = null;
      }
      timer = null;
    }, delay);
  };
}
```

</details>

---

## 四、数组 API

### 7. 下面代码的输出？

```javascript
const arr = [1, 2, 3, [4, 5, [6, 7]]];
console.log(arr.flat());
console.log(arr.flat(2));
console.log(arr.flat(Infinity));
```

<details>
<summary>点击查看答案</summary>
<p>
- [1, 2, 3, 4, 5, [6, 7]]（默认拍平一层）<br>
- [1, 2, 3, 4, 5, 6, 7]（拍平两层）<br>
- [1, 2, 3, 4, 5, 6, 7]（拍平所有层级）
</p>
</details>

---

### 8. 用 reduce 实现 map 的功能

```javascript
const arr = [1, 2, 3];
// 用 reduce 实现 [2, 4, 6]
```

<details>
<summary>点击查看答案</summary>

```javascript
const arr = [1, 2, 3];
const result = arr.reduce((acc, item) => {
  acc.push(item * 2);
  return acc;
}, []);
console.log(result); // [2, 4, 6]
```

</details>

---

### 9. 数组去重（至少写出 2 种方法）

```javascript
const arr = [1, 2, 2, 3, 3, 3, 4];
```

<details>
<summary>点击查看答案</summary>

<p>方法1：Set</p>

```javascript
[...new Set(arr)]
```

<p>方法2：filter + indexOf</p>

```javascript
arr.filter((item, index) => arr.indexOf(item) === index)
```

<p>方法3：reduce</p>

```javascript
arr.reduce((acc, item) => {
  if (!acc.includes(item)) acc.push(item);
  return acc;
}, [])
```

</details>

---

## 五、综合应用

### 10. 场景题：实现一个搜索防抖

需求：用户输入时，300ms 后发送请求。如果用户还在输入，取消上一次的请求。

```javascript
function debounceSearch(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 测试
const search = debounceSearch((keyword) => {
  console.log('发送搜索请求:', keyword);
}, 300);

search('a');
search('ab');
search('abc');
// 期望：只输出 "发送搜索请求: abc"
```

<details>
<summary>点击查看答案</summary>
<p>上面代码就是正确答案。防抖的核心是：每次触发都清除上一次的 timer。</p>
</details>

---

### 11. 场景题：实现一个节流滚动监听

需求：滚动时每 100ms 最多打印一次"滚动中"。

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

const handleScroll = throttle(() => {
  console.log('滚动中');
}, 100);

// 模拟快速滚动
setInterval(handleScroll, 16); // 每 16ms 触发一次
```

<details>
<summary>点击查看答案</summary>
<p>节流确保了 100ms 内只执行一次，符合预期。</p>
</details>

---

## 自测检查清单

- [ ] 理解 typeof 的局限性（null、数组都返回 object）
- [ ] 会用 instanceof 和 Object.prototype.toString 判断类型
- [ ] 能手写深拷贝（处理循环引用）
- [ ] 能手写防抖和节流
- [ ] 理解适用场景（防抖：搜索框；节流：滚动/按钮）
- [ ] 掌握 flat、reduce、filter、map 等数组 API
- [ ] 能用多种方式实现数组去重
