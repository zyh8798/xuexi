/**
 * Unit 3 - 事件循环基础示例
 * 运行：node 01-事件循环基础.js
 */

console.log('=== 同步 → 微任务 → 宏任务 ===\n');

console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
console.log(4);

// 输出顺序：1 4 3 2
