# Unit 2 单元测验（原型链 · 继承 · Class）

> 建议：先独立完成，再对照答案。全部做对或能讲清原理 → Unit 2 可算过关。

---

## 一、选择题

### 1. 以下代码输出什么？

```javascript
function Person() {}
const p = new Person();
console.log(p.constructor === Person);
```

- A. true  
- B. false  
- C. undefined  
- D. 报错  

<details>
<summary>点击查看答案</summary>
A。p 自身没有 constructor，沿原型链找到 Person.prototype.constructor，指向 Person。
</details>

---

### 2. 寄生组合继承相比组合继承，主要解决了什么问题？

- A. 无法向父类传参  
- B. 父类构造函数被调用两次  
- C. 引用类型被所有实例共享  
- D. 无法继承静态方法  

<details>
<summary>点击查看答案</summary>
B。寄生组合继承用 Object.create(Parent.prototype) 替代 new Parent()，避免执行父类构造函数，只调用一次 Parent.call(this)。
</details>

---

### 3. 以下代码输出什么？

```javascript
class Parent {
  constructor() {
    this.a = 1;
  }
}
class Child extends Parent {
  constructor() {
    console.log(this.a);
    super();
    console.log(this.a);
  }
}
new Child();
```

- A. undefined 1  
- B. 1 1  
- C. 报错  
- D. 1 undefined  

<details>
<summary>点击查看答案</summary>
C。子类 constructor 中必须先调用 super() 才能使用 this，在 super() 之前访问 this 会报错。
</details>

---

### 4. 以下关于原型链的说法，正确的是？

- A. 所有对象的 __proto__ 都指向 Object.prototype  
- B. Object.prototype.__proto__ 为 null  
- C. 普通对象没有 prototype 属性  
- D. 函数的 __proto__ 指向其 prototype  

<details>
<summary>点击查看答案</summary>
B。A 错：函数的 __proto__ 指向 Function.prototype；C 对但 B 更核心；D 错：函数的 __proto__ 指向 Function.prototype。B 是原型链终点的关键。
</details>

---

## 二、输出题

### 5. 输出什么？

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
undefined。getValue 被单独取出后调用，this 不再指向 foo（严格模式为 undefined，非严格为 window），this.value 为 undefined。
</details>

---

### 6. 输出什么？

```javascript
const obj = {};
console.log(obj.toString === Object.prototype.toString);
```

<details>
<summary>点击查看答案</summary>
true。obj 自身没有 toString，沿 __proto__ 找到 Object.prototype.toString。
</details>

---

## 三、手写题

### 7. 手写寄生组合继承（必做）

实现完整的寄生组合继承：Parent 有 name 属性和 sayHi 方法，Child 继承 Parent 并新增 grade 属性和 sayGrade 方法。

<details>
<summary>点击查看答案</summary>

```javascript
function Parent(name) {
  this.name = name;
}
Parent.prototype.sayHi = function () {
  console.log('Hi, ' + this.name);
};

function Child(name, grade) {
  Parent.call(this, name);
  this.grade = grade;
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
Child.prototype.sayGrade = function () {
  console.log('Grade: ' + this.grade);
};
```

</details>

---

### 8. 手写 instanceof

实现 `myInstanceof(obj, Constructor)`，判断 obj 的原型链上是否存在 Constructor.prototype。

<details>
<summary>点击查看答案</summary>

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

</details>

---

## 四、简答题

### 9. 画出 Person 和 Student（extends Person）的原型链关系图

<details>
<summary>点击查看答案</summary>

```
Student 实例
  __proto__ → Student.prototype
                __proto__ → Person.prototype
                              __proto__ → Object.prototype
                                            __proto__ → null
```

</details>

---

### 10. 为什么推荐用寄生组合继承而不是组合继承？

<details>
<summary>点击查看答案</summary>
组合继承中 Child.prototype = new Parent() 会：1）执行一次 Parent 构造函数，造成重复；2）在 Child.prototype 上产生多余的父类实例属性。寄生组合继承用 Object.create(Parent.prototype) 只继承原型，不执行 Parent，原型链干净，且只调用一次 Parent.call(this)。
</details>
