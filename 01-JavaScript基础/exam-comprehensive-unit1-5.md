# JavaScript 基础综合测验（Unit 1 ~ 5）

> 覆盖：作用域/闭包/this、原型链/继承、事件循环、Promise/async-await、数组对象 API/手写题  
> 建议：先独立完成，再对照答案。全部做对或能讲清原理 → 01-JavaScript 基础阶段过关。

---

## 一、选择题（每题 2 分，共 20 分）

### 1. [Unit1] 以下代码输出什么？

```javascript
let a = 1;
function fn() {
  console.log(a);
  let a = 2;
}
fn();
```

- A. 1  
- B. 2  
- C. undefined  
- D. ReferenceError  

<details>
<summary>点击查看答案</summary>
<p>D。函数内 let a 形成块级作用域，声明前访问处于暂时性死区，报错。</p>
</details>

---

### 2. [Unit1] 箭头函数里的 this 能否用 call/apply/bind 改变？

- A. 可以  
- B. 不可以，由定义时外层作用域决定  

<details>
<summary>点击查看答案</summary>
<p>B。箭头函数没有自己的 this，call/apply/bind 传入的 this 会被忽略。</p>
</details>

---

### 3. [Unit2] 寄生组合继承相比组合继承，主要解决了什么？

- A. 无法向父类传参  
- B. 父类构造函数被调用两次  
- C. 引用类型被共享  

<details>
<summary>点击查看答案</summary>
<p>B。用 Object.create(Parent.prototype) 替代 new Parent()，避免执行父类构造函数。</p>
</details>

---

### 4. [Unit2] Object.prototype.__proto__ 的值是？

- A. Object  
- B. Function.prototype  
- C. null  
- D. undefined  

<details>
<summary>点击查看答案</summary>
<p>C。Object.prototype 是原型链终点，其 __proto__ 为 null。</p>
</details>

---

