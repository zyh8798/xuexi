/**
 * Unit 2 - 原型链：prototype、__proto__、查找机制
 * 运行：node 01-原型链.js
 */

console.log('========== 一、prototype 与 __proto__ 关系 ==========\n');

function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function () {
  console.log('Hi, ' + this.name);
};

const p = new Person('张三');

console.log('p.name:', p.name); // 自身属性
console.log('p.hasOwnProperty("sayHi"):', p.hasOwnProperty('sayHi')); // false，sayHi 在原型上
console.log('p.__proto__ === Person.prototype:', p.__proto__ === Person.prototype); // true
console.log('Person.prototype.constructor === Person:', Person.prototype.constructor === Person); // true

console.log('\n--- 查找 p.sayHi 的过程 ---');
console.log('1. p 自己有 sayHi 吗？', p.hasOwnProperty('sayHi'));
console.log('2. 去 p.__proto__（Person.prototype）找');
console.log('3. Person.prototype 有 sayHi 吗？', 'sayHi' in Person.prototype);
p.sayHi(); // Hi, 张三

console.log('\n========== 二、原型链的尽头 ==========\n');

console.log('p → Person.prototype → Object.prototype → null');
console.log('Person.prototype.__proto__ === Object.prototype:', Person.prototype.__proto__ === Object.prototype);
console.log('Object.prototype.__proto__ === null:', Object.prototype.__proto__ === null);

console.log('\n--- 验证：所有对象最终继承 Object.prototype ---');
console.log('p.toString:', typeof p.toString); // function，来自 Object.prototype
console.log('p.hasOwnProperty:', typeof p.hasOwnProperty); // function

console.log('\n========== 三、instanceof 原理 ==========\n');

// instanceof 检查：对象的原型链上是否存在某构造函数的 prototype
console.log('p instanceof Person:', p instanceof Person); // true
console.log('p instanceof Object:', p instanceof Object); // true
console.log('Person.prototype instanceof Object:', Person.prototype instanceof Object); // true
