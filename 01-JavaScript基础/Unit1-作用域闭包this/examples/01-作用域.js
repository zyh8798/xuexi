/**
 * Unit 1 - 作用域示例
 * 运行：node 01-作用域.js
 */

console.log('========== 1. var 函数作用域 vs let 块级作用域 ==========');

function varScope() {
  if (true) {
    var a = 1;
  }
  console.log('var a:', a); // 1，穿透了 if 块
}
varScope();

function letScope() {
  if (true) {
    let b = 2;
  }
  // console.log(b); // 取消注释会报错：ReferenceError
  console.log('let 在块外不可访问');
}
letScope();

console.log('\n========== 2. 变量提升 ==========');

console.log('提升的 x:', x); // undefined
var x = 10;
console.log('赋值后的 x:', x); // 10

// console.log(y); // 取消注释会报错：ReferenceError（TDZ）
let y = 20;

console.log('\n========== 3. 作用域链 ==========');

var global = 'global';

function outer() {
  var outerVar = 'outer';
  console.log('outer 内:', global, outerVar);

  function inner() {
    var innerVar = 'inner';
    console.log('inner 内:', global, outerVar, innerVar); // 都能访问
  }
  inner();
}
outer();

console.log('\n========== 4. const 必须初始化 ==========');

const PI = 3.14;
// PI = 3.15; // 报错：Assignment to constant variable

const obj = { a: 1 };
obj.a = 2; // ✅ 可以改属性
// obj = {};  // ❌ 不能重新赋值