### 5. [Unit3] 以下输出顺序是？

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);
```

- A. 1 2 3 4  
- B. 1 4 3 2  
- C. 1 4 2 3  

<details>
<summary>点击查看答案</summary>
<p>B。同步 1、4；微任务 3；宏任务 2。</p>
</details>

---

### 6. [Unit4] Promise 的 executor 何时执行？

- A. 微任务  
- B. 同步（new Promise 时立即执行）  
- C. 由 then 触发  

<details>
<summary>点击查看答案</summary>
<p>B。executor 同步执行；.then 的回调才是微任务。</p>
</details>

---

### 7. [Unit5] 下列会改变原数组的是？

- A. slice  
- B. map  
- C. splice  
- D. filter  

<details>
<summary>点击查看答案</summary>
<p>C。splice 修改原数组；slice、map、filter 不改变。</p>
</details>

---

### 8. [Unit5] 深拷贝处理循环引用的目的是？

- A. 提高性能  
- B. 避免栈溢出 / 死循环  
- C. 让拷贝更快  

<details>
<summary>点击查看答案</summary>
<p>B。A 引用 B、B 引用 A 时，递归会无限循环；用 Map 缓存已访问对象可避免。</p>
</details>

---

### 9. [Unit3] await 后面的代码何时执行？

- A. 同步执行  
- B. 作为微任务，在 Promise 落定后  
- C. 作为宏任务  

<details>
<summary>点击查看答案</summary>
<p>B。await 后面的代码相当于放进 Promise.then，是微任务。</p>
</details>

---

### 10. [Unit1] for (let i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0) } 输出？

- A. 0 1 2  
- B. 3 3 3  

<details>
<summary>点击查看答案</summary>
<p>A。let 每次迭代有独立块级作用域，闭包捕获当次的 i。</p>
</details>

---

## 二、输出题（先推理再验证，共 30 分）

### 11. [Unit1] 依次输出什么？（5 分）

```javascript
const obj = {
  name: 'obj',
  fn: function () {
    return () => console.log(this.name);
  }
};
const getArrow = obj.fn();
getArrow();
const getArrow2 = obj.fn.call({ name: 'other' });
getArrow2();
```

<details>
<summary>点击查看答案</summary>
<p>obj，other。箭头函数继承定义时外层 fn 的 this。obj.fn() 时 this 是 obj；fn.call({ name: 'other' }) 时 this 是 { name: 'other' }。</p>
</details>

---

### 12. [Unit2] 输出什么？（5 分）

```javascript
function Foo() {
  this.value = 42;
}
Foo.prototype.getValue = function () {
  return this.value;
};
const foo = new Foo();
const getValue = foo.getValue;
console.log(getValue());
```

<details>
<summary>点击查看答案</summary>
<p>undefined。getValue 单独调用，this 指向全局（或 undefined 严格模式），this.value 为 undefined。</p>
</details>

---

### 13. [Unit3] 依次输出什么？（5 分）

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
<p>1、6、5、2、3、4。同步 1、6；微任务 5；第一个宏任务：2，其内微任务 3；第二个宏任务：4。</p>
</details>

---

### 14. [Unit4] 依次输出什么？（5 分）

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
<p>1、3、2。同步 1；await 后的 2 是微任务；同步 3；微任务 2。</p>
</details>

---

### 15. [Unit1+5] 依次输出什么？（5 分）

```javascript
let a = 3;
let obj = {
  a: 1,
  foo: function () {
    console.log(this.a);
  }
};
let fn = obj.foo;
fn();
```

<details>
<summary>点击查看答案</summary>
<p>undefined。fn() 直接调用，this 指向全局；let a 不会挂到全局对象上，this.a 为 undefined。</p>
</details>

---

### 16. [Unit5] 输出什么？（5 分）

```javascript
const arr = [1, 2, 3, [4, 5, [6, 7]]];
console.log(arr.flat());
console.log(arr.flat(2));
```

<details>
<summary>点击查看答案</summary>
<p>[1, 2, 3, 4, 5, [6, 7]]；[1, 2, 3, 4, 5, 6, 7]。flat() 默认拍平一层，flat(2) 拍平两层。</p>
</details>

---

## 三、手写题（必做，共 30 分）

### 17. [Unit5] 手写深拷贝（10 分）

要求：支持普通对象和数组，需处理**循环引用**（用 Map 缓存）。可不处理 Date、RegExp、Map、Set。

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

### 18. [Unit5] 手写防抖（10 分）

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

### 19. [Unit2] 手写 instanceof（10 分）

实现 `myInstanceof(obj, Constructor)`，判断 obj 的原型链上是否存在 Constructor.prototype。

<details>
<summary>点击查看答案</summary>
<div>

```javascript
function myInstanceof(obj, Constructor) {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

</div>
</details>

---

## 四、简答题（共 20 分）

### 20. [Unit1] 什么是词法作用域？和动态作用域有什么区别？（5 分）

<details>
<summary>参考答案</summary>
<p>词法作用域：变量的作用域在<strong>写代码时（定义时）</strong>就确定了，由代码的嵌套结构决定。查找变量时沿定义时的作用域链往外找。<br>动态作用域：变量的作用域在<strong>运行时</strong>由调用链决定。JS 是词法作用域。</p>
</details>

---

### 21. [Unit3] 画出一轮事件循环的顺序（从「取一个宏任务」到「取下一个」）。（5 分）

<details>
<summary>参考答案</summary>
<p>1）执行当前宏任务（同步代码）；2）清空微任务队列（所有微任务依次执行完）；3）若有渲染则渲染（浏览器）；4）取下一个宏任务，回到 1。微任务始终夹在相邻两个宏任务之间。</p>
</details>

---

### 22. [Unit2] 为什么推荐用寄生组合继承而不是组合继承？（5 分）

<details>
<summary>参考答案</summary>
<p>组合继承中 Child.prototype = new Parent() 会：1）执行一次 Parent 构造函数，造成重复；2）在 Child.prototype 上产生多余的父类实例属性。寄生组合继承用 Object.create(Parent.prototype) 只继承原型，不执行 Parent，只调用一次 Parent.call(this)。</p>
</details>

---

### 23. [Unit5] 用 reduce 实现 map 的功能，将 [1, 2, 3] 映射为 [2, 4, 6]。（5 分）

<details>
<summary>参考答案</summary>
<div>

```javascript
const arr = [1, 2, 3];
const result = arr.reduce((acc, item) => {
  acc.push(item * 2);
  return acc;
}, []);
console.log(result); // [2, 4, 6]
```

</div>
</details>

---

## 五、综合题（选做，加分）

### 24. [Unit1+3] 下面代码输出什么？若希望每秒输出 0、1、2，至少写一种改法。

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000);
}
```

<details>
<summary>参考答案</summary>
<p>输出：3 3 3。var 是函数作用域，循环结束后 i 为 3，三个回调共享同一个 i。<br>改法一：把 var 改成 let。<br>改法二：IIFE 传参：<code>(function(j) { setTimeout(function() { console.log(j); }, 1000); })(i);</code></p>
</details>

---

## 自测标准

| 模块 | 要求 |
|------|------|
| 选择题 | 8/10 以上正确 |
| 输出题 | 能独立推理再验证 |
| 手写题 | 深拷贝、防抖、instanceof 能独立写出 |
| 简答题 | 能脱稿说清 |

**全部通过 → 01-JavaScript 基础阶段过关。**
