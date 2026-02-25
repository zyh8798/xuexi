# Unit 2 笔记：原型链、继承、ES6 Class

## 一、原型链核心概念

### 1. 三个关键概念

| 概念 | 谁有 | 指向/是什么 | 记忆 |
|------|------|-------------|------|
| **prototype** | 函数（构造函数） | 原型对象，存共享方法 | 工厂的共享仓库 |
| **__proto__** | 实例（对象） | 指向构造函数的 prototype | 实例的仓库钥匙 |
| **constructor** | prototype 上 | 指回构造函数 | 仓库门牌号 |

### 2. 关系图

```
function Person(name) { this.name = name; }
Person.prototype.sayHi = function() { ... };

const p = new Person('张三');

p.__proto__ === Person.prototype        // true
Person.prototype.constructor === Person // true

查找 p.sayHi 时：
p 自己没有 → p.__proto__（Person.prototype）→ 找到 sayHi
```

### 3. 原型链的尽头

```
p → Person.prototype → Object.prototype → null
```

- 所有对象最终都继承自 `Object.prototype`
- `Object.prototype.__proto__ === null`（原型链终点）

### 4. 属性查找规则

访问 `obj.xxx` 时：
1. 先看 obj 自身有没有
2. 没有则看 `obj.__proto__`（即其构造函数的 prototype）
3. 再没有继续往上找，直到 `null`，返回 `undefined`

---

## 二、new 做了什么？

```javascript
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);  // 1. 创建对象，__proto__ 指向 prototype
  const result = Constructor.apply(obj, args);         // 2. 执行构造函数，绑定 this
  return typeof result === 'object' && result !== null ? result : obj;  // 3. 返回
}
```

**简化版**：
1. 创建空对象，`obj.__proto__ = Constructor.prototype`
2. `Constructor.call(obj, ...args)` 执行构造函数
3. 若构造函数返回对象则返回该对象，否则返回 obj

---

## 三、继承方式对比

### 1. 原型链继承

```javascript
function Parent() { this.names = ['a', 'b']; }
function Child() {}
Child.prototype = new Parent();  // 子类原型 = 父类实例
```

**缺点**：引用类型被所有实例共享；无法向父类传参。

### 2. 构造函数继承（借用构造函数）

```javascript
function Child() {
  Parent.call(this);  // 在子类里调用父类，把属性拷到实例上
}
```

**缺点**：方法不能写在原型上，每次 new 都创建新函数，浪费内存。

### 3. 组合继承（原型链 + 借用构造函数）

```javascript
function Child() {
  Parent.call(this);  // 继承实例属性
}
Child.prototype = new Parent();  // 继承原型方法
Child.prototype.constructor = Child;
```

**缺点**：父类构造函数执行了两次；`Child.prototype` 上有多余的父类实例属性。

### 4. 寄生组合继承（推荐，面试必会）

```javascript
function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);  // 只继承原型，不执行 Parent
  Child.prototype.constructor = Child;
}

function Child() {
  Parent.call(this);  // 继承实例属性
}
inherit(Child, Parent);
```

**优点**：只调用一次父类构造函数；原型链干净；最接近 ES6 Class 的实现。

---

## 四、ES6 Class

### 1. 基本语法

```javascript
class Person {
  constructor(name) {
    this.name = name;  // 实例属性
  }
  sayHi() {            // 原型方法
    console.log('Hi, ' + this.name);
  }
  static create() {    // 静态方法，挂在 Person 上
    return new Person('default');
  }
}
```

### 2. Class 继承

```javascript
class Student extends Person {
  constructor(name, grade) {
    super(name);   // 必须先调用 super，才能用 this
    this.grade = grade;
  }
}
```

- `extends` 相当于设置 `Student.prototype.__proto__ = Person.prototype`
- `super()` 相当于 `Parent.call(this, ...args)`
- `super.xxx` 访问父类方法/属性

### 3. Class 与 ES5 对应关系

| ES6 Class | ES5 等价 |
|-----------|----------|
| class Foo {} | function Foo() {} |
| constructor() | 构造函数体 |
| 方法名() {} | Foo.prototype.方法名 = function() {} |
| static 方法() {} | Foo.方法 = function() {} |
| extends | 寄生组合继承 |
| super() | Parent.call(this) |

---

## 五、面试口述要点

1. **prototype 和 __proto__ 区别**：prototype 是构造函数的属性，__proto__ 是实例的属性，实例的 __proto__ 指向构造函数的 prototype。
2. **原型链**：对象找属性时，自身没有就沿 __proto__ 往上找，直到 null。
3. **寄生组合继承**：子类构造函数里 Parent.call(this)，再用 Object.create(Parent.prototype) 设置子类原型，避免重复调用父类构造函数。
4. **Class 本质**：语法糖，底层还是原型链，extends 对应寄生组合继承。
