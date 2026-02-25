# 举例理解 prototype 和 __proto__

> 下方有示意图，帮助理解三者关系。

## 一、先看一个完整例子

```javascript
// 1. 定义一个「造人的工厂」——构造函数
function Person(name, age) {
  this.name = name;   // 每个人自己的名字
  this.age = age;     // 每个人自己的年龄
}

// 2. 在「工厂的共享仓库」里放一个方法——所有人生下来就会
Person.prototype.sayHi = function () {
  console.log('我是' + this.name + '，今年' + this.age + '岁');
};

// 3. 用 new 造两个人
const 小明 = new Person('小明', 18);
const 小红 = new Person('小红', 20);

// 4. 他们都有自己的 name、age
console.log(小明.name);  // 小明
console.log(小红.name);  // 小红

// 5. sayHi 不在他们自己身上，但能用！从哪来的？
小明.sayHi();  // 我是小明，今年18岁
小红.sayHi();  // 我是小红，今年20岁
```

**问题**：`sayHi` 明明没写在 `小明` 和 `小红` 身上，为什么能调用？

**答案**：他们去「共享仓库」里找的。这个共享仓库就是 `Person.prototype`。

---

## 二、prototype 和 __proto__ 用「工厂 + 仓库」来记

| 概念 | 比喻 | 谁有 | 指向谁 |
|------|------|------|--------|
| **prototype** | 工厂的**共享仓库** | 只有**构造函数**有 | 一个空对象（你往里面加方法） |
| **__proto__** | 每个产品自带的**仓库钥匙** | 每个**实例**都有 | 指向构造函数的 prototype |

### 对应关系

```
Person（工厂/构造函数）
    │
    │  Person.prototype  ← 工厂的共享仓库（只有工厂有）
    │       │
    │       │  里面放着：sayHi、constructor 等
    │       │
    ▼       ▼
小明、小红（实例）
    │
    │  小明.__proto__  ← 小明的仓库钥匙，指向 Person.prototype
    │  小红.__proto__  ← 小红的仓库钥匙，也指向 Person.prototype
    │
    └── 所以小明.sayHi() 时：小明自己没有 → 用钥匙开门 → 去 Person.prototype 找 → 找到了！
```

---

## 三、一步步验证

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  console.log('Hi, ' + this.name);
};

const 小明 = new Person('小明');

// 小明自己有 name 吗？有
console.log('小明.name:', 小明.name);  // 小明

// 小明自己有 sayHi 吗？没有
console.log('小明.hasOwnProperty("sayHi"):', 小明.hasOwnProperty('sayHi'));  // false

// 小明的「仓库钥匙」指向哪？
console.log('小明.__proto__ === Person.prototype:', 小明.__proto__ === Person.prototype);  // true

// 仓库是谁的？
console.log('Person.prototype 是:', Person.prototype);  // { sayHi: [Function], constructor: [Function: Person] }

// 仓库的 constructor 指回工厂
console.log('Person.prototype.constructor === Person:', Person.prototype.constructor === Person);  // true
```

---

## 四、查找过程：p.xxx 时发生了什么？

```javascript
小明.sayHi();
```

**步骤**：

1. 看 `小明` 自己有没有 `sayHi` → **没有**
2. 看 `小明.__proto__`（即 Person.prototype）有没有 → **有**
3. 调用找到的 `sayHi`，并且 `this` 指向 `小明`

如果 Person.prototype 上也没有呢？继续往上：

4. 看 `Person.prototype.__proto__`（即 Object.prototype）有没有
5. 再没有就继续往上，直到 `null`，返回 `undefined`

这就是**原型链**：一层一层往上找。

---

## 五、一句话区分

| | 谁有 | 是什么 | 指向 |
|---|------|--------|------|
| **prototype** | 构造函数 | 共享仓库（对象） | 存共享方法和 constructor |
| **__proto__** | 实例 | 仓库钥匙（引用） | 指向构造函数的 prototype |

**记忆**：`prototype` 是「工厂的仓库」，`__proto__` 是「实例的钥匙，用来打开这个仓库」。

---

## 示意图

![prototype 与 __proto__ 关系图](./prototype-__proto__-关系图.png)

> 若图片不显示，可在 Cursor 项目资源中查看，或运行 `examples/05-*.js` 结合代码理解。

---

## 六、为什么需要这样设计？

如果不用原型，每个实例都要自己存一份 `sayHi`：

```javascript
function Person(name) {
  this.name = name;
  this.sayHi = function () { console.log('Hi'); };  // 每个人一份，浪费内存
}
const p1 = new Person('a');
const p2 = new Person('b');
// p1.sayHi 和 p2.sayHi 是两个不同的函数，占两份内存
```

用原型：`sayHi` 只存一份在 `Person.prototype` 上，所有实例共用。

```javascript
Person.prototype.sayHi = function () { ... };  // 只存一份
// p1.sayHi 和 p2.sayHi 是同一个函数，省内存
```
