/**
 * Unit 1 - this 示例
 * 运行：node 03-this.js
 */

console.log('========== 1. 默认绑定（独立调用） ==========');

function fn1() {
  console.log('this:', this); // 非严格模式：global/window；严格模式：undefined
}
fn1();

console.log('\n========== 2. 隐式绑定（对象方法） ==========');

const obj = {
  name: 'obj',
  sayName: function () {
    console.log('this.name:', this.name);
  },
};
obj.sayName(); // obj

// 隐式丢失
const say = obj.sayName;
say(); // undefined 或 全局对象的 name，因为 say 是独立调用

console.log('\n========== 3. 显式绑定（call/apply/bind） ==========');

function greet(greeting, punctuation, way) {
  console.log('greeting:', greeting, 'punctuation:', punctuation, 'way:', way);
  // console.log(greeting + ', ' + this.name + punctuation);
}

const person = { name: '张三' };
greet.call(person, '你好', '!', 'call');   // 你好, 张三!
greet.apply(person, ['你好', '!', 'apply']); // 你好, 张三!

const boundGreet = greet.bind(person, '你好');
boundGreet('!', 'bind'); // 你好, 张三!

console.log('\n========== 4. new 绑定 ==========');

function Person(name) {
  this.name = name;
}
const p = new Person('李四');
console.log('new 出来的 p.name:', p.name); // 李四

console.log('\n========== 5. 箭头函数不绑定 this ==========');

const obj2 = {
  name: 'obj2',
  fn: function () {
    console.log('普通函数 this:', this.name); // obj2
    setTimeout(() => {
      console.log('箭头函数 this:', this.name); // obj2，继承外层
    }, 0);
  },
};
obj2.fn();
