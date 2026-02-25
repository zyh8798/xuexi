/**
 * Unit 1 - 执行上下文示例
 * 运行：node 04-执行上下文.js
 */

console.log('========== 1. 变量提升（var） ==========');

// 实际执行顺序相当于：
// var hoisted;
// console.log(hoisted);  // undefined
// hoisted = 'value';
console.log('hoisted:', hoisted); // undefined
var hoisted = 'value';
console.log('hoisted:', hoisted); // value

console.log('\n========== 2. 函数声明提升 ==========');

foo(); // 可以调用，函数声明整体提升
function foo() {
  console.log('foo 被调用了');
}

// bar(); // 报错：bar is not a function
var bar = function () {
  console.log('bar');
};
// 函数表达式只提升 var bar，值为 undefined，不是函数

console.log('\n========== 3. 暂时性死区（TDZ） ==========');

{
  // TDZ 开始
  // console.log(tdzVar); // ReferenceError
  let tdzVar = 'ok'; // TDZ 结束
  console.log('tdzVar:', tdzVar); // ok
}

console.log('\n========== 4. 调用栈理解 ==========');

function first() {
  console.log('first 开始');
  second();
  console.log('first 结束');
}

function second() {
  console.log('second 开始');
  third();
  console.log('second 结束');
}

function third() {
  console.log('third');
}

first();
// 输出顺序：first 开始 -> second 开始 -> third -> second 结束 -> first 结束
// 栈：first 入栈 -> second 入栈 -> third 入栈 -> third 出 -> second 出 -> first 出
