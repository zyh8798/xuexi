# Unit 2 自测题

## 一、选择题

### 1. 以下代码输出什么？

```javascript
function Foo() {}
const f = new Foo();
console.log(f.__proto__ === Foo.prototype);
```

- A. true  
- B. false  
- C. undefined  
- D. 报错  

<details>
<summary>点击查看答案</summary>
<p>A。new 创建的对象，其 __proto__ 指向构造函数的 prototype。</p>
</details>

---

### 2. 以下哪种继承方式会调用两次父类构造函数？

- A. 原型链继承  
- B. 寄生组合继承  
- C. 组合继承  
- D. 构造函数继承  

<details>
<summary>点击查看答案</summary>
<p>C。组合继承中，Child 构造函数里 Parent.call(this) 一次，Child.prototype = new Parent() 又一次。</p>
</details>

---

### 3. 以下代码输出什么？

```javascript
class A {}
class B extends A {}
const b = new B();
console.log(B.prototype.__proto__ === A.prototype);
```

- A. true  
- B. false  
- C. undefined  
- D. 报错  

<details>
<summary>点击查看答案</summary>
<p>A。extends 会让子类 prototype 的 __proto__ 指向父类 prototype，等价于寄生组合继承。</p>
</details>

---

### 4. Object.create(obj) 创建的对象，其 __proto__ 指向？

- A. Object.prototype  
- B. obj  
- C. null  
- D. 当前构造函数的 prototype  

<details>
<summary>点击查看答案</summary>
<p>B。Object.create(obj) 创建一个新对象，其 __proto__ 指向传入的 obj。</p>
</details>

---

## 二、输出题（先自己推理，再运行验证）

### 5. 输出什么？

```javascript
function Person() {}
Person.prototype.name = 'proto';
const p = new Person();
p.name = 'instance';
console.log(p.name);
delete p.name;
console.log(p.name);
```

<details>
<summary>点击查看答案</summary>
<p>instance 和 proto。第一次 p 自己有 name；delete 后自身没有，去原型找。</p>
</details>

---

### 6. 输出什么？

```javascript
console.log(Function.__proto__ === Function.prototype);
```

<details>
<summary>点击查看答案</summary>
<p>true。Function 是函数，函数的 __proto__ 指向 Function.prototype。Function 作为内置构造函数，自己创造了自己。</p>
</details>

---

## 三、手写题

### 7. 手写寄生组合继承

要求：实现 `inherit(Child, Parent)`，使 Child 能继承 Parent 的实例属性和原型方法，且只调用一次 Parent 构造函数。

<details>
<summary>点击查看答案</summary>
<div>

```javascript
function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}

function Child() {
  Parent.call(this);  // 继承实例属性
}
inherit(Child, Parent);
```

</div>
</details>

---

### 8. 手写简易 new

实现 `myNew(Constructor, ...args)`，效果等同于 `new Constructor(...args)`。

<details>
<summary>点击查看答案</summary>
<div>

```javascript
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return (typeof result === 'object' && result !== null) ? result : obj;
}
```

</div>
</details>

---

## 四、简答题

### 9. 说说 prototype 和 __proto__ 的区别

<details>
<summary>点击查看答案</summary>
<p>- prototype：只有函数有，指向原型对象，用来存放共享方法。<br>- __proto__：每个对象都有，指向其构造函数的 prototype，是查找属性时沿着的链。<br>- 实例.__proto__ === 构造函数.prototype</p>
</details>

---

### 10. ES6 Class 的 extends 和 super 分别对应 ES5 的什么？

<details>
<summary>点击查看答案</summary>
<p>- extends：相当于寄生组合继承，设置 Child.prototype = Object.create(Parent.prototype)，即 Child.prototype.__proto__ = Parent.prototype。<br>- super()：相当于 Parent.call(this, ...args)，在子类构造函数中调用父类构造函数。</p>
</details>
