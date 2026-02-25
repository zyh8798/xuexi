/**
 * Unit 1 - 闭包示例
 * 运行：node 02-闭包.js
 */

console.log('========== 1. 闭包基础：函数记住了外层变量 ==========');

function createCounter() {
  let count = 0; // 外层变量
  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
// count 被闭包「记住」了，createCounter 执行完也没被回收

console.log('\n========== 2. 数据私有化（模块模式） ==========');

function createWallet() {
  let money = 0; // 私有变量，外部无法直接访问
  return {
    deposit: function (amount) {
      money += amount;
      return money;
    },
    withdraw: function (amount) {
      money -= amount;
      return money;
    },
    getBalance: function () {
      return money;
    },
  };
}

const wallet = createWallet();
wallet.deposit(100);
console.log('余额:', wallet.getBalance()); // 100
// console.log(wallet.money); // undefined，无法直接访问

console.log('\n========== 3. 循环 + 闭包（经典坑） ==========');

// 错误写法：var 导致 i 共享
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log('var i:', i); // 3, 3, 3
  }, 100);
}

// 正确写法 1：用 let（块级作用域，每次循环独立的 j）
for (let j = 0; j < 3; j++) {
  setTimeout(function () {
    console.log('let j:', j); // 0, 1, 2
  }, 150);
}

// 正确写法 2：用 IIFE 创建闭包，保存每次的 k
for (var k = 0; k < 3; k++) {
  (function (num) {
    setTimeout(function () {
      console.log('IIFE k:', num); // 0, 1, 2
    }, 200);
  })(k);
}
