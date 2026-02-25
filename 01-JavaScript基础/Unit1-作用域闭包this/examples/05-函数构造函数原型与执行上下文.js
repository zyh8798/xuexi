/**
 * Unit 1 - 函数、构造函数、原型对象、eval、执行上下文堆栈
 * 运行：node 05-函数构造函数原型与执行上下文.js
 */

console.log('========== 一、函数、构造函数、原型对象 的关系 ==========\n');

/*
 * 【核心关系图】
 *
 *   function Person(name) { this.name = name; }   ← 构造函数（也是普通函数）
 *            │
 *            │  new Person() 时：
 *            │  1. 创建空对象 {}
 *            │  2. this 指向这个空对象
 *            │  3. 执行函数体，给 this 加属性
 *            │  4. 把新对象的 __proto__ 指向 Person.prototype
 *            │  5. 返回这个新对象
 *            ▼
 *   Person.prototype  ← 原型对象（每个函数都有，默认是空对象）
 *            │
 *            │  Person.prototype.constructor === Person  （互相引用）
 *            │
 *   const p = new Person('张三')
 *   p.__proto__ === Person.prototype  （实例通过 __proto__ 找到原型）
 *   p.xxx 找不到时，会去 p.__proto__（即 Person.prototype）上找  ← 原型链
 */

// 1. 函数 = 构造函数？（本质都是函数）
function Person(name) {
  this.name = name;
}

// 普通调用：this 指向 window/global，给全局加 name
// Person('test');  // 不推荐

// 用 new 调用：才是构造函数，创建实例
const p1 = new Person('张三');
console.log('p1.name:', p1.name); // 张三
console.log('p1.__proto__ === Person.prototype:', p1.__proto__ === Person.prototype); // true

// 2. 原型对象：共享属性和方法
Person.prototype.sayHi = function () {
  console.log('Hi, ' + this.name);
};
p1.sayHi(); // Hi, 张三  （p1 自己没有 sayHi，从原型上找到的）

// 3. 关系总结
console.log('\n--- 关系验证 ---');
console.log('Person 是函数:', typeof Person); // function
console.log('Person.prototype 是对象:', typeof Person.prototype); // object
console.log('Person.prototype.constructor === Person:', Person.prototype.constructor === Person); // true
console.log('p1.__proto__ === Person.prototype:', p1.__proto__ === Person.prototype); // true
console.log('原型链: p1 -> Person.prototype -> Object.prototype -> null');

console.log('\n========== 二、eval 是什么 ==========\n');

/*
 * eval(str) 会把字符串当作 JS 代码来执行
 *
 * 缺点：
 * - 有安全风险（可能执行恶意代码）
 * - 无法被引擎优化，性能差
 * - 会「污染」当前作用域
 *
 * 现代开发几乎不用，面试知道即可
 */

const x = 1;
eval('var x = 99; console.log("eval 内 x:", x)'); // 99，eval 可以访问并修改外部变量
console.log('eval 外 x:', x); // 99！eval 声明的 var 会泄漏到外部

// eval 会创建自己的执行上下文（第三种执行上下文类型）
eval('let y = 100; console.log("eval 内 y:", y)'); // 100
// console.log(y); // ReferenceError，let 在 eval 的块内，不会泄漏

console.log('\n========== 三、执行上下文堆栈（调用栈） ==========\n');

/*
 * 【执行上下文栈】= 调用栈 = Call Stack
 *
 * - 栈底：全局执行上下文（代码开始就有）
 * - 每次调用函数：压入一个「函数执行上下文」
 * - 函数执行完：弹出，回到上一个上下文
 *
 * 栈是「后进先出」：最后调用的先执行完
 */

function a() {
  console.log('  a 开始');
  b();
  console.log('  a 结束');
}

function b() {
  console.log('    b 开始');
  c();
  console.log('    b 结束');
}

function c() {
  console.log('      c 执行');
}

console.log('调用 a() 时的栈变化：\n');
console.log('1. 初始：[全局]');
console.log('2. 进入 a：[全局, a]');
console.log('3. 进入 b：[全局, a, b]');
console.log('4. 进入 c：[全局, a, b, c]');
console.log('5. c 执行完，弹出 c：[全局, a, b]');
console.log('6. b 执行完，弹出 b：[全局, a]');
console.log('7. a 执行完，弹出 a：[全局]\n');

console.log('实际输出：');
a();

console.log('\n--- 栈溢出示例（递归无终止条件）---');
// 取消注释会栈溢出：
// function stackOverflow() { stackOverflow(); }
// stackOverflow();  // Maximum call stack size exceeded
console.log('递归太深时，栈会满，报错 Maximum call stack size exceeded');
