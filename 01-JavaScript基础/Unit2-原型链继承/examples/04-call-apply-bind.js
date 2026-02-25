/**
 * call / apply / bind —— 改变 this 指向
 * 运行：node 04-call-apply-bind.js
 *
 * 建议：先看「一、概念」和「二、对比」，再做「四、练习题」，最后对答案。
 */

console.log('========== 一、this 是什么？ ==========\n');

// 函数里的 this 由「怎么被调用」决定，不是由「在哪定义」决定。
function sayThis() {
  console.log('this 是:', this);
}

// 直接调：严格模式下 this 是 undefined，非严格模式是 global/window
sayThis();

// 作为对象方法调：this 指向那个对象
const obj = { name: 'obj', sayThis };
obj.sayThis(); // this 是 obj

// new 调：this 指向新创建的对象
const instance = new (function () {
  console.log('new 时 this 是:', this);
  return this;
})();

console.log('\n========== 二、call / apply / bind 在干什么？ ==========\n');

// 本质：让「某个函数」在「我指定的 this」下执行一次（call/apply）或返回一个绑好 this 的新函数（bind）。

function greet(prefix, suffix) {
  console.log(prefix + this.name + suffix);
}

const user = { name: '小明' };
const cat = { name: '喵喵' };

// 函数.call(指定的 this, 参数1, 参数2, ...)
greet.call(user, '你好，', '！');   // 你好，小明！
greet.call(cat, '猫叫：', '~');    // 猫叫：喵喵~

// 函数.apply(指定的 this, [参数1, 参数2, ...])  参数是数组
greet.apply(user, ['Hi, ', '.']);  // Hi, 小明.

// 函数.bind(指定的 this)(参数1, 参数2)  返回一个新函数，之后调用时 this 已固定
const greetUser = greet.bind(user);
greetUser('【', '】');  // 【小明】

console.log('\n========== 三、一句话记 ==========\n');
console.log('call(thisArg, a, b, c)  → 用 thisArg 当 this，立刻执行，参数逐个传');
console.log('apply(thisArg, [a,b,c]) → 用 thisArg 当 this，立刻执行，参数用数组');
console.log('bind(thisArg)(a,b,c)    → 用 thisArg 当 this，返回新函数，稍后执行');

console.log('\n========== 四、练习题 ==========\n');

// ----------------------------------------
// 题 1：看代码写输出
// ----------------------------------------
function fn1() {
  console.log(this.x);
}
const o1 = { x: 100 };
fn1.call(o1);  // 输出？

// ----------------------------------------
// 题 2：看代码写输出
// ----------------------------------------
function fn2(a, b) {
  console.log(this.name, a + b);
}
const o2 = { name: 'O2' };
fn2.call(o2, 10, 20);  // 输出？

// ----------------------------------------
// 题 3：看代码写输出
// ----------------------------------------
function fn3() {
  return this.age;
}
const o3 = { age: 18 };
const bound = fn3.bind(o3);
console.log(bound());  // 输出？

// ----------------------------------------
// 题 4：用 call 指定 this，得到 10
// sum 里用到了 this.a 和 this.b；o4 有 a:3、b:7。请写一行代码：用 sum 和 call 让 sum 的 this 指向 o4，得到 10。
// ----------------------------------------
function sum() {
  return this.a + this.b;
}
const o4 = { a: 3, b: 7 };

// 请写一行代码，用 sum 和 call 得到 10：
// const result = ???
// console.log(result);

// ----------------------------------------
// 题 4b：借用 Array 的 join（类数组用 join）
// 类数组：有 length、有 0,1,2... 下标，但不是真数组，没有 .join 方法。
// join 内部会遍历 this[0]、this[1]、...、this[length-1]，用分隔符拼成字符串。
// 请用 Array.prototype.join.call(???, ???) 让类数组 arrayLike 借用 join，用 '-' 连接，得到 "a-b-c"。
// ----------------------------------------
const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };

// arrayLike.join('-') 会报错，因为对象没有 join。用 call 把 join 的 this 指到 arrayLike：
// const str = ???
// console.log(str);  // 期望 "a-b-c"

// ----------------------------------------
// 题 5：看代码写输出（稍微综合）
// ----------------------------------------
const o5 = { name: 'o5' };
function logName() {
  console.log(this.name);
}
const logO5 = logName.bind(o5);
logO5();           // 输出？
logName.call(o5);  // 输出？
// 若再执行：logName();  输出？（在 Node 里 this 是 global，可能没有 name；严格模式下 this 是 undefined）

// ----------------------------------------
// 题 6：和 02-继承.js 里的「借用构造函数」一样
// 请填空：在 Child 里用 Parent 的代码给「当前正在 new 的实例」加上 name 和 age。
// ----------------------------------------
function Parent(name, age) {
  this.name = name;
  this.age = age;
}
function Child(name, age, grade) {
  // 在这里写一行：让 Parent 的代码在「当前 this」上执行，并传入 name, age
  // ???.call(???, name, age);
  this.grade = grade;
}
// 期望：const c = new Child('小明', 10, 3);  c.name=== '小明' 且 c.age === 10

console.log('\n========== 五、答案（先自己做再展开看） ==========\n');

/*
题 1：100
  原因：fn1.call(o1) 把 o1 当作 this 执行 fn1，fn1 里 this.x 就是 o1.x === 100。

题 2：O2 30
  原因：fn2 在 this 为 o2 时执行，this.name 是 'O2'，a+b 是 30。

题 3：18
  原因：bound = fn3.bind(o3)，之后 bound() 执行时 this 固定为 o3，this.age 为 18。

题 4：const result = sum.call(o4);  console.log(result);  // 10

题 4b：const str = Array.prototype.join.call(arrayLike, '-');
  原因：join 是数组的方法，内部用 this[0]、this[1]、this.length 等。用 call 把 this 指到 arrayLike，
  这样 join 就会按 arrayLike[0]、arrayLike[1]、arrayLike[2] 用 '-' 拼接，得到 "a-b-c"。这就是「借用」：对象自己没有 join，借数组的 join 来用。

题 5：
  logO5();           → 'o5'（bind 把 this 绑成 o5）
  logName.call(o5);  → 'o5'（call 指定 this 为 o5）
  logName();         → 直接调用时 this 由环境决定：Node 非严格下是 global，可能没有 name；严格模式下 this 是 undefined，访问 undefined.name 会报错。

题 6：Parent.call(this, name, age);
  原因：在 new Child(...) 时，Child 里的 this 就是正在创建的那个实例。用 Parent.call(this, name, age) 相当于「用这个实例当 this 执行一遍 Parent」，于是实例上就有了 name 和 age。
*/

// 下面取消注释可自动跑出「题 4」「题 4b」「题 6」的验证
// const result = sum.call(o4);
// console.log('题4 结果:', result);
// const str = Array.prototype.join.call(arrayLike, '-');
// console.log('题4b 结果:', str);  // "a-b-c"
// Parent.call(this, name, age);  → 题 6 填在 Child 里后，可测：
// const c = new Child('小明', 10, 3);
// console.log('题6 结果:', c.name, c.age, c.grade);
