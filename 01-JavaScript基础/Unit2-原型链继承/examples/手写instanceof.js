// 实现 myInstanceof(obj, Constructor)，判断 obj 的原型链上是否存在 Constructor.prototype。
function myInstanceof(obj, Constructor) {
    let proto = Object.getPrototypeOf(obj);
    while (proto) {
        if (proto === Constructor.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
    return false;
}
function Parent(name) {
    this.name = name;
}
Parent.prototype.sayHi = function () {
    console.log('Hi, ' + this.name);
}
function Child(name, grade) {
    this.grade = grade;
    Parent.call(this, name) // 继承 Parent的name属性
}
// 只继承原型不new Parent() 避免执行Parent构造函数 
// 通过 Object.create创造新的对象,继承原来的原型链的同时创建属于Child的新的原型对象
// 但是它的 __proto__还指向Parent.prototype所以巧妙地 既创建新的原型对象又继承维持了原型链
Child.prototype = Object.create(Parent.prototype);

Child.prototype.sayGrade = function () {
    console.log('Grade:' + this.grade)
}
// 因为 Object.create(Parent.prototype) 得到的对象会沿用 Parent.prototype.constructor（即 Parent），所以要手动设为 Child，避免 instanceof/constructor 判断不符合预期。
Child.prototype.constructor = Child;

const p = new Child('小姬', 6)
p.sayHi();
p.sayGrade();
const proto = Object.getPrototypeOf(p);
console.log(proto === Child.prototype);   // true
console.log(proto === Parent.prototype);  // false
console.log(Object.getPrototypeOf(proto) === Parent.prototype); // true