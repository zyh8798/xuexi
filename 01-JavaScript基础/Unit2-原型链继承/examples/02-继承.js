/**
 * Unit 2 - 继承：多种方式、寄生组合继承
 * 运行：node 02-继承.js
 */

console.log('========== 一、原型链继承（有缺陷） ==========\n');

function Parent1() {
  this.names = ['a', 'b'];
}
function Child1() { }
Child1.prototype = new Parent1();

const c1a = new Child1();
const c1b = new Child1();
c1a.names.push('c');
console.log('c1b.names:', c1b.names); // ['a', 'b', 'c'] 引用类型被共享！

console.log('\n========== 二、构造函数继承（有缺陷） ==========\n');

function Parent2(name) {
  this.name = name;
  this.sayName = function () {
    console.log(this.name);
  };
}
function Child2(name) {
  Parent2.call(this, name); // 借用构造函数
}

const c2a = new Child2('小明');
const c2b = new Child2('小红');
console.log('c2a.sayName === c2b.sayName:', c2a.sayName === c2b.sayName); // false，方法重复创建

console.log('\n========== 三、寄生组合继承（推荐） ==========\n');

function Parent(name) {
  this.name = name;
}
Parent.prototype.sayHi = function () {
  console.log('Hi, ' + this.name);
};

function Child(name, grade) {
  Parent.call(this, name); // 1. 继承实例属性
  this.grade = grade;
}

// 2. 继承原型方法，不执行 new Parent()
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.sayGrade = function () {
  console.log('Grade: ' + this.grade);
};

const student = new Child('李四', 3);
console.log('student.name:', student.name);
console.log('student.grade:', student.grade);
student.sayHi(); // 来自 Parent.prototype
student.sayGrade(); // 来自 Child.prototype
console.log('student instanceof Child:', student instanceof Child);
console.log('student instanceof Parent:', student instanceof Parent);

console.log('\n--- 封装成 inherit 函数 ---');

function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}

function Student(name, grade) {
  Parent.call(this, name);
  this.grade = grade;
}
inherit(Student, Parent);

const s = new Student('王五', 2);
s.sayHi();
console.log('s.constructor === Student:', s.constructor === Student);
console.log(Student.prototype.__proto__ === Parent.prototype, '666')
