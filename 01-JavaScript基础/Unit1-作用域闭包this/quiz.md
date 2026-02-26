# Unit 1 自测题

## 一、选择题

### 1. 以下代码输出什么？

```javascript
var a = 1;
function fn() {
  console.log(a);
  var a = 2;
}
fn();
```

- A. 1  
- B. 2  
- C. undefined  
- D. 报错  

<details>
<summary>点击查看答案</summary>
<p>C。函数内 var a 提升，相当于先 `var a;` 再 `console.log(a)`，此时 a 是 undefined。</p>
</details>

---

### 2. 以下代码输出什么？

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```

- A. 0 1 2  
- B. 3 3 3  
- C. undefined undefined undefined  
- D. 报错  

<details>
<summary>点击查看答案</summary>
<p>B。var 是函数作用域，循环结束后 i=3，setTimeout 回调执行时取到的都是 3。</p>
</details>

---

### 3. 以下代码中，this 指向什么？

```javascript
const obj = {
  name: 'obj',
  fn: function() {
    return () => console.log(this.name);
  }
};
const fn = obj.fn();
fn();
```

- A. window/global  
- B. obj  
- C. undefined  
- D. fn  

<details>
<summary>点击查看答案</summary>
<p>B。箭头函数继承 fn 的 this。fn 是 obj.fn() 调用的，所以 fn 的 this 是 obj。返回的箭头函数继承这个 this。</p>
</details>

---

## 二、输出题（先自己推理，再运行验证）

### 4. 输出什么？

```javascript
console.log(a);
let a = 1;
```

<details>
<summary>点击查看答案</summary>
<p>ReferenceError。let 有暂时性死区，声明前访问会报错。</p>
</details>

---

### 5. 输出什么？

```javascript
function createFn() {
  let x = 1;
  return function() {
    console.log(++x);
  };
}
const f1 = createFn();
const f2 = createFn();
f1();  // ?
f1();  // ?
f2();  // ?
```

<details>
<summary>点击查看答案</summary>
<p>2, 3, 2。f1 和 f2 各自形成闭包，有独立的 x。f1 调用两次：2、3；f2 调用一次：2。</p>
</details>

---

### 6. 输出什么？

```javascript
const obj = {
  name: 'obj',
  sayName: function() {
    console.log(this.name);
  }
};
const say = obj.sayName;
say();
```

<details>
<summary>点击查看答案</summary>
<p>undefined（或空字符串）。say 是独立函数调用，默认绑定，this 指向 global/window，window.name 可能是空或 undefined。</p>
</details>

---

## 三、简答题（面试口述练习）

### 7. 什么是闭包？闭包会造成内存泄漏吗？

<details>
<summary>参考答案</summary>
<p>闭包是函数能够访问并「记住」其词法作用域中的变量，即使在该作用域外执行。形成条件：函数嵌套 + 内层引用外层变量 + 内层被外部使用。<br>可能造成内存泄漏：闭包会保持对外层变量的引用，若引用大对象且长期不释放，会导致内存无法回收。解决：用完后置 null，或避免不必要的闭包。</p>
</details>

---

### 8. var、let、const 的区别？

<details>
<summary>参考答案</summary>
<p>- 作用域：var 函数作用域，let/const 块级作用域<br>- 提升：var 提升且值为 undefined；let/const 有 TDZ，声明前访问报错<br>- 重复声明：var 可以，let/const 不可以<br>- const 必须初始化，且不能重新赋值（对象属性可改）</p>
</details>

---

### 9. this 的四种绑定规则是什么？

<details>
<summary>参考答案</summary>
<p>1. 默认绑定：独立调用，严格模式 undefined，非严格 window<br>2. 隐式绑定：obj.fn()，this 指向 obj<br>3. 显式绑定：call/apply/bind 传入的对象<br>4. new 绑定：new Fn()，this 指向新创建的对象<br>优先级：new > 显式 > 隐式 > 默认。箭头函数不绑定 this，继承外层。</p>
</details>

---

### 10. 什么是暂时性死区（TDZ）？

<details>
<summary>参考答案</summary>
<p>从块级作用域开始到 let/const 声明语句之间的区域。在这段时间内访问该变量会抛出 ReferenceError。var 没有 TDZ。</p>
</details>

---

## 四、画图题

### 11. 画出以下代码的作用域链

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
<p>inner 作用域 → outer 作用域 → 全局作用域。查找 a：inner 无 → outer 无 → 全局有。查找 b：inner 无 → outer 有。查找 c：inner 有。</p>
</details>

---

## 自测标准

- [ ] 选择题 4/4 正确  
- [ ] 输出题能独立推理正确  
- [ ] 简答题能脱稿口述  
- [ ] 能画出作用域链  

全部通过 → Unit 1 过关，可进入 Unit 2。
