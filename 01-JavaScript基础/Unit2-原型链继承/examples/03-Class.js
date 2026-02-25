/**
 * Unit 2 - ES6 Class 与继承
 * 运行：node 03-Class.js
 */

console.log('========== 一、Class 基本语法 ==========\n');

class Person {
  constructor(name) {
    this.name = name; // 实例属性
  }
  sayHi() {
    // 原型方法
    console.log('Hi, ' + this.name);
  }
  static create() {
    // 静态方法，挂在 Person 上
    return new Person('default');
  }
}

const p = new Person('张三');
p.sayHi();
console.log('typeof Person:', typeof Person); // function，Class 本质是函数
console.log('Person.prototype.sayHi:', typeof Person.prototype.sayHi); // function

const p2 = Person.create();
console.log('p2.name:', p2.name); // default

console.log('\n========== 二、Class 继承 ==========\n');

class Student extends Person {
  constructor(name, grade) {
    super(name); // 必须先调用 super，才能用 this
    this.grade = grade;
  }
  sayGrade() {
    console.log('Grade: ' + this.grade);
  }
}

const student = new Student('李四', 3);
student.sayHi(); // 继承自 Person
student.sayGrade();

console.log('student instanceof Student:', student instanceof Student);
console.log('student instanceof Person:', student instanceof Person);
console.log('Student.prototype.__proto__ === Person.prototype:', Student.prototype.__proto__ === Person.prototype);

console.log('\n--- Class 与 ES5 寄生组合继承等价 ---');
console.log('extends 相当于：Student.prototype.__proto__ = Person.prototype');
console.log('super(name) 相当于：Person.call(this, name)');
