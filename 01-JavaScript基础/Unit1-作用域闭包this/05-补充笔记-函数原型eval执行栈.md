# 补充：函数、构造函数、原型、eval、执行上下文堆栈

## 一、函数、构造函数、原型对象 的关系

### 1.1 三者是什么

| 概念 | 是什么 | 关系 |
|------|--------|------|
| **函数** | `function fn() {}`，可被调用的对象 | 普通函数 和 构造函数 本质都是函数 |
| **构造函数** | 用 `new` 调用的函数，用来创建对象 | 是函数的一种用法 |
| **原型对象** | 每个函数自带的 `fn.prototype` 属性，默认是 `{}` | 实例通过 `__proto__` 指向它 |

### 1.2 关系图

```
                    function Person(name) {
                      this.name = name;
                    }
                              │
                              │  new 时：创建对象，this 指向它，
                              │  并把新对象的 __proto__ 指向 Person.prototype
                              ▼
    Person.prototype  ◄───────┼───────►  Person.prototype.constructor === Person
         │                     │
         │  (实例的 __proto__)  │
         ▼                     │
    p.__proto__  ──────────────┘
         │
         │  找 p.xxx 时：p 没有 → 去 p.__proto__ 找 → 即 Person.prototype
         │  再没有 → 去 Person.prototype.__proto__（Object.prototype）→ null
         ▼
    原型链：p → Person.prototype → Object.prototype → null
```

### 1.3 关键点

1. **函数都有 `prototype`**（箭头函数没有）
2. **`prototype.constructor`** 指回函数本身
3. **`new` 出来的实例**，`实例.__proto__ === 构造函数.prototype`
4. **原型链**：访问属性时，自己没有就顺着 `__proto__` 往上找

---

## 二、eval 是什么

### 2.1 定义

`eval(str)` 把**字符串当作 JS 代码执行**。

```javascript
eval('1 + 2');        // 3
eval('var a = 1');    // 声明变量 a
eval('console.log(1)'); // 执行语句
```

### 2.2 执行上下文

eval 内部会创建**第三种执行上下文**（除了全局、函数之外）。

### 2.3 为什么少用

| 问题 | 说明 |
|------|------|
| 安全 | 可能执行用户输入的恶意代码 |
| 性能 | 无法被引擎优化 |
| 作用域 | `eval('var x=1')` 会泄漏到外部（var） |

### 2.4 替代方案

- `JSON.parse()` 解析 JSON
- `new Function()` 动态创建函数（相对更可控）

---

## 三、执行上下文堆栈（调用栈）

### 3.1 是什么

**执行上下文栈** = **调用栈** = **Call Stack**

用来管理代码执行时的环境，是一个**栈结构**（后进先出）。

### 3.2 栈里有什么

| 类型 | 何时入栈 | 何时出栈 |
|------|----------|----------|
| 全局上下文 | 代码开始执行 | 程序结束 |
| 函数上下文 | 调用函数时 | 函数执行完 return |
| eval 上下文 | 执行 eval 时 | eval 执行完 |

### 3.3 执行流程示意

```
function a() { b(); }
function b() { c(); }
function c() { }
a();

栈变化：
[全局] 
  → a()  [全局, a]
  → b()  [全局, a, b]
  → c()  [全局, a, b, c]
  → c 返回  [全局, a, b]
  → b 返回  [全局, a]
  → a 返回  [全局]
```

### 3.4 栈溢出

递归没有终止条件，栈会不断压入上下文，最终报错：

```
Maximum call stack size exceeded
```

---

## 四、面试口述要点

1. **函数和构造函数**：构造函数是用 `new` 调用的函数，用来创建实例
2. **原型**：`实例.__proto__ === 构造函数.prototype`，形成原型链
3. **eval**：把字符串当代码执行，有安全、性能问题，少用
4. **执行上下文栈**：管理执行环境，函数调用入栈，执行完出栈，栈满会溢出
