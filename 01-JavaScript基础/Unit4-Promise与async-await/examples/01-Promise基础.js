/**
 * Unit 4 - Promise 基础示例
 * 运行：node 01-Promise基础.js
 */

console.log('=== executor 同步，then 微任务 ===\n');

console.log(1);
const p = new Promise((resolve) => {
  console.log(2);  // executor 同步
  resolve();
}).then(() => console.log(3));  // then 回调微任务
console.log(4);

// 输出顺序：1  2  4  3
