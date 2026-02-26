# Unit 1 单元测验（作用域 · 闭包 · this）

> 建议：先独立完成，再对照答案。全部做对或能讲清原理 → Unit 1 可算过关。

---

## 一、选择题

### 1. 以下代码输出什么？

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
- D. 报错  

<details>
<summary>点击查看答案</summary>
<p>D（ReferenceError）。函数内 let a 形成块级作用域，在声明前访问 a 处于暂时性死区，会报错。</p>
</details>

---

### 2. 以下代码输出什么？

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

- A. 0 1 2  
- B. 3 3 3  
- C. undefined undefined undefined  
- D. 报错  

<details>
<summary>点击查看答案</summary>
<p>A。let 在 for 循环中每次迭代有独立的块级作用域，setTimeout 回调闭包捕获的是当次的 i，所以输出 0 1 2。</p>
</details>

---

### 3. 以下代码中，箭头函数里的 this 指向什么？

```javascript
const obj = {
  name: 'obj',
  sayName: () => {
    console.log(this.name);
  }
};
obj.sayName();
```

- A. obj  
- B. window/global  
- C. undefined  
- D. sayName  

<details>
<summary>点击查看答案</summary>
<p>B（或 C 在严格模式）。箭头函数没有自己的 this，继承「定义时」外层作用域的 this。对象字面量在全局，外层 this 是 window/global（严格模式下为 undefined），所以不是 obj。</p>
</details>

---

### 4. 以下哪种方式可以改变箭头函数内部的 this？

- A. fn.call(obj)  
- B. fn.apply(obj)  
- C. fn.bind(obj)()  
- D. 以上都不行，箭头函数的 this 由定义时外层决定  

<details>
<summary>点击查看答案</summary>
<p>D。箭头函数忽略 call/apply/bind 传入的 this，只能沿用定义时词法作用域里的 this。</p>
</details>

---

## 二、输出题（先推理再运行验证）

### 5. 依次输出什么？

```javascript
var x = 10;
function foo() {
  console.log(x);
  x = 20;
}
foo();
console.log(x);
```

<details>
<summary>点击查看答案</summary>
<p>10，20。foo 内没有声明 x，用的是全局的 x。先打印 10，再改为 20，最后全局打印 20。</p>
</details>

---

### 6. 依次输出什么？

```javascript
function outer() {
  var a = 1;
  function inner() {
    console.log(a);
    a = 2;
  }
  return inner;
}
var fn = outer();
fn();
fn();
```

<details>
<summary>点击查看答案</summary>
<p>1，2。inner 闭包引用 outer 的 a。第一次 fn() 打印 1 并把 a 改为 2；第二次 fn() 打印 2。</p>
</details>

---

### 7. 输出什么？

```javascript
const obj = {
  name: 'obj',
  fn: function() {
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
<p>obj，other。箭头函数继承「定义时」外层 fn 的 this。obj.fn() 时 this 是 obj；obj.fn.call({ name: 'other' }) 时 fn 的 this 是 { name: 'other' }，返回的箭头函数继承的便是 other。</p>
</details>

---

### 8. 输出什么？

```javascript
console.log(typeof a);
let a = 1;
```

<details>
<summary>点击查看答案</summary>
<p>ReferenceError。let 在声明前处于暂时性死区，连 typeof 访问也会报错（与 var 不同）。</p>
</details>

---

## 三、简答题（面试口述练习）

### 9. 什么是词法作用域？和动态作用域有什么区别？

<details>
<summary>参考答案</summary>
<p>词法作用域：变量的作用域在**写代码时（定义时）**就确定了，由代码的嵌套结构决定。查找变量时沿定义时的作用域链往外找。<br>动态作用域：变量的作用域在**运行时**由调用链决定，看函数是在哪里被调用的。JS 是词法作用域，不是动态作用域。</p>
</details>

---

### 10. 闭包为什么会保留外层变量？「字节」存在哪里？

<details>
<summary>参考答案</summary>
<p>内层函数引用外层变量时，引擎会把外层作用域（环境）和内层函数绑在一起，这样内层在别处执行时还能沿作用域链找到这些变量。所以外层变量只要被闭包引用，就不会被 GC 回收。<br>这些变量占用的内存存在「闭包环境对象」里，由引擎挂在函数对象上；函数被回收时，对应的环境也会被回收。</p>
</details>

---

### 11. 普通函数的 this 和箭头函数的 this 分别由什么决定？call/apply/bind 对谁有效？

<details>
<summary>参考答案</summary>
<p>普通函数：this 由**调用方式**决定（默认 / 隐式 / 显式 / new），可以用 call/apply/bind 改变。<br>箭头函数：没有自己的 this，**继承定义时**所在作用域的 this；call/apply/bind 对箭头函数无效，不能改它的 this。</p>
</details>

---

### 12. 什么叫「内存泄漏」？闭包导致的是哪一种？

<details>
<summary>参考答案</summary>
<p>狭义：已经没有任何引用指向某块内存，但运行时没回收（引擎/原生 bug）。<br>广义（前端常说的）：还有引用（如闭包、未解绑的监听器）导致大对象长期不被回收，内存居高不下。<br>闭包导致的是后者——引用一直存在，只是拖着大对象不用，属于「不必要的内存保留」。避免闭包引用大对象，或用完置 null。</p>
</details>

---

## 四、分析 / 画图题

### 13. 画出下面代码中，inner 被调用时的作用域链；并说明查找 a、b、c 时分别在哪一层找到。

```javascript
var a = 1;
function outer() {
  var b = 2;
  function inner() {
    var c = 3;
    console.log(a, b, c);
  }
  inner();
}
outer();
```

<details>
<summary>参考答案</summary>
<p>作用域链：inner 作用域 → outer 作用域 → 全局作用域。<br>- a：inner 无 → outer 无 → 全局有（找到 1）<br>- b：inner 无 → outer 有（找到 2）<br>- c：inner 有（找到 3）</p>
</details>

---

### 14. 下面代码会输出什么？为什么？若希望每秒输出 0、1、2，可以怎么改（至少写一种）？

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
```

<details>
<summary>参考答案</summary>
<p>输出：3 3 3。var 是函数作用域，循环结束后 i 为 3，三个 setTimeout 回调共享同一个 i，1 秒后都打印 3。<br>改法一：把 var 改成 let，每次迭代有独立块级作用域。<br>改法二：用 IIFE 包一层，传参保存当次 i：<code>(function(j) { setTimeout(function() { console.log(j); }, 1000); })(i);</code></p>
</details>

---

## 自测标准

- [ ] 选择题 4/4 正确  
- [ ] 输出题能独立推理再验证  
- [ ] 简答题能脱稿说清  
- [ ] 能画出作用域链并写出循环闭包改法  

全部通过 → Unit 1 过关。
